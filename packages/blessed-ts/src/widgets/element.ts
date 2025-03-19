/**
 * blessed-ts - A TypeScript implementation of the blessed terminal library
 * Element Class - 기본 UI 요소
 */

import { Node } from './node';
import type {
  Border,
  Element as ElementInterface,
  ElementOptions,
  Position,
  ScrollbarOptions,
  Style
} from '../types';
import GraphemeSplitter from 'grapheme-splitter';

// 그래핌 분할기 - 한글 등 다국어 처리에 필요
const splitter = new GraphemeSplitter();

/**
 * 요소 클래스 - 화면에 표시되는 기본 요소
 */
export class Element extends Node implements ElementInterface {
  type: string = 'element';

  // 요소 특성
  align: string = 'left';
  valign: string = 'top';
  content: string = '';
  position: Position = { xi: 0, xl: 0, yi: 0, yl: 0 };
  border: Border = {};
  padding: { left: number; right: number; top: number; bottom: number } = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  };
  label: string = '';

  // 렌더링 옵션
  scrollable: boolean = false;
  tags: boolean = false;
  wrap: boolean = false;
  ch: string = ' ';
  mouse: boolean = false;
  keys: boolean | string[] = false;
  vi: boolean = false;
  alwaysScroll: boolean = false;
  scrollbar: ScrollbarOptions | boolean = false;

  // 내부 속성
  _clines: string[] = [];
  _scroll: number = 0;
  _baseLine: number = 0;
  childBase: number = 0;
  childOffset: number = 0;
  iheight: number = 0;
  iwidth: number = 0;
  itop: number = 0;
  ileft: number = 0;

  /**
   * Element 생성자
   */
  constructor(options: ElementOptions = {}) {
    super(options);

    // Element 속성 설정
    if (options.content !== undefined) this.content = options.content;
    if (options.align !== undefined) this.align = options.align;
    if (options.valign !== undefined) this.valign = options.valign;
    if (options.wrap !== undefined) this.wrap = options.wrap;
    if (options.tags !== undefined) this.tags = options.tags;
    if (options.scrollable !== undefined) this.scrollable = options.scrollable;
    if (options.ch !== undefined) this.ch = options.ch;
    if (options.mouse !== undefined) this.mouse = options.mouse;
    if (options.keys !== undefined) this.keys = options.keys;
    if (options.vi !== undefined) this.vi = options.vi;
    if (options.alwaysScroll !== undefined) this.alwaysScroll = options.alwaysScroll;
    if (options.scrollbar !== undefined) this.scrollbar = options.scrollbar;

    // 테두리 설정
    if (options.border) {
      if (typeof options.border === 'string') {
        this.border = {
          type: options.border
        };
      } else if (typeof options.border === 'boolean') {
        this.border = {
          type: options.border ? 'line' : undefined
        };
      } else {
        this.border = { ...this.border, ...options.border };
      }
    }

    // 패딩 설정
    if (options.padding !== undefined) {
      if (typeof options.padding === 'number') {
        this.padding = {
          left: options.padding,
          right: options.padding,
          top: options.padding,
          bottom: options.padding
        };
      } else if (typeof options.padding === 'object') {
        this.padding = {
          ...this.padding,
          ...options.padding
        };
      }
    }

    // 라벨 설정
    if (options.label !== undefined) {
      this.label = options.label;
    }

    // 마우스 이벤트 설정
    if (this.mouse) {
      this.enableMouse();
    }

    // 초기 콘텐츠 처리
    this._parseContent();
  }

  /**
   * 요소 렌더링
   */
  render(): void {
    // 실제 구현은 자식 클래스에서 제공
    this.emit('render');
  }

  /**
   * 콘텐츠 파싱
   */
  private _parseContent(): void {
    if (!this.content) {
      this._clines = [''];
      return;
    }

    // 줄 바꿈으로 분할
    const lines = this.content.split('\n');

    // 각 줄 처리
    if (this.wrap) {
      // TODO: 래핑 처리 구현
      this._clines = lines;
    } else {
      this._clines = lines;
    }
  }

  /**
   * 콘텐츠 설정
   */
  setContent(content: string): void {
    this.content = content || '';
    this._parseContent();
    this.emit('set content');
  }

  /**
   * 콘텐츠 가져오기
   */
  getContent(): string {
    return this.content;
  }

  /**
   * 텍스트 가져오기 (태그 제거)
   */
  getText(): string {
    return this.parseTags(this.content);
  }

  /**
   * 텍스트 설정
   */
  setText(text: string): void {
    this.setContent(text);
  }

  /**
   * 태그 파싱
   */
  parseTags(text: string): string {
    if (!this.tags) return text;

    // 간단한 태그 제거 (실제 구현은 더 복잡함)
    return text.replace(/{[^{}]+}/g, '');
  }

  /**
   * 특정 줄 설정
   */
  setLine(i: number, line: string): void {
    if (!this._clines) this._clines = [];

    this._clines[i] = line;

    // 콘텐츠 업데이트
    this.content = this._clines.join('\n');
  }

  /**
   * 특정 줄 가져오기
   */
  getLine(i: number): string {
    return this._clines[i] || '';
  }

  /**
   * 기본 줄 가져오기
   */
  getBaseLine(i: number): string {
    return this.getLine(i + this.childBase);
  }

  /**
   * 화면 줄 가져오기
   */
  getScreenLine(i: number): string {
    return this.getLine(i + this._baseLine);
  }

  /**
   * 줄 삽입
   */
  insertLine(i: number, line: string): void {
    if (!this._clines) this._clines = [];

    this._clines.splice(i, 0, line);

    // 콘텐츠 업데이트
    this.content = this._clines.join('\n');
  }

  /**
   * 줄 삭제
   */
  deleteLine(i: number): void {
    if (!this._clines) this._clines = [];

    this._clines.splice(i, 1);

    // 콘텐츠 업데이트
    this.content = this._clines.join('\n');
  }

  /**
   * 줄 지우기
   */
  clearLine(i: number): void {
    if (!this._clines) this._clines = [];

    this._clines[i] = '';

    // 콘텐츠 업데이트
    this.content = this._clines.join('\n');
  }

  /**
   * 특정 위치 지우기
   */
  clearPos(x: number, y: number): void {
    // 구현 필요
  }

  /**
   * 값 지우기
   */
  clearValue(): void {
    this.setContent('');
  }

  /**
   * 요소 보이기
   */
  show(): void {
    if (this.hidden) {
      this.hidden = false;
      this.emit('show');
    }
  }

  /**
   * 요소 숨기기
   */
  hide(): void {
    if (!this.hidden) {
      this.hidden = true;
      this.emit('hide');
    }
  }

  /**
   * 요소 표시 상태 전환
   */
  toggle(): void {
    if (this.hidden) {
      this.show();
    } else {
      this.hide();
    }
  }

  /**
   * 요소 이동
   */
  move(dx: number, dy: number): void {
    // 좌표 기반 값이면 더하기
    if (typeof this.left === 'number') {
      this.left = (this.left as number) + dx;
    }

    if (typeof this.top === 'number') {
      this.top = (this.top as number) + dy;
    }

    // lpos 캐시 초기화
    delete this.lpos;

    // 이동 이벤트 발생
    this.emit('move');
  }

  /**
   * X축 이동
   */
  moveX(dx: number): void {
    this.move(dx, 0);
  }

  /**
   * Y축 이동
   */
  moveY(dy: number): void {
    this.move(0, dy);
  }

  /**
   * 키 입력 활성화
   */
  enableKeys(): void {
    this.keys = true;
  }

  /**
   * 키 입력 비활성화
   */
  disableKeys(): void {
    this.keys = false;
  }

  /**
   * 입력 활성화
   */
  enableInput(): void {
    this.enableKeys();
    this.enableMouse();
  }

  /**
   * 입력 비활성화
   */
  disableInput(): void {
    this.disableKeys();
    this.disableMouse();
  }

  /**
   * 문자열 너비 계산
   */
  strWidth(text: string): number {
    if (!text) return 0;

    // 다국어 그래핌 처리
    if (this.screen.fullUnicode) {
      // 그래핌 단위로 분할
      const graphemes = splitter.splitGraphemes(text);

      // 각 문자 너비 계산
      return graphemes.reduce((width, char) => {
        // 동아시아 전각 문자(CJK) 판별 - 한글, 한자, 일본어 등
        if (/[\u1100-\u11FF\u2E80-\u2FDF\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3200-\u32FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF\uAC00-\uD7AF]/.test(char)) {
          return width + 2;  // 전각 문자는 너비 2
        }
        return width + 1;    // 일반 문자는 너비 1
      }, 0);
    }

    // 기본 문자열 길이 반환
    return text.length;
  }

  /**
   * 스크롤 위치 설정
   */
  scrollTo(offset: number): void {
    this._scroll = offset;
    if (this._clines && offset > this._clines.length) {
      this._scroll = this._clines.length - 1;
    }
    if (this._scroll < 0) {
      this._scroll = 0;
    }
  }
}