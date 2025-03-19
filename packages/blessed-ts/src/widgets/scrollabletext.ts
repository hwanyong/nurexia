/**
 * scrollabletext.ts - scrollable text element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { ScrollableBox, ScrollableBoxOptions } from './scrollablebox';
import { NodeType } from '../types';

/**
 * ScrollableText options interface
 */
export interface ScrollableTextOptions extends ScrollableBoxOptions {
  alwaysScroll?: boolean;
  scrollbar?: any;
  mouse?: boolean;
}

/**
 * ScrollableText Class - Scrollable text widget
 */
export class ScrollableText extends ScrollableBox {
  /**
   * ScrollableText specific properties
   */
  type: NodeType = 'scrollable-text';

  /**
   * ScrollableText constructor
   */
  constructor(options: ScrollableTextOptions = {}) {
    // 기본 옵션 설정
    options.scrollable = options.scrollable !== false;
    options.alwaysScroll = options.alwaysScroll !== false;

    // 스크롤바 기본 설정
    if (!options.scrollbar && options.scrollbar !== false) {
      options.scrollbar = {
        ch: ' ',
        inverse: true
      };
    }

    super(options);

    this.on('set content', () => {
      this.setContent(this.content);
    });

    this.on('resize', () => {
      this.emit('set content');
    });
  }

  /**
   * 텍스트 내용 설정
   */
  setContent(content: string): this {
    // ScrollableBox의 setContent 메서드 호출
    super.setContent(content);

    // 항상 최대 스크롤 위치로 설정하는 옵션이 있는 경우
    if (this.alwaysScroll) {
      this.setScrollPerc(100);
    }

    this.emit('set content');

    return this;
  }
}