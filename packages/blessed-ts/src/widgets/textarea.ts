/**
 * textarea.ts - textarea element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { ScrollableBox, ScrollableBoxOptions } from './scrollablebox';
import { NodeType } from '../types';
import { Program } from '../program/program';
import { unicode } from '../utils/unicode';

/**
 * Textarea options interface
 */
export interface TextareaOptions extends ScrollableBoxOptions {
  value?: string;
  inputOnFocus?: boolean;
  vi?: boolean;
  keys?: boolean;
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

  /**
   * Textarea constructor
   */
  constructor(options: TextareaOptions = {}) {
    // 기본 옵션 설정
    options.scrollable = options.scrollable !== false;

    super(options);

    // 값 초기화
    this.value = options.value || '';

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

    let last = this._clines[this._clines.length - 1];
    const program = this.screen.program as Program;

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
    const cx = lpos.xi + this.ileft + this.strWidth(last);

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
      if (done) done(null, undefined);
    } else if (key.name === 'backspace') {
      if (this.value.length) {
        if (this.screen.fullUnicode) {
          // 서로게이트 쌍 처리
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
      // 제어 문자가 아닌 경우에만 추가
      if (!/^[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f]$/.test(ch)) {
        this.value += ch;
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
        return callback(err);
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
}