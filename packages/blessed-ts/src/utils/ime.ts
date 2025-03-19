/**
 * ime.ts - Input Method Editor handler for blessed-ts
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

/**
 * IME Composition State
 */
export interface IMEComposition {
  /**
   * Indicates if composition is in progress
   */
  isComposing: boolean;

  /**
   * Current composition text
   */
  text: string;

  /**
   * Cursor position within composition
   */
  cursor: number;

  /**
   * Source language (if detectable)
   */
  lang?: string;
}

/**
 * IME Handler - Manages input method composition
 */
export class IMEHandler {
  /**
   * Current composition state
   */
  private _composition: IMEComposition;

  /**
   * Callback for composition changes
   */
  private _onChange?: (composition: IMEComposition) => void;

  constructor() {
    this._composition = {
      isComposing: false,
      text: '',
      cursor: 0
    };
  }

  /**
   * Get current composition state
   */
  get composition(): IMEComposition {
    return { ...this._composition };
  }

  /**
   * Register composition change callback
   */
  onChange(callback: (composition: IMEComposition) => void): void {
    this._onChange = callback;
  }

  /**
   * Start composition
   */
  start(initialText: string = ''): void {
    this._composition.isComposing = true;
    this._composition.text = initialText;
    this._composition.cursor = initialText.length;
    this._notifyChange();
  }

  /**
   * Update composition text
   */
  update(text: string, cursorPos?: number): void {
    if (!this._composition.isComposing) {
      this.start(text);
      return;
    }

    this._composition.text = text;
    this._composition.cursor = cursorPos !== undefined ? cursorPos : text.length;
    this._notifyChange();
  }

  /**
   * End composition and commit text
   */
  commit(): string {
    const text = this._composition.text;
    this._composition.isComposing = false;
    this._composition.text = '';
    this._composition.cursor = 0;
    this._notifyChange();
    return text;
  }

  /**
   * Cancel composition
   */
  cancel(): void {
    this._composition.isComposing = false;
    this._composition.text = '';
    this._composition.cursor = 0;
    this._notifyChange();
  }

  /**
   * Set language of composition
   */
  setLanguage(lang: string): void {
    this._composition.lang = lang;
    this._notifyChange();
  }

  /**
   * Process keypress during composition
   */
  processKey(ch: string, key: any): boolean {
    if (!this._composition.isComposing) {
      return false;
    }

    // ESC cancels composition
    if (key.name === 'escape') {
      this.cancel();
      return true;
    }

    // Enter commits composition
    if (key.name === 'enter' || key.name === 'return') {
      this.commit();
      return true;
    }

    // Cursor movement within composition
    if (key.name === 'left' && this._composition.cursor > 0) {
      this._composition.cursor--;
      this._notifyChange();
      return true;
    }

    if (key.name === 'right' && this._composition.cursor < this._composition.text.length) {
      this._composition.cursor++;
      this._notifyChange();
      return true;
    }

    // Backspace within composition
    if (key.name === 'backspace' && this._composition.cursor > 0) {
      const text = this._composition.text;
      this._composition.text =
        text.substring(0, this._composition.cursor - 1) +
        text.substring(this._composition.cursor);
      this._composition.cursor--;
      this._notifyChange();
      return true;
    }

    // Delete within composition
    if (key.name === 'delete' && this._composition.cursor < this._composition.text.length) {
      const text = this._composition.text;
      this._composition.text =
        text.substring(0, this._composition.cursor) +
        text.substring(this._composition.cursor + 1);
      this._notifyChange();
      return true;
    }

    // Regular character input
    if (ch && key.name !== 'backspace' && key.name !== 'delete') {
      const text = this._composition.text;
      this._composition.text =
        text.substring(0, this._composition.cursor) +
        ch +
        text.substring(this._composition.cursor);
      this._composition.cursor++;
      this._notifyChange();
      return true;
    }

    return false;
  }

  /**
   * Notify listeners of composition change
   */
  private _notifyChange(): void {
    if (this._onChange) {
      this._onChange(this.composition);
    }
  }
}

/**
 * Create a new IME handler instance
 */
export function createIME(): IMEHandler {
  return new IMEHandler();
}