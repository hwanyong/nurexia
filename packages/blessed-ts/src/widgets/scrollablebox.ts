/**
 * scrollablebox.ts - scrollable box element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { Box, BoxOptions } from './box';
import { NodeType } from '../types';

/**
 * ScrollableBox options interface
 */
export interface ScrollableBoxOptions extends BoxOptions {
  scrollable?: boolean;
  baseLimit?: number;
  alwaysScroll?: boolean;
  scrollbar?: {
    ch?: string;
    track?: {
      ch?: string;
      style?: {
        fg?: string;
        bg?: string;
        bold?: boolean;
        underline?: boolean;
        inverse?: boolean;
        invisible?: boolean;
      };
      fg?: string;
      bg?: string;
      bold?: boolean;
      underline?: boolean;
      inverse?: boolean;
      invisible?: boolean;
    };
    style?: {
      fg?: string;
      bg?: string;
      bold?: boolean;
      underline?: boolean;
      inverse?: boolean;
      invisible?: boolean;
    };
    fg?: string;
    bg?: string;
    bold?: boolean;
    underline?: boolean;
    inverse?: boolean;
    invisible?: boolean;
  };
  mouse?: boolean;
  keys?: boolean;
  vi?: boolean;
  ignoreKeys?: boolean;
}

interface Items {
  length: number;
}

/**
 * ScrollableBox Class - Base container with scrolling capabilities
 */
export class ScrollableBox extends Box {
  /**
   * ScrollableBox specific properties
   */
  type: NodeType = 'scrollable-box';
  scrollable: boolean = true;
  childOffset: number = 0;
  childBase: number = 0;
  baseLimit: number;
  alwaysScroll: boolean;
  scrollbar?: {
    ch: string;
    style: any;
    track?: {
      ch: string;
      style: any;
    };
  };
  track?: {
    ch: string;
    style: any;
  };
  private _scrollingBar: boolean = false;
  private _isList: boolean = false;

  // Element 클래스에서 상속받은 속성들이 있지만, 선언만 하고 값은 상속받음
  declare screen: any;
  declare parent: any;
  declare children: any[];
  declare lpos: any;
  _clines: string[] = [];
  declare content: string;
  declare aleft: number;
  declare atop: number;
  declare iwidth: number;
  declare iheight: number;
  declare itop: number;
  declare iright: number;
  declare ibottom: number;
  declare _getCoords: (get?: boolean, noScroll?: boolean) => any;
  declare parseContent: () => void;
  declare onScreenEvent: (event: string, handler: (...args: any[]) => void) => void;
  declare removeScreenEvent: (event: string, handler: (...args: any[]) => void) => void;
  declare emit: (event: string, ...args: any[]) => any;
  // Additional properties
  declare detached: boolean;
  _drag?: any;
  items?: Items;

  /**
   * Helper methods to safely get numeric properties
   */
  private _safeHeight(): number {
    return typeof this.height === 'number' ? this.height : 0;
  }

  private _safeIHeight(): number {
    return typeof this.iheight === 'number' ? this.iheight : 0;
  }

  private _safeITop(): number {
    return typeof this.itop === 'number' ? this.itop : 0;
  }

  private _safeIRight(): number {
    return typeof this.iright === 'number' ? this.iright : 0;
  }

