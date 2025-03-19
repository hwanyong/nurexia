/**
 * keys.ts - handle the keyboard input for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

/**
 * Type definitions
 */
export interface KeyEvent {
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  sequence: string;
  code?: string;
  raw?: string;
  alt?: boolean;
}

export interface KeyOptions {
  /**
   * Enables input handling of application/normal keypad inputs
   */
  applicationKeypad?: boolean;
  /**
   * Enables input handling of xterm mouse events
   */
  mouseEvents?: boolean;
  /**
   * Enables input handling of iTerm2 focusing reporting events
   */
  iTermFocusReporting?: boolean;
  /**
   * Enables input handling of URXVT mouse event encoding
   */
  urxvtMouse?: boolean;
  /**
   * Enables input handling of SGR mouse event encoding
   */
  sgrMouse?: boolean;
  /**
   * Enables input handling of VT200 mouse events
   */
  vt200Mouse?: boolean;
  /**
   * Enables DEC Locator mode (only used when supported)
   */
  decLocator?: boolean;
  /**
   * Unicode character range start
   */
  unicodeRangeStart?: number;
  /**
   * Unicode character range end
   */
  unicodeRangeEnd?: number;
}

/**
 * Map of special keys to handlers
 */
interface KeyHandlerMap {
  [pattern: string]: (parts: string[], key: KeyEvent) => void;
}

/**
 * Map of escape code names
 */
interface CodeNameMap {
  [code: string]: string;
}

/**
 * Keys class
 */
export class Keys {
  private options: KeyOptions;
  private composing: boolean = false;
  private composedData: string = '';

  constructor(options: KeyOptions = {}) {
    this.options = options;
  }

  /**
   * Parse a keypress input
   */
  parseKey(data: string): KeyEvent | null {
    // Regular alphanumeric key or special character
    if (data.length === 1) {
      return this._parseSimpleKey(data);
    }

    // Handle escape sequences
    if (data[0] === '\x1b') {
      return this._parseEscapeSequence(data);
    }

    // Handle special keys like Enter, Tab, etc.
    return this._parseOtherKey(data);
  }

  /**
   * Handle IME composing
   */
  checkComposing(data: string): { data: string; skip: boolean } {
    // Special IME sequences - Different patterns based on terminal/OS combinations

    // Check for IME composing start/end indicators
    if (data === '\x1b') {
      this.composing = true;
      this.composedData = '';
      return { data: '', skip: true };
    }

    // Detect IME sequence patterns
    // These patterns vary by language and IME implementation

    // Korean (Hangul) IME patterns
    const isHangulJamo = /[\u1100-\u11FF]/.test(data);
    const isHangulSyllable = /[\uAC00-\uD7A3]/.test(data);

    // Chinese/Japanese IME patterns
    const isIdeographicSpace = data === '\u3000';
    const isKanaOrIdeograph = /[\u3040-\u30FF\u4E00-\u9FFF]/.test(data);

    // Combined check for IME-related characters
    const isIMERelated = isHangulJamo || isHangulSyllable || isIdeographicSpace || isKanaOrIdeograph;

    if (this.composing) {
      // IME composition finalization indicators
      if (data === ' ' || isIdeographicSpace || data === '\r' || data === '\n') {
        // Composition complete
        const result = this.composedData;
        this.composing = false;
        this.composedData = '';

        // If it's a space that terminated composition, return the composed data
        // but don't include the space itself
        if (data === ' ' || isIdeographicSpace) {
          return { data: result, skip: false };
        }

        // For newlines and carriage returns, include them after the composed text
        return { data: result + data, skip: false };
      }

      // For composition in progress
      this.composedData += data;
      return { data: '', skip: true };
    } else if (isIMERelated) {
      // Auto-start composition for IME characters
      this.composing = true;
      this.composedData = data;
      return { data: '', skip: true };
    }

    return { data, skip: false };
  }

  /**
   * Parse a simple key (single character)
   */
  private _parseSimpleKey(data: string): KeyEvent {
    const ch = data[0];
    const key: KeyEvent = {
      name: ch,
      sequence: data,
      ctrl: false,
      meta: false,
      shift: false
    };

    // Check for control character
    const code = ch.charCodeAt(0);
    if (code < 32) {
      // Control character
      if (code === 0) {
        key.name = 'null';
      } else if (code <= 26) {
        key.name = String.fromCharCode(code + 64).toLowerCase();
        key.ctrl = true;
      }
    }

    return key;
  }

