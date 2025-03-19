/**
 * terminal.ts - terminal element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import * as cp from 'child_process';
import { Box, BoxOptions } from './box';
import { NodeType } from '../types';
import { Screen } from './screen';
import { Element } from './element';

const nextTick = global.setImmediate || process.nextTick.bind(process);

/**
 * Terminal options interface
 */
export interface TerminalOptions extends BoxOptions {
  handler?: (data: string) => void;
  shell?: string;
  args?: string[];
  cursor?: 'block' | 'underline' | 'line';
  cursorBlink?: boolean;
  screenKeys?: boolean;
  term?: string;
  terminal?: string;
  env?: NodeJS.ProcessEnv;
}

/**
 * Terminal widget for embedding terminal emulators
 *
 * Note: This implementation requires external dependencies:
 * - term.js: For terminal emulation
 * - pty.js or node-pty: For pseudo-terminal functionality
 *
 * These dependencies need to be installed separately.
 */
export class Terminal extends Box {
  /**
   * Widget type
   */
  type: NodeType = 'terminal';

  /**
   * Terminal-specific properties
   */
  handler: (data: string) => void;
  shell: string;
  args: string[];
  cursor: 'block' | 'underline' | 'line' | null;
  cursorBlink: boolean;
  screenKeys: boolean;
  termName: string;
  term: any; // term.js instance
  pty: any;  // pty.js instance
  _onData: (data: string | Buffer) => void = () => {};
  title?: string;
  dattr: number;

  // Layout properties
  aleft = 0;
  atop = 0;
  ileft = 0;
  itop = 0;
  iright = 0;
  ibottom = 0;
  iwidth = 0;
  iheight = 0;

  /**
   * Terminal constructor
   */
  constructor(options: TerminalOptions = {}) {
    // Force scrollable to be false to handle our own scrolling
    options.scrollable = false;

    super(options);

    // XXX Workaround for all motion
    const screen = this.screen as any;
    if (screen && screen.program && screen.program.tmux && screen.program.tmuxVersion >= 2) {
      screen.program.enableMouse();
    }

    this.handler = options.handler || (() => {});
    this.shell = options.shell || process.env.SHELL || 'sh';
    this.args = options.args || [];

    this.cursor = options.cursor || null;
    this.cursorBlink = !!options.cursorBlink;
    this.screenKeys = !!options.screenKeys;

    // Set default style
    this.style = this.style || {};
    this.style.bg = this.style.bg || 'default';
    this.style.fg = this.style.fg || 'default';

    this.termName = options.terminal || options.term || process.env.TERM || 'xterm';
    this.dattr = 0;

    // Initialize the terminal
    this.bootstrap();
  }

  /**
   * Initialize the terminal with term.js
   */
  bootstrap(): void {
    const self = this as Terminal;

    // Create a mock DOM element for term.js
    const element = this._createMockElement();

    try {
      // Attempt to load term.js
      // Note: This requires term.js to be installed as a dependency
      const termJs = require('term.js');

      this.term = termJs({
        termName: this.termName,
        cols: typeof this.width === 'number' ? this.width - this.iwidth : 80,
        rows: typeof this.height === 'number' ? this.height - this.iheight : 24,
        context: element,
        document: element,
        body: element,
        parent: element,
        cursorBlink: this.cursorBlink,
        screenKeys: this.screenKeys
      });

      // Override refresh to trigger screen render
      this.term.refresh = function() {
        const screen = self.screen as any;
        if (screen && typeof screen.render === 'function') screen.render();
      };

      this.term.keyDown = function() {};
      this.term.keyPress = function() {};

      this.term.open(element);

      // Set up input handling
      this._setupInput();

      // Set up event handlers
      this._setupEvents();

      // Set up PTY if no handler was provided
      if (!this.handler) {
        this._setupPty();
      }
    } catch (e) {
      console.error('Error initializing terminal:', e);
      throw new Error('Failed to initialize terminal. Make sure term.js is installed: ' + (e as Error).message);
    }
  }