  /**
   * ScrollableBox constructor
   */
  constructor(options: ScrollableBoxOptions = {}) {
    super(options);

    if (options.scrollable === false) {
      this.scrollable = false;
      return;
    }

    this.childOffset = 0;
    this.childBase = 0;
    this.baseLimit = options.baseLimit || Infinity;
    this.alwaysScroll = options.alwaysScroll || false;

    // 스크롤바 설정
    if (options.scrollbar) {
      this.scrollbar = {
        ch: options.scrollbar.ch || ' ',
        style: this.style.scrollbar || {}
      };

      // 스크롤바 스타일 설정
      if (!this.style.scrollbar) {
        this.style.scrollbar = {};
        this.style.scrollbar.fg = options.scrollbar.fg;
        this.style.scrollbar.bg = options.scrollbar.bg;
        this.style.scrollbar.bold = options.scrollbar.bold;
        this.style.scrollbar.underline = options.scrollbar.underline;
        this.style.scrollbar.inverse = options.scrollbar.inverse;
        this.style.scrollbar.invisible = options.scrollbar.invisible;
      }

      // 트랙 설정
      if (options.scrollbar.track) {
        this.track = {
          ch: options.scrollbar.track.ch || ' ',
          style: this.style.track || {}
        };

        if (!this.style.track) {
          this.style.track = {};
          this.style.track.fg = options.scrollbar.track.fg;
          this.style.track.bg = options.scrollbar.track.bg;
          this.style.track.bold = options.scrollbar.track.bold;
          this.style.track.underline = options.scrollbar.track.underline;
          this.style.track.inverse = options.scrollbar.track.inverse;
          this.style.track.invisible = options.scrollbar.track.invisible;
        }
      }

      // 마우스로 스크롤바 제어
      if (options.mouse) {
        this.on('mousedown', (data: any) => {
          if (this._scrollingBar) {
            // 스크롤바에서의 드래그 방지
            delete this.screen._dragging;
            delete this._drag;
            return;
          }

          const x = data.x - this.aleft;
          const y = data.y - this.atop;

          if (x === this._safeWidth() - this._safeIRight() - 1) {
            // 스크롤바에서의 드래그 방지
            delete this.screen._dragging;
            delete this._drag;

            const perc = (y - this._safeITop()) / (this._safeHeight() - this._safeIHeight());
            this.setScrollPerc(Math.floor(perc * 100));
            this.screen.render();

            let smd: any, smu: any;
            this._scrollingBar = true;

            this.onScreenEvent('mousedown', smd = (data: any) => {
              const y = data.y - this.atop;
              const perc = y / Math.max(this._safeHeight(), 1);
              this.setScrollPerc(Math.floor(perc * 100));
              this.screen.render();
            });

            this.onScreenEvent('mouseup', smu = () => {
              this._scrollingBar = false;
              this.removeScreenEvent('mousedown', smd);
              this.removeScreenEvent('mouseup', smu);
            });
          }
        });
      }
    }

    // 마우스 휠 이벤트
    if (options.mouse) {
      this.on('wheeldown', () => {
        const height = Math.max(this._safeHeight(), 1);
        this.scroll(Math.floor(height / 2) || 1);
        this.screen.render();
      });

      this.on('wheelup', () => {
        const height = Math.max(this._safeHeight(), 1);
        this.scroll(-Math.floor(height / 2) || -1);
        this.screen.render();
      });
    }

    // 키보드 이벤트
    if (options.keys && !options.ignoreKeys) {
      this.on('keypress', (ch: string, key: any) => {
        // 위/아래 키 또는 vi 모드에서 j/k
        if (key.name === 'up' || (options.vi && key.name === 'k')) {
          this.scroll(-1);
          this.screen.render();
          return;
        }
        if (key.name === 'down' || (options.vi && key.name === 'j')) {
          this.scroll(1);
          this.screen.render();
          return;
        }

        // vi 모드에서 특수 키 조합
        if (options.vi && key.name === 'u' && key.ctrl) {
          const height = Math.max(this._safeHeight(), 1);
          this.scroll(-Math.floor(height / 2) || -1);
          this.screen.render();
          return;
        }
        if (options.vi && key.name === 'd' && key.ctrl) {
          const height = Math.max(this._safeHeight(), 1);
          this.scroll(Math.floor(height / 2) || 1);
          this.screen.render();
          return;
        }
        if (options.vi && key.name === 'b' && key.ctrl) {
          const height = Math.max(this._safeHeight(), 1);
          this.scroll(-height || -1);
          this.screen.render();
          return;
        }
        if (options.vi && key.name === 'f' && key.ctrl) {
          const height = Math.max(this._safeHeight(), 1);
          this.scroll(height || 1);
          this.screen.render();
          return;
        }
        if (options.vi && key.name === 'g' && !key.shift) {
          this.scrollTo(0);
          this.screen.render();
          return;
        }
        if (options.vi && key.name === 'g' && key.shift) {
          this.scrollTo(this.getScrollHeight());
          this.screen.render();
          return;
        }
      });
    }

    // 콘텐츠 파싱 후 인덱스 재계산
    this.on('parsed content', () => {
      this._recalculateIndex();
    });

    // 초기 인덱스 계산
    this._recalculateIndex();
  }

  /**
   * 실제로 스크롤 가능한지 여부 확인
   */
  get reallyScrollable(): boolean {
    if (this.shrink) return this.scrollable;
    return this.getScrollHeight() > this._safeHeight();
  }

  /**
   * Helper method to get width safely
   */
  private _safeWidth(): number {
    return typeof this.width === 'number' ? this.width : 0;
  }

  /**
   * 스크롤 아래쪽 경계값 계산
   */
  _scrollBottom(): number {
    if (!this.scrollable) return 0;

    // 리스트인 경우 최적화
    if (this._isList) {
      return this.items ? this.items.length : 0;
    }

    if (this.lpos && this.lpos._scrollBottom) {
      return this.lpos._scrollBottom;
    }

    const bottom = this.children.reduce((current: number, el: any) => {
      if (!el.detached) {
        const lpos = el._getCoords(false, true);
        if (lpos) {
          return Math.max(current, el.rtop + (lpos.yl - lpos.yi));
        }
      }
      return Math.max(current, el.rtop + el.height);
    }, 0);

    if (this.lpos) this.lpos._scrollBottom = bottom;

    return bottom;
  }

