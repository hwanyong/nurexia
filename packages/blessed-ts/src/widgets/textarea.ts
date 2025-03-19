/**
 * blessed-ts - Textarea Widget
 * 다중 라인 텍스트 입력 위젯
 */

import { Element } from './element';
import GraphemeSplitter from 'grapheme-splitter';
import type {
  KeyboardEvent,
  Textarea as TextareaInterface,
  TextareaOptions
} from '../core/types';

// 그래핌 분할기 - 한글 등 다국어 처리에 필요
const splitter = new GraphemeSplitter();

// 다음 틱으로 실행하기 위한 헬퍼 함수
const nextTick = global.setImmediate || process.nextTick.bind(process);

/**
 * 텍스트 영역 클래스 - 입력에 최적화된 위젯
 */
export class Textarea extends Element implements TextareaInterface {
  type: 'textarea' = 'textarea';
  value: string = '';
  options: TextareaOptions;

  // 입력 관련 상태
  _reading: boolean = false;
  _callback: ((err: Error | null, value: string | null) => void) | null = null;
  _done: ((err: Error | null, value: string | null) => void) | null = null;
  _listener: ((ch: string, key: KeyboardEvent) => void) | null = null;

  /**
   * Textarea 생성자
   */
  constructor(options: TextareaOptions = {}) {
    // 기본 옵션 설정
    options.scrollable = options.scrollable !== false;

    super(options);
    this.options = options;

    // 초기 값 설정
    if (options.value !== undefined) {
      this.value = options.value;
      this.setContent(this.value);
    }

    // 화면 키 이벤트 리스닝
    this.screen._listenKeys(this);

    // 크기 변경/이동 시 커서 업데이트
    this.on('resize', this._updateCursor.bind(this));
    this.on('move', this._updateCursor.bind(this));

    // 포커스 입력 설정
    if (options.inputOnFocus) {
      this.on('focus', () => this.readInput());
    }

    // 키 이벤트 설정
    if (!options.inputOnFocus && options.keys) {
      this.on('keypress', (ch, key: KeyboardEvent) => {
        if (this._reading) return;

        if (key.name === 'enter' || (options.vi && key.name === 'i')) {
          return this.readInput();
        }

        if (key.name === 'e') {
          return this.readEditor();
        }
      });
    }

    // 마우스 이벤트 설정
    if (options.mouse) {
      this.on('click', (data: any) => {
        if (this._reading) return;
        if (data.button !== 'right') return;
        this.readEditor();
      });
    }
  }

  /**
   * 커서 위치 업데이트
   */
  _updateCursor(get?: boolean): void {
    if (this.screen.focused !== this) {
      return;
    }

    // 화면 좌표 가져오기
    const lpos = get ? this.lpos : this._getCoords();
    if (!lpos) return;

    const program = this.screen.program;
    let last = this._clines[this._clines.length - 1] || '';
    let line, cx, cy;

    // 스크롤링 이슈 방지를 위한 처리
    if (last === '' && this.value[this.value.length - 1] !== '\n') {
      last = this._clines[this._clines.length - 2] || '';
    }

    // 최대 라인 수 결정
    line = Math.min(
      this._clines.length - 1 - (this.childBase || 0),
      (lpos.yl - lpos.yi) - this.iheight - 1
    );

    // 음수가 되지 않도록 보장
    line = Math.max(0, line);

    // 커서 위치 계산
    cy = lpos.yi + this.itop + line;
    cx = lpos.xi + this.ileft + this.strWidth(last);

    // 커서가 이미 올바른 위치에 있으면 업데이트 건너뜀
    if (cy === program.y && cx === program.x) {
      return;
    }

    // 커서 위치 조정
    if (cy === program.y) {
      if (cx > program.x) {
        program.cuf(cx - program.x); // 앞으로 이동
      } else if (cx < program.x) {
        program.cub(program.x - cx); // 뒤로 이동
      }
    } else if (cx === program.x) {
      if (cy > program.y) {
        program.cud(cy - program.y); // 아래로 이동
      } else if (cy < program.y) {
        program.cuu(program.y - cy); // 위로 이동
      }
    } else {
      program.cup(cy, cx); // 다이렉트 이동
    }
  }

  /**
   * 위젯에서 값 가져오기
   */
  getValue(): string {
    // 그래핌 분할을 적용한 정확한 값 반환
    if (this.screen.fullUnicode && this.value) {
      return splitter.splitGraphemes(this.value).join('');
    }
    return this.value;
  }

  /**
   * 값 설정
   */
  setValue(value: string): void {
    this.value = value || '';
    this.setContent(this.value);
  }

