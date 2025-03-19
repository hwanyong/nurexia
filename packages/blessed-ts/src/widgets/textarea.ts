/**
 * textarea.ts - textarea element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { ScrollableBox, ScrollableBoxOptions } from './scrollablebox';
import { NodeType } from '../types';
import { Program } from '../program/program';
import { unicode } from '../utils/unicode';
import { IMEHandler, IMEComposition } from '../utils/ime';

/**
 * Textarea options interface
 */
export interface TextareaOptions extends ScrollableBoxOptions {
  value?: string;
  inputOnFocus?: boolean;
  vi?: boolean;
  keys?: boolean;
  imeSupport?: boolean;  // Enable IME support
}

/**
 * Textarea Class - Scrollable text input widget
 */
export class Textarea extends ScrollableBox {
  /**
   * Textarea specific properties
   */
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

  // IME related properties
  _ime: IMEHandler;
  _imeComposition: IMEComposition;
  _imeSupport: boolean = true;

  /**
   * Textarea constructor
   */
  constructor(options: TextareaOptions = {}) {
    // 기본 옵션 설정
    options.scrollable = options.scrollable !== false;

    super(options);

    // 값 초기화
    this.value = options.value || '';

    // IME 설정
    this._ime = new IMEHandler();
    this._imeComposition = this._ime.composition;
    this._imeSupport = options.imeSupport !== false;

    // IME 이벤트 설정
    this._ime.onChange((composition) => {
      this._imeComposition = composition;
      this._updateCursor();
      this.screen.render();
    });

    // 커서 업데이트 바인딩
    this.__updateCursor = this._updateCursor.bind(this);
    this.on('resize', this.__updateCursor);
    this.on('move', this.__updateCursor);

    // 입력 이벤트 처리
    if (options.inputOnFocus) {
      this.on('focus', () => this.readInput());
    }

    if (!options.inputOnFocus && options.keys) {
      this.on('keypress', (ch: string, key: any) => {
        if (this._reading) return;
        if (key.name === 'enter' || (options.vi && key.name === 'i')) {
          return this.readInput();
        }
        if (key.name === 'e') {
          return this.readEditor();
        }
      });
    }

    if (options.mouse) {
      this.on('click', (data: any) => {
        if (this._reading) return;
        if (data.button !== 'right') return;
        this.readEditor();
      });
    }

    // Screen에 키 이벤트 리스너 등록
    this.screen._listenKeys(this);
  }

  /**
   * 문자열 너비 계산 (유니코드 지원)
   */
  strWidth(str: string): number {
    return unicode.strWidth(str);
  }

