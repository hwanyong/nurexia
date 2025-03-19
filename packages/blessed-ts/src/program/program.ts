/**
 * program.ts - basic curses-like functionality for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/chjj/blessed
 */

import { EventEmitter } from '../utils/events';
import { StringDecoder } from 'string_decoder';
import * as cp from 'child_process';
import * as util from 'util';
import * as fs from 'fs';
import { Tput } from './tput';
import * as colors from '../utils/colors';
import { Keys, KeyEvent, KeyOptions, IMECompositionEvent } from './keys';

const nextTick = global.setImmediate || process.nextTick.bind(process);

/**
 * Type definitions
 */
export interface ProgramOptions {
  input?: NodeJS.ReadableStream;
  output?: NodeJS.WritableStream;
  log?: string;
  dump?: boolean;
  zero?: boolean;
  buffer?: boolean;
  terminal?: string;
  term?: string;
  tput?: boolean;
  debug?: boolean;
}

/**
 * Program class - Handles terminal input/output and cursor control
 */
export class Program extends EventEmitter {
  static global: Program | null = null;
  static total: number = 0;
  static instances: Program[] = [];
  static _bound: boolean = false;
  static _exitHandler?: () => void;

  options: ProgramOptions;
  input: NodeJS.ReadableStream;
  output: NodeJS.WritableStream;
  _logger?: fs.WriteStream;

  zero: boolean;
  useBuffer: boolean;

  x: number = 0;
  y: number = 0;
  savedX: number = 0;
  savedY: number = 0;

  cols: number;
  rows: number;

  scrollTop: number = 0;
  scrollBottom: number;

  _terminal: string;
  _tputSetup: boolean = false;
  _exiting: boolean = false;
  index: number = 0;

  // Terminal type detection
  isOSXTerm: boolean;
  isiTerm2: boolean;
  isXFCE: boolean;
  isTerminator: boolean;
  isLXDE: boolean = false;
  isVTE: boolean;
  isRxvt: boolean;
  isXterm: boolean = false;
  tmux: boolean;
  tmuxVersion: number;

  // Buffer handling
  _buf: string = '';
  _flush: () => void;

  // Original write function
  private _originalWrite?: (data: string | Uint8Array) => boolean;

  // Add Keys instance
  private keys: Keys;

  // Track IME composition state
  private _imeComposing: boolean = false;
  private _imeCompositionData: string = '';

  constructor(options: ProgramOptions = {}) {
    super();

    Program.bind(this);

    this.options = options;
    this.input = options.input || process.stdin;
    this.output = options.output || process.stdout;

    if (options.log) {
      this._logger = fs.createWriteStream(options.log);
      if (options.dump) this.setupDump();
    }

    this.zero = options.zero !== false;
    this.useBuffer = options.buffer || false;

    this.cols = (this.output as any).columns || 1;
    this.rows = (this.output as any).rows || 1;
    this.scrollBottom = this.rows - 1;

    this._terminal = (options.terminal
      || options.term
      || process.env.TERM
      || (process.platform === 'win32' ? 'windows-ansi' : 'xterm')).toLowerCase();

    // Terminal detection
    this.isOSXTerm = process.env.TERM_PROGRAM === 'Apple_Terminal';
    this.isiTerm2 = process.env.TERM_PROGRAM === 'iTerm.app'
      || !!process.env.ITERM_SESSION_ID;

    this.isXFCE = /xfce/i.test(process.env.COLORTERM || '');
    this.isTerminator = !!process.env.TERMINATOR_UUID;
    this.isVTE = !!process.env.VTE_VERSION
      || this.isXFCE
      || this.isTerminator
      || this.isLXDE;

    this.isRxvt = /rxvt/i.test(process.env.COLORTERM || '');

    this.tmux = !!process.env.TMUX;
    this.tmuxVersion = this._detectTmuxVersion();

    this._flush = this.flush.bind(this);

    if (options.tput !== false) {
      this.setupTput();
    }

    // Initialize Keys with appropriate options
    this.keys = new Keys({
      enableIME: true
    });

    this.listen();
  }

  /**
   * Detect tmux version
   */
  private _detectTmuxVersion(): number {
    if (!this.tmux) return 2;
    try {
      const version = cp.execFileSync('tmux', ['-V'], { encoding: 'utf8' });
      const match = /^tmux ([\d.]+)/i.exec(version.trim().split('\n')[0]);
      return match ? +match[1] : 2;
    } catch (e) {
      return 2;
    }
  }

  /**
   * Bind program instance
   */
  static bind(program: Program): void {
    if (!Program.global) {
      Program.global = program;
    }

    if (!Program.instances.includes(program)) {
      Program.instances.push(program);
      program.index = Program.total++;
    }

    if (Program._bound) return;
    Program._bound = true;

    Program._exitHandler = () => {
      Program.instances.forEach((program) => {
        program.flush();
        program._exiting = true;
      });
    };

    process.on('exit', Program._exitHandler);
  }

