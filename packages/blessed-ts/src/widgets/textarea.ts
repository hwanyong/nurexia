/**
 * textarea.ts - textarea element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { ScrollableBox, ScrollableBoxOptions } from './scrollablebox';
import { unicode } from '../utils/unicode';
import { NodeType } from '../types';
import { Program } from '../program/program';

/**
 * Textarea options interface
 */
export interface TextareaOptions extends ScrollableBoxOptions {
  value?: string;
  inputOnFocus?: boolean;
  vi?: boolean;
  keys?: boolean;
  // IME-related options
  imeSupport?: boolean;
  imeStyle?: 'underline' | 'highlight' | 'box';
}

/**
 * Textarea Class - Scrollable text input widget
 */
export class Textarea extends ScrollableBox {
  type: NodeType = 'textarea';
  value: string = '';
  _value: string = '';
  _reading: boolean = false;
  _callback?: (err: any, value?: string) => void;
  _done?: (err: any, value?: string) => void;
  __updateCursor: () => void;
  __listener?: (ch: string, key: any) => void;
  __done?: () => void;
  ileft: number = 0;

  // IME composition state
  private _isComposing: boolean = false;
  private _compositionData: string = '';
  private _compositionPosition: number = 0;

  constructor(options: TextareaOptions = {}) {
    options.scrollable = true;
    super(options);

    this.value = options.value || '';
    this._value = this.value;

    if (options.inputOnFocus) {
      this.on('focus', () => this.readInput());
    }

    // Only automatically read input if the
    // `inputOnFocus` option was not explicitly set.
    if (!options.inputOnFocus && options.keys) {
      this.on('keypress', (ch, key) => {
        this.setContent(this.value);
        return this.readInput();
      });
    }

    // Add IME composition event handlers
    if (options.imeSupport !== false) {
      this.screen.program.on('compositionstart', this._onCompositionStart.bind(this));
      this.screen.program.on('compositionupdate', this._onCompositionUpdate.bind(this));
      this.screen.program.on('compositionend', this._onCompositionEnd.bind(this));
    }

    this.__updateCursor = this._updateCursor.bind(this);
    this.on('resize', this.__updateCursor);
    this.on('move', this.__updateCursor);
  }

  /**
   * Calculate string width with support for wide characters
   */
  strWidth(str: string): number {
    return unicode.strWidth(str);
  }

  /**
   * Update cursor position for text input
   */
  _updateCursor(get?: boolean): void {
    if (this.screen.focused !== this || !this._reading) {
      return;
    }

    const lpos = get ? this._getCoords() : this.lpos;
    if (!lpos) return;

    const last = this._clines[Math.max(0, this._clines.length - 1)];
    const program = this.screen.program;
    const line = last;
    let cx = this.strWidth(line);
    let cy = this._clines.length - 1;

    // Add underline or other visual indicator for IME composition text
    if (this._isComposing && this._compositionData) {
      // Get position to insert composition
      const beforeComp = this.value.slice(0, this._compositionPosition);
      const beforeCompWidth = this.strWidth(beforeComp);

      // Calculate composition text coordinates
      const width = typeof this.width === 'number' ? this.width : 1;
      let compX = beforeCompWidth % width;
      let compY = Math.floor(beforeCompWidth / width);

      // Adjust for scrolling
      compY -= this.childBase;

      // If composition is in visible area, highlight it
      const height = typeof this.height === 'number' ? this.height : 0;
      if (compY >= 0 && compY < height) {
        const compWidth = this.strWidth(this._compositionData);

        // Apply visual style based on options
        const imeStyle = (this.options as TextareaOptions).imeStyle || 'underline';

        if (typeof lpos.yi === 'number' && typeof lpos.xi === 'number') {
          switch (imeStyle) {
            case 'underline':
              // Draw underline for composition text
              const basePos = lpos.yi + this.itop + compY;
              const startPos = lpos.xi + this.ileft + compX;

              program.cursorPos(startPos, basePos);
              program.setStyle('{underline}');
              program.write(this._compositionData);
              program.resetStyle();
              break;

            case 'highlight':
              // Highlight composition text
              const hlPos = lpos.yi + this.itop + compY;
              const hlStartPos = lpos.xi + this.ileft + compX;

              program.cursorPos(hlStartPos, hlPos);
              program.setStyle('{inverse}');
              program.write(this._compositionData);
              program.resetStyle();
              break;

            case 'box':
              // Box around composition text
              const boxPos = lpos.yi + this.itop + compY;
              const boxStartPos = lpos.xi + this.ileft + compX;

              program.cursorPos(boxStartPos - 1, boxPos);
              program.write('[');
              program.write(this._compositionData);
              program.write(']');
              break;
          }
        }
      }
    }

    // Position cursor at end of text or at composition position
    if (this._isComposing) {
      // Position at composition
      const beforeComp = this.value.slice(0, this._compositionPosition);
      const textWithComp = beforeComp + this._compositionData;
      const lines = this._clines;

      // Find the line and column for cursor
      let totalLines = 0;
      let currentLine = '';
      let currentWidth = 0;

      for (let i = 0; i < textWithComp.length; i++) {
        const ch = textWithComp[i];
        const width = this.strWidth(ch);

        const effectiveWidth = typeof this.width === 'number' ? this.width : 1;
        if (currentWidth + width > effectiveWidth) {
          totalLines++;
          currentLine = ch;
          currentWidth = width;
        } else {
          currentLine += ch;
          currentWidth += width;
        }
      }

      cy = totalLines;
      cx = currentWidth;
    } else {
      // Regular cursor position at end of text
      cx = this.strWidth(line);
      cy = this._clines.length - 1;
    }

    // Position cursor
    if (typeof lpos.yi === 'number' && typeof lpos.xi === 'number') {
      const height = typeof this.height === 'number' ? this.height : 0;
      if (cy + this.childBase < this.childBase + height) {
        (program as any).cup(
          lpos.yi + this.itop + cy - this.childBase,
          lpos.xi + this.ileft + cx
        );
      } else {
        (program as any).cup(cy, cx);
      }
    } else {
      (program as any).cup(cy, cx);
    }
  }