  /**
   * 특정 위치로 스크롤 이동
   */
  scrollTo(offset: number, always?: boolean): any {
    this.scroll(0);
    return this.scroll(offset - (this.childBase + this.childOffset), always);
  }

  /**
   * 별칭: setScroll
   */
  setScroll = this.scrollTo;

  /**
   * 현재 스크롤 위치 반환
   */
  getScroll(): number {
    return this.childBase + this.childOffset;
  }

  /**
   * 지정된 오프셋만큼 스크롤
   */
  scroll(offset: number, always?: boolean): any {
    if (!this.scrollable) return;
    if (this.detached) return;

    // 스크롤 처리
    const visible = this._safeHeight() - this._safeIHeight();
    const base = this.childBase;
    let d: number;

    if (this.alwaysScroll || always) {
      // 항상 스크롤
      this.childOffset = offset > 0
        ? visible - 1 + offset
        : offset;
    } else {
      this.childOffset += offset;
    }

    if (this.childOffset > visible - 1) {
      d = this.childOffset - (visible - 1);
      this.childOffset -= d;
      this.childBase += d;
    } else if (this.childOffset < 0) {
      d = this.childOffset;
      this.childOffset += -d;
      this.childBase += d;
    }

    if (this.childBase < 0) {
      this.childBase = 0;
    } else if (this.childBase > this.baseLimit) {
      this.childBase = this.baseLimit;
    }

    // 스크롤이 변경되지 않은 경우
    if (this.childBase === base) {
      return this.emit('scroll');
    }

    // 텍스트 스크롤 시 SGR 코드와 줄 바꿈 처리
    this.parseContent();

    // 최대 스크롤 값 계산
    let max = this._clines.length - (this._safeHeight() - this._safeIHeight());
    if (max < 0) max = 0;
    let emax = this._scrollBottom() - (this._safeHeight() - this._safeIHeight());
    if (emax < 0) emax = 0;

    this.childBase = Math.min(this.childBase, Math.max(emax, max));

    if (this.childBase < 0) {
      this.childBase = 0;
    } else if (this.childBase > this.baseLimit) {
      this.childBase = this.baseLimit;
    }

    // CSR + IL/DL로 스크롤 최적화
    const p = this.lpos;
    if (p && this.childBase !== base && this.screen.cleanSides(this)) {
      const t = p.yi + this.itop;
      const b = p.yl - this.ibottom - 1;
      d = this.childBase - base;

      if (d > 0 && d < visible) {
        // 아래로 스크롤
        this.screen.deleteLine(d, t, t, b);
      } else if (d < 0 && -d < visible) {
        // 위로 스크롤
        d = -d;
        this.screen.insertLine(d, t, t, b);
      }
    }

    return this.emit('scroll');
  }

  /**
   * 스크롤 인덱스 재계산
   */
  _recalculateIndex(): number {
    let max: number, emax: number;

    if (this.detached || !this.scrollable) {
      return 0;
    }

    max = this._clines.length - (this._safeHeight() - this._safeIHeight());
    if (max < 0) max = 0;
    emax = this._scrollBottom() - (this._safeHeight() - this._safeIHeight());
    if (emax < 0) emax = 0;

    this.childBase = Math.min(this.childBase, Math.max(emax, max));

    if (this.childBase < 0) {
      this.childBase = 0;
    } else if (this.childBase > this.baseLimit) {
      this.childBase = this.baseLimit;
    }

    return this.childBase;
  }

  /**
   * 스크롤 초기화
   */
  resetScroll(): any {
    if (!this.scrollable) return;
    this.childOffset = 0;
    this.childBase = 0;
    return this.emit('scroll');
  }

  /**
   * 스크롤 가능한 총 높이 반환
   */
  getScrollHeight(): number {
    return Math.max(this._clines.length, this._scrollBottom());
  }

  /**
   * 현재 스크롤 위치의 백분율 반환
   */
  getScrollPerc(s?: boolean): number {
    const pos = this.lpos || this._getCoords();
    if (!pos) return s ? -1 : 0;

    const height = (pos.yl - pos.yi) - this._safeIHeight();
    const i = this.getScrollHeight();
    let p: number;

    if (height < i) {
      if (this.alwaysScroll) {
        p = this.childBase / (i - height);
      } else {
        p = (this.childBase + this.childOffset) / (i - 1);
      }
      return p * 100;
    }

    return s ? -1 : 0;
  }

  /**
   * 스크롤 위치를 백분율로 설정
   */
  setScrollPerc(i: number): any {
    const m = Math.max(this._clines.length, this._scrollBottom());
    return this.scrollTo(Math.floor((i / 100) * m));
  }
}