  /**
   * Log message to debug file
   */
  log(...args: any[]): void {
    this._log('LOG', util.format(...args));
  }

  /**
   * Log debug message
   */
  debug(...args: any[]): void {
    if (!this.options.debug) return;
    this._log('DEBUG', util.format(...args));
  }

  /**
   * Internal logging
   */
  private _log(pre: string, msg: string): void {
    if (!this._logger) return;
    this._logger.write(`${pre}: ${msg}\n-\n`);
  }

  /**
   * Setup dump mode for debugging
   */
  setupDump(): void {
    const decoder = new StringDecoder('utf8');
    this._originalWrite = this.output.write;

    const stringify = (data: string | Buffer): string => {
      const str = typeof data === 'string' ? data : decoder.write(data);
      return this._formatControlChars(str)
        .replace(/[^ -~]/g, (ch) => {
          const code = ch.charCodeAt(0);
          if (code > 0xff) return ch;
          let hex = code.toString(16);
          if (hex.length > 2) {
            if (hex.length < 4) hex = '0' + hex;
            return '\\u' + hex;
          }
          if (hex.length < 2) hex = '0' + hex;
          return '\\x' + hex;
        });
    };

    this.input.on('data', (data: Buffer) => {
      this._log('IN', stringify(data));
    });

    this.output.write = (data: string | Uint8Array): boolean => {
      this._log('OUT', stringify(data as string));
      return this._originalWrite!.call(this.output, data);
    };
  }

  /**
   * Format control characters for display
   */
  private _formatControlChars(data: string): string {
    return data.replace(/[\0\x80\x1b-\x1f\x7f\x01-\x1a]/g, (ch) => {
      let formatted: string;
      switch (ch) {
        case '\0':
        case '\x80':
          formatted = '@';
          break;
        case '\x1b':
          formatted = '[';
          break;
        case '\x1c':
          formatted = '\\';
          break;
        case '\x1d':
          formatted = ']';
          break;
        case '\x1e':
          formatted = '^';
          break;
        case '\x1f':
          formatted = '_';
          break;
        case '\x7f':
          formatted = '?';
          break;
        default:
          const code = ch.charCodeAt(0);
          if (code >= 1 && code <= 26) {
            formatted = String.fromCharCode(code + 64);
          } else {
            return ch;
          }
      }
      return '^' + formatted;
    });
  }

  /**
   * Setup terminal capabilities
   */
  setupTput(): void {
    if (this._tputSetup) return;
    this._tputSetup = true;

    const tput = new Tput({
      terminal: this._terminal,
      padding: true,
      extended: true,
      debug: this.options.debug
    });

    Object.assign(this, tput);
  }

  /**
   * Setup event listeners
   */
  listen(): void {
    const decoder = new StringDecoder('utf8');
    this.input.on('data', (data: Buffer) => {
      this._onData(decoder.write(data));
    });
  }

  /**
   * Write data to output stream
   */
  _write(data: string): boolean {
    if (this._exiting) return false;
    if (this.useBuffer) {
      this._buf += data;
      return true;
    }
    return this.output.write(data);
  }

  /**
   * Flush buffer to output
   */
  flush(): void {
    if (this._buf) {
      const data = this._buf;
      this._buf = '';
      this.output.write(data);
    }
  }

  // Terminal control methods implementation:

  /**
   * Handle input data
   */
  _onData(data: string): void {
    // Emit data event
    this.emit('data', data);

    // Parse input data
    this._parseKey(data);
  }

  /**
   * Parse key input data
   */
  _parseKey(data: string): void {
    // Check for IME composition
    const imeResult = this.keys.checkComposing(data);

    // Handle IME composition events
    if (imeResult.event) {
      this._handleIMEEvent(imeResult.event);
    }

    // Skip further processing if in IME composition mode
    if (imeResult.skip) {
      return;
    }

    // Process the data (possibly transformed by IME)
    data = imeResult.data;

    // Parse the key using Keys implementation
    const key = this.keys.parseKey(data);

    if (key) {
      // Add IME composition state to the key event
      key.isComposing = this._imeComposing;
      key.compositionData = this._imeCompositionData;

      // Emit the keypress event with the processed key
      this.emit('keypress', data, key);
    }
  }

  /**
   * Handle IME composition events
   */
  private _handleIMEEvent(event: IMECompositionEvent): void {
    switch (event.type) {
      case 'compositionstart':
        this._imeComposing = true;
        this._imeCompositionData = '';
        this.emit('compositionstart', event.data);
        break;

      case 'compositionupdate':
        this._imeComposing = true;
        this._imeCompositionData = event.data;
        this.emit('compositionupdate', event.data);
        break;

      case 'compositionend':
        this._imeComposing = false;
        this._imeCompositionData = '';
        this.emit('compositionend', event.data);
        break;
    }
  }