  /**
   * 사용자 입력 읽기
   */
  readInput(callback?: (err: any, value?: string) => void): void {
    const focused = this.screen.focused === this;

    if (this._reading) return;
    this._reading = true;

    this._callback = callback;

    if (!focused) {
      (this.screen as any).saveFocus();
      this.focus();
    }

    this.screen.grabKeys = true;

    this._updateCursor();
    this.screen.program.showCursor();

    this._done = (err: any, value?: string) => {
      if (!this._reading) return;

      if ((this._done as any).done) return;
      (this._done as any).done = true;

      this._reading = false;

      delete this._callback;
      delete this._done;

      if (this.__listener) {
        this.removeAllListeners('keypress');
        delete this.__listener;
      }

      if (this.__done) {
        this.removeAllListeners('blur');
        delete this.__done;
      }

      this.screen.program.hideCursor();
      this.screen.grabKeys = false;

      if (!focused) {
        (this.screen as any).restoreFocus();
      }

      if (this.options.inputOnFocus) {
        (this.screen as any).rewindFocus();
      }

      // Ugly
      if (err === 'stop') return;

      if (err) {
        this.emit('error', err);
      } else if (value != null) {
        this.emit('submit', value);
      } else {
        this.emit('cancel', value);
      }
      this.emit('action', value);

      if (!callback) return;

      return err
        ? callback(err, undefined)
        : callback(null, value);
    };

    // 다음 틱에서 리스너 등록 (현재 키 이벤트 방지)
    setTimeout(() => {
      this.__listener = this._listener.bind(this);
      this.on('keypress', this.__listener as any);
    }, 0);

    this.__done = this._done.bind(this, null, undefined);
    this.on('blur', this.__done as any);

    // Ensure we clean up any IME composition state
    this._endComposition();
  }