  /**
   * Create a mock DOM element for term.js
   */
  private _createMockElement(): any {
    const element: any = {
      // window
      get document() { return element; },
      navigator: { userAgent: 'node.js' },

      // document
      get defaultView() { return element; },
      get documentElement() { return element; },
      createElement: function() { return element; },

      // element
      get ownerDocument() { return element; },
      addEventListener: function() {},
      removeEventListener: function() {},
      getElementsByTagName: function() { return [element]; },
      getElementById: function() { return element; },
      parentNode: null,
      offsetParent: null,
      appendChild: function() {},
      removeChild: function() {},
      setAttribute: function() {},
      getAttribute: function() {},
      style: {},
      focus: function() {},
      blur: function() {},
      console: console
    };

    element.parentNode = element;
    element.offsetParent = element;

    return element;
  }

  /**
   * Set up input handling
   */
  private _setupInput(): void {
    const self = this as Terminal;

    // Handle input from program
    this._onData = function(data: string | Buffer) {
      const screen = self.screen as any;
      if (screen && screen.focused === self && !self._isMouse(data)) {
        self.handler(data.toString());
      }
    };

    const screen = this.screen as any;
    if (screen && screen.program && screen.program.input) {
      screen.program.input.on('data', this._onData);
    }

    // Handle mouse events
    this.onScreenEvent('mouse', function(data: any) {
      const screen = self.screen as any;
      if (!screen || screen.focused !== self) return;

      if (data.x < self.aleft + self.ileft) return;
      if (data.y < self.atop + self.itop) return;
      if (data.x > self.aleft - self.ileft + (typeof self.width === 'number' ? self.width : 0)) return;
      if (data.y > self.atop - self.itop + (typeof self.height === 'number' ? self.height : 0)) return;

      if (self.term.x10Mouse
          || self.term.vt200Mouse
          || self.term.normalMouse
          || self.term.mouseEvents
          || self.term.utfMouse
          || self.term.sgrMouse
          || self.term.urxvtMouse) {
        ;
      } else {
        return;
      }

      let b = data.raw[0];
      const x = data.x - self.aleft;
      const y = data.y - self.atop;
      let s: string;

      if (self.term.urxvtMouse) {
        if (screen && screen.program && screen.program.sgrMouse) {
          b += 32;
        }
        s = `\x1b[${b};${(x + 32)};${(y + 32)}M`;
      } else if (self.term.sgrMouse) {
        if (screen && screen.program && !screen.program.sgrMouse) {
          b -= 32;
        }
        s = `\x1b[<${b};${x};${y}${data.action === 'mousedown' ? 'M' : 'm'}`;
      } else {
        if (screen && screen.program && screen.program.sgrMouse) {
          b += 32;
        }
        s = '\x1b[M'
          + String.fromCharCode(b)
          + String.fromCharCode(x + 32)
          + String.fromCharCode(y + 32);
      }

      self.handler(s);
    });
  }

  /**
   * Helper method for screen events
   */
  onScreenEvent(type: string, handler: (...args: any[]) => void): this {
    const screen = this.screen as any;
    if (screen && typeof screen.on === 'function') {
      screen.on(type, handler);
    }
    return this;
  }

  /**
   * Set up event handlers
   */
  private _setupEvents(): void {
    const self = this as Terminal;

    // Focus/blur events
    this.on('focus', function() {
      self.term.focus();
    });

    this.on('blur', function() {
      self.term.blur();
    });

    // Title events
    this.term.on('title', function(title: string) {
      self.title = title;
      self.emit('title', title);
    });

    // Passthrough events
    this.term.on('passthrough', function(data: string) {
      const screen = self.screen as any;
      if (screen && screen.program) {
        screen.program.flush();
        screen.program._owrite(data);
      }
    });

    // Resize events
    this.on('resize', function() {
      nextTick(function() {
        if (typeof self.width === 'number' && typeof self.height === 'number') {
          self.term.resize(self.width - self.iwidth, self.height - self.iheight);
        }
      });
    });

    this.once('render', function() {
      if (typeof self.width === 'number' && typeof self.height === 'number') {
        self.term.resize(self.width - self.iwidth, self.height - self.iheight);
      }
    });

    // Cleanup on destroy
    this.on('destroy', function() {
      self.kill();
      const screen = self.screen as any;
      if (screen && screen.program) {
        screen.program.input.removeListener('data', self._onData);
      }
    });

    // Set up key listening
    const screen = this.screen as any;
    if (screen && typeof screen._listenKeys === 'function') {
      screen._listenKeys(this);
    }
  }