  /**
   * Force end composition (useful when widget loses focus)
   */
  endComposition(): string {
    const result = this.keys.endComposition();

    if (this._imeComposing) {
      this._imeComposing = false;
      this._imeCompositionData = '';
      this.emit('compositionend', result);
    }

    return result;
  }

  /**
   * Check if currently in IME composition
   */
  isComposing(): boolean {
    return this._imeComposing;
  }

  /**
   * Get current IME composition data
   */
  getCompositionData(): string {
    return this._imeCompositionData;
  }

  /**
   * Set cursor position
   */
  cursorPos(x: number, y: number): boolean {
    if (this.zero) {
      x = +x;
      y = +y;
    } else {
      x = +x + 1;
      y = +y + 1;
    }

    // Keep track of cursor position
    this.x = x - (this.zero ? 0 : 1);
    this.y = y - (this.zero ? 0 : 1);

    // Send command to terminal
    return this._write(`\x1b[${y};${x}H`);
  }

  /**
   * Move cursor to home position (0, 0)
   */
  home(): boolean {
    this.x = 0;
    this.y = 0;
    return this._write('\x1b[H');
  }

  /**
   * Move cursor left
   */
  left(n: number = 1): boolean {
    this.x = Math.max(0, this.x - n);
    if (n < 1) return true;
    return this._write(`\x1b[${n}D`);
  }

  /**
   * Move cursor right
   */
  right(n: number = 1): boolean {
    this.x += n;
    if (n < 1) return true;
    return this._write(`\x1b[${n}C`);
  }

  /**
   * Move cursor up
   */
  up(n: number = 1): boolean {
    this.y = Math.max(0, this.y - n);
    if (n < 1) return true;
    return this._write(`\x1b[${n}A`);
  }

  /**
   * Move cursor down
   */
  down(n: number = 1): boolean {
    this.y += n;
    if (n < 1) return true;
    return this._write(`\x1b[${n}B`);
  }

  /**
   * Clear screen
   */
  clear(): boolean {
    this.x = 0;
    this.y = 0;
    return this._write('\x1b[2J\x1b[H');
  }

  /**
   * Clear to end of line
   */
  clearLine(n: number = 0): boolean {
    switch (n) {
      case 0:
        // Clear to end of line
        return this._write('\x1b[K');
      case 1:
        // Clear from beginning of line
        return this._write('\x1b[1K');
      case 2:
        // Clear entire line
        return this._write('\x1b[2K');
      default:
        return this._write('\x1b[K');
    }
  }

  /**
   * Save cursor position
   */
  saveCursor(): boolean {
    this.savedX = this.x;
    this.savedY = this.y;
    return this._write('\x1b[s');
  }

  /**
   * Restore cursor position
   */
  restoreCursor(): boolean {
    this.x = this.savedX;
    this.y = this.savedY;
    return this._write('\x1b[u');
  }

  /**
   * Set text style (color, bold, etc)
   */
  setStyle(style: string | number): boolean {
    return this._write(`\x1b[${style}m`);
  }

  /**
   * Reset text style
   */
  resetStyle(): boolean {
    return this._write('\x1b[0m');
  }

  /**
   * Set foreground color
   */
  setForeground(color: number | string): boolean {
    const ansiCode = typeof color === 'number'
      ? color
      : colors.convert(color);
    return this._write(`\x1b[38;5;${ansiCode}m`);
  }

  /**
   * Set background color
   */
  setBackground(color: number | string): boolean {
    const ansiCode = typeof color === 'number'
      ? color
      : colors.convert(color);
    return this._write(`\x1b[48;5;${ansiCode}m`);
  }

  /**
   * Enable/disable cursor
   */
  cursor(visible: boolean): boolean {
    return this._write(visible ? '\x1b[?25h' : '\x1b[?25l');
  }

  /**
   * Set scroll region
   */
  setScrollRegion(top: number, bottom: number): boolean {
    this.scrollTop = top;
    this.scrollBottom = bottom;
    return this._write(`\x1b[${top + 1};${bottom + 1}r`);
  }

  /**
   * Reset scroll region
   */
  resetScrollRegion(): boolean {
    this.scrollTop = 0;
    this.scrollBottom = this.rows - 1;
    return this._write(`\x1b[1;${this.rows}r`);
  }

  /**
   * Enable/disable alternative screen buffer
   */
  alternateBuffer(enabled: boolean): boolean {
    return this._write(enabled ? '\x1b[?1049h' : '\x1b[?1049l');
  }

  /**
   * Beep - play the alert sound
   */
  beep(): boolean {
    return this._write('\x07');
  }

  /**
   * Show cursor
   */
  showCursor(): boolean {
    return this.cursor(true);
  }

  /**
   * Hide cursor
   */
  hideCursor(): boolean {
    return this.cursor(false);
  }
}