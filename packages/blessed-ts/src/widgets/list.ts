/**
 * list.ts - list element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { ScrollableBox, ScrollableBoxOptions } from './scrollablebox';
import { NodeType } from '../types';

/**
 * List options interface
 */
export interface ListOptions extends ScrollableBoxOptions {
  items?: string[];
  search?: boolean;
  vi?: boolean;
  mouse?: boolean;
  keys?: boolean;
  interactive?: boolean;
  invertSelection?: boolean;
}

/**
 * List Class - Interactive list widget
 */
export class List extends ScrollableBox {
  /**
   * List specific properties
   */
  type: NodeType = 'list';
  items: string[] = [];
  ritems: string[] = [];
  selected: number = 0;
  value: string = '';
  interactive: boolean = true;
  invertSelection: boolean = false;
  search: boolean = false;
  private mouse: boolean;
  private keys: boolean;
  private vi: boolean;

  /**
   * List constructor
   */
  constructor(options: ListOptions = {}) {
    options.interactive = options.interactive !== false;

    super(options);

    // List 전용 속성 설정
    this.items = options.items || [];
    this.ritems = this.items.slice();
    this.interactive = options.interactive !== false;
    this.invertSelection = options.invertSelection || false;
    this.search = options.search || false;
    this.mouse = options.mouse !== false;
    this.keys = options.keys !== false;
    this.vi = options.vi || false;

    // ScrollableBox의 _isList 속성을 true로 설정
    this['_isList'] = true;

    if (options.items) {
      this.setItems(options.items);
    }

    if (!this.style.selected) {
      this.style.selected = {};
      this.style.selected.bg = options.invertSelection ? undefined : 'blue';
      this.style.selected.fg = options.invertSelection ? 'blue' : undefined;
      this.style.selected.bold = options.invertSelection;
      this.style.selected.underline = options.invertSelection;
    }

    if (!this.style.item) {
      this.style.item = {};
    }

    // 이벤트 핸들러 등록
    this.on('select', () => {
      this.value = this.items[this.selected];
    });

    // 스크롤 위치 조정
    this.on('resize', () => {
      this.select(this.selected);
    });

    if (this.interactive) {
      this.setupKeys();
      this.setupMouse();
    }
  }

  /**
   * 키보드 이벤트 설정
   */
  private setupKeys(): void {
    if (!this.keys) return;

    this.on('keypress', (ch, key) => {
      if (key.name === 'up' || (this.vi && key.name === 'k')) {
        this.up();
        this.screen.render();
        return;
      }
      if (key.name === 'down' || (this.vi && key.name === 'j')) {
        this.down();
        this.screen.render();
        return;
      }
      if (key.name === 'home') {
        this.select(0);
        this.screen.render();
        return;
      }
      if (key.name === 'end') {
        this.select(this.items.length - 1);
        this.screen.render();
        return;
      }
      if (key.name === 'pageup') {
        const height = this['_safeHeight']();
        this.select(this.selected - height);
        this.screen.render();
        return;
      }
      if (key.name === 'pagedown') {
        const height = this['_safeHeight']();
        this.select(this.selected + height);
        this.screen.render();
        return;
      }
      if (key.name === 'enter') {
        this.emit('action', this.items[this.selected], this.selected);
        this.emit('select', this.items[this.selected], this.selected);
        this.screen.render();
        return;
      }
      if (this.search && key.name.length === 1 && key.ctrl !== true && key.meta !== true) {
        this.searchForItem(key.name);
        this.screen.render();
        return;
      }
    });
  }

  /**
   * 마우스 이벤트 설정
   */
  private setupMouse(): void {
    if (!this.mouse) return;

    this.on('click', (data) => {
      const index = this.coordsToIndex(data);
      if (index !== -1) {
        this.select(index);
        this.emit('action', this.items[this.selected], this.selected);
        this.emit('select', this.items[this.selected], this.selected);
        this.screen.render();
      }
    });
  }

  /**
   * 마우스 좌표를 항목 인덱스로 변환
   */
  private coordsToIndex(data: any): number {
    const h = this['_safeHeight']() - this.iheight;
    if (h === 0) return -1;

    const s = this.childBase || 0;
    const y = data.y - this.itop;
    if (y < 0 || y >= h) return -1;

    return s + y;
  }