  /**
   * Set up PTY (pseudo-terminal)
   */
  private _setupPty(): void {
    const self = this as Terminal;

    try {
      // Try to load node-pty first, fall back to pty.js
      let ptyModule;
      try {
        ptyModule = require('node-pty');
      } catch (e) {
        ptyModule = require('pty.js');
      }

      this.pty = ptyModule.spawn(this.shell, this.args, {
        name: this.termName,
        cols: typeof this.width === 'number' ? this.width - this.iwidth : 80,
        rows: typeof this.height === 'number' ? this.height - this.iheight : 24,
        cwd: process.env.HOME,
        env: (this.options as TerminalOptions).env || process.env
      });

      // Handle resize events
      this.on('resize', function() {
        nextTick(function() {
          try {
            if (typeof self.width === 'number' && typeof self.height === 'number') {
              self.pty.resize(self.width - self.iwidth, self.height - self.iheight);
            }
          } catch (e) {
            // Ignore resize errors
          }
        });
      });

      // Set up data handler to write to the PTY
      this.handler = function(data: string) {
        self.pty.write(data);
        const screen = self.screen as any;
        if (screen && typeof screen.render === 'function') screen.render();
      };

      // Handle data from the PTY
      this.pty.on('data', function(data: string) {
        self.write(data);
        const screen = self.screen as any;
        if (screen && typeof screen.render === 'function') screen.render();
      });

      // Handle PTY exit
      this.pty.on('exit', function(code: number) {
        self.emit('exit', code || null);
      });

      // Handle keypresses
      this.onScreenEvent('keypress', function() {
        const screen = self.screen as any;
        if (screen && typeof screen.render === 'function') screen.render();
      });
    } catch (e) {
      console.error('Error setting up PTY:', e);
      throw new Error('Failed to initialize PTY. Make sure node-pty or pty.js is installed: ' + (e as Error).message);
    }
  }

  /**
   * Write data to the terminal
   */
  write(data: string): any {
    return this.term.write(data);
  }

  /**
   * Render the terminal
   */
  render(): any {
    const ret = this._render();
    if (!ret) return;

    this.dattr = this._sattr(this.style);

    const xi = ret.xi + this.ileft;
    const xl = ret.xl - this.iright;
    const yi = ret.yi + this.itop;
    const yl = ret.yl - this.ibottom;
    let cursor: number;

    const scrollback = this.term.lines.length - (yl - yi);
    const screen = this.screen as any;

    for (let y = Math.max(yi, 0); y < yl; y++) {
      if (!screen || !screen.lines) break;
      const line = screen.lines[y];
      if (!line || !this.term.lines[scrollback + y - yi]) break;

      if (y === yi + this.term.y
          && this.term.cursorState
          && screen.focused === this
          && (this.term.ydisp === this.term.ybase || this.term.selectMode)
          && !this.term.cursorHidden) {
        cursor = xi + this.term.x;
      } else {
        cursor = -1;
      }

      for (let x = Math.max(xi, 0); x < xl; x++) {
        if (!line[x] || !this.term.lines[scrollback + y - yi][x - xi]) break;

        line[x][0] = this.term.lines[scrollback + y - yi][x - xi][0];

        if (x === cursor) {
          if (this.cursor === 'line') {
            line[x][0] = this.dattr;
            line[x][1] = '\u2502';
            continue;
          } else if (this.cursor === 'underline') {
            line[x][0] = this.dattr | (2 << 18);
          } else if (this.cursor === 'block' || !this.cursor) {
            line[x][0] = this.dattr | (8 << 18);
          }
        }

        line[x][1] = this.term.lines[scrollback + y - yi][x - xi][1];

        // default foreground = 257
        if (((line[x][0] >> 9) & 0x1ff) === 257) {
          line[x][0] &= ~(0x1ff << 9);
          line[x][0] |= ((this.dattr >> 9) & 0x1ff) << 9;
        }

        // default background = 256
        if ((line[x][0] & 0x1ff) === 256) {
          line[x][0] &= ~0x1ff;
          line[x][0] |= this.dattr & 0x1ff;
        }
      }

      line.dirty = true;
    }

    return ret;
  }