  /**
   * 키 이벤트 리스너
   */
  _listener(ch: string, key: any): void {
    const done = this._done;
    const value = this.value;

    // Skip key handling during composition except for enter, esc and special keys
    if (key.isComposing && key.name !== 'return' && key.name !== 'escape' &&
        key.name !== 'backspace' && !key.ctrl) {
      return;
    }

    if (key.name === 'return') return;
    if (key.name === 'enter') {
      ch = '\n';
    }

    // Handle directional keys
    if (key.name === 'left' || key.name === 'right' ||
        key.name === 'up' || key.name === 'down') {
      // TODO: Implement cursor movement within the text
      return;
    }

    if (this.options.keys && key.ctrl && key.name === 'e') {
      return this.readEditor();
    }

    if (key.name === 'escape') {
      // Cancel any ongoing composition
      this._endComposition();

      if (done) done(null, undefined);
    } else if (key.name === 'backspace') {
      if (this.value.length) {
        if (this.screen.fullUnicode) {
          // Handle surrogate pairs
          if (unicode.isSurrogate(this.value, this.value.length - 2)) {
            this.value = this.value.slice(0, -2);
          } else {
            this.value = this.value.slice(0, -1);
          }
        } else {
          this.value = this.value.slice(0, -1);
        }
      }
    } else if (ch) {
      // Only add non-control characters
      if (!/^[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f]$/.test(ch)) {
        // Insert at cursor position or at the end
        this.value += ch;

        // Update composition position if we're inserting text
        // (for next composition)
        this._compositionPosition = this.value.length;
      }
    }

    if (this.value !== value) {
      this.screen.render();
    }
  }

  /**
   * 타이핑 시 스크롤 조정
   */
  _typeScroll(): void {
    // 마지막 라인이 보이도록 스크롤 조정
    const height = (typeof this.height === 'number' ? this.height : 0) - (this.iheight || 0);
    if (this._clines.length - this.childBase > height) {
      this.scroll(this._clines.length);
    }
  }

  /**
   * 값 가져오기
   */
  getValue(): string {
    return this.value;
  }

  /**
   * 값 설정
   */
  setValue(value?: string): this {
    if (value == null) {
      value = this.value;
    }
    if (this._value !== value) {
      this.value = value;
      this._value = value;
      this.setContent(this.value);
      this._typeScroll();
      this._updateCursor();
    }
    return this;
  }

  /**
   * 값 초기화
   */
  clearValue(): this {
    return this.setValue('');
  }

  /**
   * 별칭: clearValue
   */
  clearInput = this.clearValue;

  /**
   * 현재 입력 제출
   */
  submit(): void {
    if (this.__listener) {
      this.__listener('\x1b', { name: 'escape' });
    }
  }

  /**
   * 현재 입력 취소
   */
  cancel(): void {
    if (this.__listener) {
      this.__listener('\x1b', { name: 'escape' });
    }
  }

  /**
   * 렌더링
   */
  render(): { width: number; height: number } {
    this.setValue();
    return super.render();
  }

  /**
   * 외부 에디터로 편집
   */
  readEditor(callback?: (err: any, value?: string) => void): void {
    if (this._reading) {
      const _cb = this._callback;
      const cb = callback;

      if (this._done) {
        this._done('stop');
      }

      callback = (err: any, value?: string) => {
        if (_cb) _cb(err, value);
        if (cb) cb(err, value);
      };
    }

    if (!callback) {
      callback = () => {};
    }

    return this.screen.readEditor({ value: this.value }, (err: any, value?: string) => {
      if (err) {
        if (err.message === 'Unsuccessful.') {
          this.screen.render();
          return this.readInput(callback);
        }
        this.screen.render();
        this.readInput(callback);
        return callback && callback(err);
      }
      this.setValue(value);
      this.screen.render();
      return this.readInput(callback);
    });
  }

  /**
   * 별칭: readEditor
   */
  setEditor = this.readEditor;
  editor = this.readEditor;

  /**
   * Handle IME composition start
   */
  private _onCompositionStart(data: string): void {
    if (this.screen.focused !== this || !this._reading) return;

    this._isComposing = true;
    this._compositionData = data;
    this._compositionPosition = this.value.length;

    this.screen.render();
  }

  /**
   * Handle IME composition update
   */
  private _onCompositionUpdate(data: string): void {
    if (this.screen.focused !== this || !this._reading) return;

    this._isComposing = true;
    this._compositionData = data;

    this.screen.render();
  }

  /**
   * Handle IME composition end
   */
  private _onCompositionEnd(data: string): void {
    if (this.screen.focused !== this || !this._reading) return;

    // Add composition result to the value
    if (data) {
      this.value = this.value.slice(0, this._compositionPosition) +
                  data +
                  this.value.slice(this._compositionPosition);

      // Update composition position for next composition
      this._compositionPosition += data.length;
    }

    this._endComposition();
    this.screen.render();
  }

  /**
   * End composition and reset state
   */
  private _endComposition(): void {
    // End any ongoing composition in the program
    if (this._isComposing) {
      this.screen.program.endComposition();
    }

    this._isComposing = false;
    this._compositionData = '';
  }
}