  /**
   * 항목 검색
   */
  private searchForItem(term: string): void {
    // 검색 로직 구현
    // 가장 간단한 구현은 첫 글자만 비교하는 것
    term = term.toLowerCase();
    for (let i = this.selected + 1; i < this.items.length; i++) {
      const item = this.items[i].toLowerCase();
      if (item.startsWith(term)) {
        this.select(i);
        return;
      }
    }
    // 처음부터 다시 검색
    for (let i = 0; i < this.selected; i++) {
      const item = this.items[i].toLowerCase();
      if (item.startsWith(term)) {
        this.select(i);
        return;
      }
    }
  }

  /**
   * 항목 목록 설정
   */
  setItems(items: string[]): void {
    this.items = items.slice();
    this.ritems = items.slice();

    // 선택 인덱스 조정
    if (this.selected >= this.items.length) {
      this.selected = this.items.length - 1;
      if (this.selected < 0) this.selected = 0;
    }

    this._recalculateIndex();

    // 내용 업데이트
    this.emit('set items');
  }

  /**
   * 항목 추가
   */
  add(item: string): void {
    this.items.push(item);
    this.ritems.push(item);
    this._recalculateIndex();
    this.emit('add item');
  }

  /**
   * 항목 제거
   */
  removeItem(i: number): void {
    if (i < 0 || i >= this.items.length) return;

    this.items.splice(i, 1);
    this.ritems.splice(i, 1);

    if (i === this.selected && this.items.length) {
      this.select(i - 1 < 0 ? 0 : i - 1);
    }

    this._recalculateIndex();
    this.emit('remove item');
  }

  /**
   * 항목 삽입
   */
  insertItem(i: number, item: string): void {
    if (i < 0 || i > this.items.length) return;

    this.items.splice(i, 0, item);
    this.ritems.splice(i, 0, item);

    if (this.selected >= i) {
      this.select(this.selected + 1);
    }

    this._recalculateIndex();
    this.emit('insert item');
  }

  /**
   * 위로 이동
   */
  up(amount: number = 1): void {
    this.select(this.selected - amount);
  }

  /**
   * 아래로 이동
   */
  down(amount: number = 1): void {
    this.select(this.selected + amount);
  }

  /**
   * 항목 선택
   */
  select(index: number): void {
    if (!this.items.length) {
      this.selected = 0;
      this.value = '';
      return;
    }

    // 인덱스 범위 제한
    if (index < 0) index = 0;
    else if (index >= this.items.length) index = this.items.length - 1;

    this.selected = index;
    this.value = this.items[this.selected];

    // 스크롤 조정
    this.scrollTo(this.selected);

    // 선택 이벤트 발생
    this.emit('select item', this.value, this.selected);
  }

  /**
   * 항목 렌더링
   */
  renderItem(index: number): string {
    const item = this.items[index];
    if (!item) return '';

    // 선택된 항목 스타일 적용
    if (this.selected === index) {
      return this.styleSelection(item);
    }

    return item;
  }

  /**
   * 선택된 항목에 스타일 적용
   */
  private styleSelection(item: string): string {
    // 스타일 속성 적용
    return `{${this.invertSelection ? 'inverse' : 'blue-bg'}}${item}{/${this.invertSelection ? 'inverse' : 'blue-bg'}}`;
  }

  /**
   * 콘텐츠 렌더링
   */
  renderContent(): string {
    let content = '';
    const height = this['_safeHeight']() - this.iheight;

    for (let i = this.childBase; i < this.childBase + height; i++) {
      if (i >= this.items.length) break;

      content += this.renderItem(i);
      if (i < this.childBase + height - 1) {
        content += '\n';
      }
    }

    return content;
  }

  /**
   * 내용 스크롤
   */
  scrollTo(index: number): void {
    if (index < 0) index = 0;
    else if (index >= this.items.length) index = this.items.length - 1;

    const height = this['_safeHeight']() - this.iheight;
    const top = this.childBase;
    const bottom = this.childBase + height - 1;

    // 이미 보이는 범위 내에 있으면 스크롤하지 않음
    if (index >= top && index <= bottom) return;

    // 위로 스크롤
    if (index < top) {
      this.childBase = index;
    // 아래로 스크롤
    } else {
      this.childBase = index - height + 1;
      if (this.childBase < 0) this.childBase = 0;
    }

    this._recalculateIndex();
  }
}