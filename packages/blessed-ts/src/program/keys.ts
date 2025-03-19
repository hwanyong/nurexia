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
  // IME-related properties
  isComposing?: boolean;
  compositionData?: string;
}

// Add IME-specific events
export interface IMECompositionEvent {
  type: 'compositionstart' | 'compositionupdate' | 'compositionend';
  data: string;
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
  /**
   * Enable IME composition handling
   */
  enableIME?: boolean;
}

// IME composition states
export enum IMECompositionState {
  NONE = 'none',
  COMPOSING = 'composing',
  COMMIT = 'commit'
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
  private compositionState: IMECompositionState = IMECompositionState.NONE;

  // Korean IME specific variables
  private hangulState: {
    isComposing: boolean;
    buffer: string;
    lastChar: string;
  } = {
    isComposing: false,
    buffer: '',
    lastChar: ''
  };

  constructor(options: KeyOptions = {}) {
    this.options = {
      enableIME: true,
      ...options
    };
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
  checkComposing(data: string): { data: string; skip: boolean; event?: IMECompositionEvent } {
    if (!this.options.enableIME) {
      return { data, skip: false };
    }

    // Check for IME composing start
    if (data === '\x1b' && !this.composing) {
      this.composing = true;
      this.compositionState = IMECompositionState.COMPOSING;
      this.composedData = '';

      return {
        data: '',
        skip: true,
        event: {
          type: 'compositionstart',
          data: ''
        }
      };
    }

    // Special sequences for IME
    if (this.composing) {
      // ESC [ represents special IME sequence in some terminals
      if (data === '[' && this.composedData === '') {
        this.composedData += data;
        return { data: '', skip: true };
      }

      // Handle Korean Hangul composition (specific to Korean IME)
      if (this._isKoreanCharacter(data)) {
        return this._handleKoreanIME(data);
      }

      // Handle composition end with space
      if (data === ' ') {
        // Composition complete
        const result = this.composedData;
        this.composing = false;
        this.compositionState = IMECompositionState.COMMIT;
        this.composedData = '';

        return {
          data: result,
          skip: false,
          event: {
            type: 'compositionend',
            data: result
          }
        };
      }

      // Add to composition buffer
      this.composedData += data;

      return {
        data: '',
        skip: true,
        event: {
          type: 'compositionupdate',
          data: this.composedData
        }
      };
    }

    return { data, skip: false };
  }

  /**
   * Check if character is part of Korean Hangul
   */
  private _isKoreanCharacter(char: string): boolean {
    const code = char.charCodeAt(0);
    // Hangul Syllables and Hangul Jamo range
    return (code >= 0xAC00 && code <= 0xD7A3) ||
           (code >= 0x1100 && code <= 0x11FF) ||
           (code >= 0x3130 && code <= 0x318F);
  }

  /**
   * Handle Korean IME input specifically
   */
  private _handleKoreanIME(data: string): { data: string; skip: boolean; event?: IMECompositionEvent } {
    // Start Korean composition if not already composing
    if (!this.hangulState.isComposing) {
      this.hangulState.isComposing = true;
      this.hangulState.buffer = data;
      this.hangulState.lastChar = data;

      return {
        data: '',
        skip: true,
        event: {
          type: 'compositionupdate',
          data: this.hangulState.buffer
        }
      };
    }

    // Continue Korean composition
    this.hangulState.lastChar = data;
    this.hangulState.buffer += data;

    return {
      data: '',
      skip: true,
      event: {
        type: 'compositionupdate',
        data: this.hangulState.buffer
      }
    };
  }

  /**
   * Force end composition
   */
  endComposition(): string {
    let result = '';

    if (this.composing) {
      result = this.composedData;
      this.composing = false;
      this.composedData = '';
      this.compositionState = IMECompositionState.NONE;
    }

    if (this.hangulState.isComposing) {
      result = this.hangulState.buffer;
      this.hangulState.isComposing = false;
      this.hangulState.buffer = '';
      this.hangulState.lastChar = '';
    }

    return result;
  }

  /**
   * Get current composition data
   */
  getCompositionData(): string {
    if (this.composing) {
      return this.composedData;
    }

    if (this.hangulState.isComposing) {
      return this.hangulState.buffer;
    }

    return '';
  }

  /**
   * Check if currently composing
   */
  isComposing(): boolean {
    return this.composing || this.hangulState.isComposing;
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