  /**
   * Parse an escape sequence
   */
  private _parseEscapeSequence(data: string): KeyEvent {
    // Initialize key event
    const key: KeyEvent = {
      name: '',
      sequence: data,
      ctrl: false,
      meta: false,
      shift: false
    };

    // Check for meta+character
    if (data.length === 2 && data[0] === '\x1b') {
      const ch = data[1];
      key.name = ch;
      key.meta = true;

      // Check for ctrl+meta+character
      const code = ch.charCodeAt(0);
      if (code < 32) {
        if (code <= 26) {
          key.name = String.fromCharCode(code + 64).toLowerCase();
          key.ctrl = true;
          key.meta = true;
        }
      }

      return key;
    }

    // Parse CSI sequences
    if (data[0] === '\x1b' && data[1] === '[') {
      return this._parseCsiSequence(data, key);
    }

    // Parse SS3 sequences
    if (data[0] === '\x1b' && data[1] === 'O') {
      return this._parseSs3Sequence(data, key);
    }

    // Unknown escape sequence
    key.name = 'unknown';
    return key;
  }

  /**
   * Parse CSI escape sequences
   */
  private _parseCsiSequence(data: string, key: KeyEvent): KeyEvent {
    // Extract the parameter parts
    const parts = data.slice(2).split(';');
    const lastPart = parts[parts.length - 1];

    // Handle modifiers in format: ESC [ N ; M ~
    if (lastPart.length > 1 && lastPart[lastPart.length - 1] === '~') {
      const codeStr = lastPart.slice(0, -1);
      if (parts.length === 2) {
        // We have a modifier
        const mod = parseInt(parts[0], 10);
        if (!isNaN(mod)) {
          if (mod === 2 || mod === 8) key.shift = true;
          if (mod === 3 || mod === 9) key.alt = true;
          if (mod === 4 || mod === 10) {
            key.shift = true;
            key.alt = true;
          }
          if (mod === 5 || mod === 11) key.ctrl = true;
          if (mod === 6 || mod === 12) {
            key.shift = true;
            key.ctrl = true;
          }
          if (mod === 7 || mod === 13) {
            key.alt = true;
            key.ctrl = true;
          }
          if (mod === 14) {
            key.shift = true;
            key.alt = true;
            key.ctrl = true;
          }
        }
      }

      // Map common CSI codes to key names
      const codeMap: CodeNameMap = {
        '1': 'home',
        '2': 'insert',
        '3': 'delete',
        '4': 'end',
        '5': 'pageup',
        '6': 'pagedown',
        '7': 'home',
        '8': 'end',
        '11': 'f1',
        '12': 'f2',
        '13': 'f3',
        '14': 'f4',
        '15': 'f5',
        '17': 'f6',
        '18': 'f7',
        '19': 'f8',
        '20': 'f9',
        '21': 'f10',
        '23': 'f11',
        '24': 'f12'
      };

      if (codeMap[codeStr]) {
        key.name = codeMap[codeStr];
        return key;
      }
    }

    // Handle cursor key sequences
    if (data.length === 3 && data[2] >= 'A' && data[2] <= 'D') {
      const dirMap: CodeNameMap = {
        'A': 'up',
        'B': 'down',
        'C': 'right',
        'D': 'left'
      };
      key.name = dirMap[data[2]];
      return key;
    }

    // Handle other common sequences
    switch (data) {
      case '\x1b[Z':
        key.name = 'tab';
        key.shift = true;
        break;
      case '\x1b[H':
        key.name = 'home';
        break;
      case '\x1b[F':
        key.name = 'end';
        break;
      default:
        key.name = 'unknown';
        break;
    }

    return key;
  }

  /**
   * Parse SS3 escape sequences
   */
  private _parseSs3Sequence(data: string, key: KeyEvent): KeyEvent {
    // Map common SS3 codes to key names
    if (data.length === 3) {
      const codeMap: CodeNameMap = {
        'A': 'up',
        'B': 'down',
        'C': 'right',
        'D': 'left',
        'F': 'end',
        'H': 'home',
        'P': 'f1',
        'Q': 'f2',
        'R': 'f3',
        'S': 'f4'
      };

      if (codeMap[data[2]]) {
        key.name = codeMap[data[2]];
        return key;
      }
    }

    key.name = 'unknown';
    return key;
  }

  /**
   * Parse other special keys
   */
  private _parseOtherKey(data: string): KeyEvent | null {
    const key: KeyEvent = {
      name: '',
      sequence: data,
      ctrl: false,
      meta: false,
      shift: false
    };

    // Handle special keys
    switch (data) {
      case '\r':
        key.name = 'return';
        break;
      case '\n':
        key.name = 'linefeed';
        break;
      case '\t':
        key.name = 'tab';
        break;
      case '\b':
      case '\x7f':
        key.name = 'backspace';
        break;
      case '\x1b':
        key.name = 'escape';
        break;
      case ' ':
        key.name = 'space';
        break;
      default:
        return null;
    }

    return key;
  }
}

/**
 * Export a singleton instance
 */
export const keys = new Keys();