  /**
   * 입력 모드 시작
   */
  readInput(callback?: (err: Error | null, value: string | null) => void): void {
    // 이미 읽는 중이면 중복 방지
    if (this._reading) return;
    this._reading = true;

    this._callback = callback || null;

    // 포커스 저장
    const focused = this.screen.focused === this;
    if (!focused) {
      this.screen.saveFocus();
      this.focus();
    }

    // 화면 키 캡처 활성화
    this.screen.grabKeys = true;

    // 커서 업데이트 및 표시
    this._updateCursor();
    this.screen.program.showCursor();

    // 입력 완료 핸들러
    this._done = (err: Error | null, value: string | null) => {
      if (!this._reading) return;

      this._reading = false;

      delete this._callback;
      delete this._done;

      // 이벤트 리스너 제거
      if (this._listener) {
        this.removeListener('keypress', this._listener);
        delete this._listener;
      }

      this.removeListener('blur', this._done as any);

      // 커서 숨기기
      this.screen.program.hideCursor();
      this.screen.grabKeys = false;

      // 포커스 복원
      if (!focused) {
        this.screen.restoreFocus();
      }

      // 입력 포커스 설정이 있으면 화면 포커스 되돌리기
      if (this.options.inputOnFocus) {
        this.screen.rewindFocus();
      }

      // 입력 완료 처리
      if (err === 'stop') return;

      if (err) {
        this.emit('error', err);
      } else if (value != null) {
        this.emit('submit', value);
      } else {
        this.emit('cancel', value);
      }
      this.emit('action', value);

      // 콜백 호출
      if (!callback) return;

      return err
        ? callback(err, null)
        : callback(null, value);
    };

    // 현재 키 이벤트가 입력 처리되지 않도록 다음 틱에서 시작
    nextTick(() => {
      this._listener = this._handleKeypress.bind(this);
      this.on('keypress', this._listener);
    });

    // 포커스 잃으면 취소
    this.on('blur', this._done.bind(this, null, null) as any);
  }

  /**
   * 키 입력 처리
   */
  _handleKeypress(ch: string, key: KeyboardEvent): void {
    if (!this._done) return;

    // Enter는 무시 (이미 newline으로 처리되어야 함)
    if (key.name === 'return') return;

    // Enter 키는 개행 문자로 변환
    if (key.name === 'enter') {
      ch = '\n';
    }

    // 방향키, 편집기 단축키 처리
    if (key.name === 'left' || key.name === 'right'
        || key.name === 'up' || key.name === 'down') {
      // 커서 이동 로직 (여기서는 간략화)
    }

    // 편집기 열기
    if (this.keys && key.ctrl && key.name === 'e') {
      return this.readEditor();
    }

    // ESC 키는 취소
    if (key.name === 'escape') {
      this._done(null, null);
    }
    // Backspace 처리
    else if (key.name === 'backspace') {
      if (this.value.length) {
        // 다국어 처리 개선된 백스페이스 로직
        if (this.screen.fullUnicode) {
          const graphemes = splitter.splitGraphemes(this.value);
          // 마지막 그래핌 제거 (완성된 글자 단위로 삭제)
          graphemes.pop();
          this.value = graphemes.join('');
        } else {
          // 일반 백스페이스 처리
          this.value = this.value.slice(0, -1);
        }
        this.setContent(this.value);
      }
    }
    // 일반 문자 입력
    else if (ch) {
      // 제어 문자가 아닌 경우만 추가
      if (!/^[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f]$/.test(ch)) {
        this.value += ch;
        this.setContent(this.value);
      }
    }
  }

  /**
   * 외부 에디터에서 입력
   */
  readEditor(callback?: (err: Error | null, value: string | null) => void): void {
    if (this._reading) return;

    // 외부 에디터 이용 (실제 구현은 Screen에 의존)
    const options = { value: this.value };
    this.screen.readEditor(options, (err, value) => {
      if (err) {
        if (callback) return callback(err, null);
        return;
      }

      this.setValue(value || '');
      this.screen.render();

      if (callback) callback(null, value);
    });
  }

  /**
   * 입력 제출
   */
  submit(): void {
    if (!this._reading) return;
    this._done && this._done(null, this.value);
  }

  /**
   * 입력 취소
   */
  cancel(): void {
    if (!this._reading) return;
    this._done && this._done(null, null);
  }

  /**
   * 모든 값 지우기
   */
  clearValue(): void {
    this.value = '';
    this.setContent('');
    this._clines = [''];
  }
}