  /**
   * 커서 위치 업데이트
   */
  _updateCursor(get?: boolean): void {
    if (this.screen.focused !== this) {
      return;
    }

    const lpos = get ? this.lpos : this._getCoords();
    if (!lpos) return;

    // Get last line and handle IME composition if active
    let last = this._clines[this._clines.length - 1];
    const program = this.screen.program as Program;

    // Handle IME composition display
    let compositionText = '';
    let cursorOffset = 0;

    if (this._imeSupport && this._imeComposition.isComposing) {
      compositionText = this._imeComposition.text;
      cursorOffset = this.strWidth(compositionText.substring(0, this._imeComposition.cursor));
    }

    // 마지막 라인이 비어있는 경우 처리
    if (last === '' && this.value[this.value.length - 1] !== '\n') {
      last = this._clines[this._clines.length - 2] || '';
    }

    let line = Math.min(
      this._clines.length - 1 - (this.childBase || 0),
      (lpos.yl - lpos.yi) - this.iheight - 1
    );

    // 음수가 되지 않도록 조정
    line = Math.max(0, line);

    const cy = lpos.yi + this.itop + line;
    let cx = lpos.xi + this.ileft + this.strWidth(last);

    // Adjust cursor position for IME composition text
    if (this._imeSupport && this._imeComposition.isComposing) {
      cx = lpos.xi + this.ileft + this.strWidth(last) + cursorOffset;
    }

    // 현재 위치와 같으면 이동하지 않음
    if (cy === program.y && cx === program.x) {
      return;
    }

    // 커서 이동
    if (cy === program.y) {
      if (cx > program.x) {
        program.right(cx - program.x);
      } else if (cx < program.x) {
        program.left(program.x - cx);
      }
    } else if (cx === program.x) {
      if (cy > program.y) {
        program.down(cy - program.y);
      } else if (cy < program.y) {
        program.up(program.y - cy);
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
      this.screen.saveFocus();
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

      // Ensure any IME composition is completed
      if (this._imeComposition.isComposing) {
        const composedText = this._ime.commit();
        if (composedText && !err) {
          // Insert the composed text
          this.value += composedText;
        }
      }

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
        this.screen.restoreFocus();
      }

      if (this.options.inputOnFocus) {
        this.screen.rewindFocus();
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
  }

  /**
   * 키 이벤트 리스너
   */
  _listener(ch: string, key: any): void {
    const done = this._done;
    const value = this.value;

    // Check for IME input first if IME support is enabled
    if (this._imeSupport && (this._imeComposition.isComposing ||
        (ch && /[\u1100-\u11FF\u3040-\u30FF\u3130-\u318F\uAC00-\uD7AF\u4E00-\u9FFF]/.test(ch)))) {

      // If it's the first character of a potential IME sequence, start composition
      if (!this._imeComposition.isComposing) {
        this._ime.start(ch);
        this.screen.render();
        return;
      }

      // Process key within IME composition
      if (this._ime.processKey(ch, key)) {
        this.screen.render();
        return;
      }

      // If composition is active and Enter is pressed, commit the text
      if (key.name === 'enter' || key.name === 'return') {
        const composedText = this._ime.commit();
        this.value += composedText;
        this.screen.render();
        return;
      }
    }

    if (key.name === 'return') return;
    if (key.name === 'enter') {
      ch = '\n';
    }

    // TODO: Handle directional keys.
    if (key.name === 'left' || key.name === 'right' ||
        key.name === 'up' || key.name === 'down') {
      return;
    }

    if (this.options.keys && key.ctrl && key.name === 'e') {
      return this.readEditor();
    }

    if (key.name === 'escape') {
      if (this._imeComposition.isComposing) {
        this._ime.cancel();
        this.screen.render();
        return;
      }
      if (done) {
        done(null, undefined);
      }
      return;
    }

    if (key.name === 'backspace') {
      if (this.value) {
        if (this.value[this.value.length - 1] === '\n') {
          this.value = this.value.slice(0, -1);
        } else {
          // Remove the last character based on grapheme clusters
          // Get the string without the last character, respecting Unicode
          const strLen = this.value.length;
          // For non-ASCII characters, we need to handle surrogate pairs and combining marks
          let indexToSlice = strLen - 1;
          // Check for surrogate pairs
          if (strLen >= 2 && unicode.isSurrogate(this.value, strLen - 2)) {
            indexToSlice = strLen - 2;
          }
          this.value = this.value.substring(0, indexToSlice);
        }
      }
      this.screen.render();
      return;
    }

    if (ch) {
      this.value += ch;
      this.screen.render();
    }
  }

  /**
   * 스크롤 처리
   */
  _typeScroll(): void {
    // Calculate visible rows and scroll if needed
    const height = typeof this.height === 'number' ? this.height : 0;
    const visible = Math.min(
      this._clines.length - (this.childBase || 0),
      height - (this.iheight || 0)
    );
    if (this._clines.length > visible) {
      this.scroll(this._clines.length);
    }
  }

  /**
   * 현재 값 반환
   */
  getValue(): string {
    return this.value;
  }

  /**
   * 값 설정
   */
  setValue(value?: string): this {
    if (value == null) value = this.value;
    if (this._value !== value) {
      this.value = value;
      this._value = value;
      this._typeScroll();
      this.screen.render();
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
   * 입력 지우기 별칭
   */
  clearInput = this.clearValue;

  /**
   * 입력 제출
   */
  submit(): void {
    if (!this._reading) return;
    const done = this._done;
    if (done) done(null, this.value);
  }

  /**
   * 입력 취소
   */
  cancel(): void {
    if (!this._reading) return;
    const done = this._done;
    if (done) done(null, undefined);
  }

  /**
   * 렌더링
   */
  render(): { width: number; height: number } {
    const result = super.render();

    // Render IME composition text if active
    if (this._imeSupport && this._imeComposition.isComposing && this.screen.focused === this) {
      const lpos = this._getCoords();
      if (!lpos) return result;

      // Determine where to render the composition text
      let lastLine = this._clines[this._clines.length - 1] || '';
      let compositionX = this.ileft + this.strWidth(lastLine);
      let compositionY = Math.min(
        this._clines.length - 1 - (this.childBase || 0),
        (lpos.yl - lpos.yi) - this.iheight - 1
      );

      // Adjust y position to avoid negative values
      compositionY = Math.max(0, compositionY);

      // Get the composition text to display
      const compositionText = this._imeComposition.text;

      // Render the composition with underline to indicate it's being composed
      if (compositionText) {
        this.screen.fills.push({
          screen: this.screen,
          left: lpos.xi + compositionX,
          top: lpos.yi + this.itop + compositionY,
          text: compositionText,
          style: {
            bold: false,
            underline: true,
            blink: false,
            inverse: false,
            invisible: false,
            bg: this.style.bg,
            fg: this.style.fg || 'white'
          }
        });
      }
    }

    return result;
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
        return callback(err);
      }
      this.setValue(value);
      this.screen.render();
      return this.readInput(callback);
    });
  }

  /**
   * 에디터 설정 별칭
   */
  setEditor = this.readEditor;
  editor = this.readEditor;
}