  /**
   * Internal render method
   */
  _render(): any {
    return super.render();
  }

  /**
   * Style attribute method
   */
  _sattr(style: any): number {
    // Call Element's sattr method using call to maintain proper context
    return (Element.prototype as any).sattr.call(this, style);
  }

  /**
   * Check if a buffer is a mouse event
   */
  _isMouse(buf: string | Buffer): boolean {
    let s = buf;
    if (Buffer.isBuffer(s)) {
      if (s[0] > 127 && s[1] === undefined) {
        s[0] -= 128;
        s = '\x1b' + s.toString('utf-8');
      } else {
        s = s.toString('utf-8');
      }
    }

    const bufStr = buf as any;

    return (bufStr[0] === 0x1b && bufStr[1] === 0x5b && bufStr[2] === 0x4d)
      || /^\x1b\[M([\x00\u0020-\uffff]{3})/.test(s as string)
      || /^\x1b\[(\d+;\d+;\d+)M/.test(s as string)
      || /^\x1b\[<(\d+;\d+;\d+)([mM])/.test(s as string)
      || /^\x1b\[<(\d+;\d+;\d+;\d+)&w/.test(s as string)
      || /^\x1b\[24([0135])~\[(\d+),(\d+)\]\r/.test(s as string)
      || /^\x1b\[(O|I)/.test(s as string);
  }

  /**
   * Set the scroll position
   */
  setScroll(offset: number): this {
    this.term.ydisp = offset;
    this.emit('scroll');
    return this;
  }

  /**
   * Alias for setScroll
   */
  scrollTo(offset: number): this {
    return this.setScroll(offset);
  }

  /**
   * Get the current scroll position
   */
  getScroll(): number {
    return this.term.ydisp;
  }

  /**
   * Scroll by a relative offset
   */
  scroll(offset: number): this {
    this.term.scrollDisp(offset);
    this.emit('scroll');
    return this;
  }

  /**
   * Reset the scroll position
   */
  resetScroll(): this {
    this.term.ydisp = 0;
    this.term.ybase = 0;
    this.emit('scroll');
    return this;
  }

  /**
   * Get the scroll height
   */
  getScrollHeight(): number {
    return this.term.rows - 1;
  }

  /**
   * Get the scroll percentage
   */
  getScrollPerc(): number {
    return (this.term.ydisp / this.term.ybase) * 100;
  }

  /**
   * Set the scroll percentage
   */
  setScrollPerc(i: number): this {
    return this.setScroll((i / 100) * this.term.ybase | 0);
  }

  /**
   * Get a screenshot of the terminal contents
   */
  screenshot(xi?: number, xl?: number, yi?: number, yl?: number): string {
    xi = 0 + (xi || 0);
    if (xl != null) {
      xl = 0 + (xl || 0);
    } else {
      xl = this.term.lines[0].length;
    }
    yi = 0 + (yi || 0);
    if (yl != null) {
      yl = 0 + (yl || 0);
    } else {
      yl = this.term.lines.length;
    }
    const screen = this.screen as any;
    return screen && typeof screen.screenshot === 'function'
      ? screen.screenshot(xi, xl, yi, yl, this.term)
      : '';
  }

  /**
   * Kill the terminal and clean up
   */
  kill(): void {
    if (this.pty) {
      this.pty.destroy();
      this.pty.kill();
    }

    this.term.refresh = function() {};
    this.term.write('\x1b[H\x1b[J');

    if (this.term._blink) {
      clearInterval(this.term._blink);
    }

    this.term.destroy();
  }
}