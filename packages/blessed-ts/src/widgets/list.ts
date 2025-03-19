/**
 * list.ts - List 위젯 컴포넌트
 *
 * 항목 목록을 표시하고 선택할 수 있는 인터랙티브 리스트 컴포넌트
 */

import { Box } from './box';
import type { ListOptions } from '../types';

/**
 * List 위젯 클래스
 *
 * 아이템 목록을 표시하고 선택, 스크롤 등의 상호작용을 제공하는 컴포넌트입니다.
 */
export class List extends Box {
  /**
   * List 위젯 타입
   */
  type = 'list';

  /**
   * 목록 아이템들
   */
  items: string[] = [];

  /**
   * 원본 아이템들 (태그 등이 적용되지 않은 상태)
   */
  ritems: string[] = [];

  /**
   * 현재 선택된 아이템 인덱스
   */
  selected: number = 0;

  /**
   * 상호작용 가능 여부
   */
  interactive: boolean = true;

  /**
   * 내부 식별자
   */
  private _isList: boolean = true;

  /**
   * List 위젯 생성자
   */
  constructor(options: ListOptions = {}) {
    // List 위젯 기본 옵션 설정
    options.ignoreKeys = true;
    options.scrollable = options.scrollable !== false;

    super(options);

    // 스타일 초기화
    if (!this.style.selected) {
      this.style.selected = {};
      this.style.selected.bg = options.selectedBg;
      this.style.selected.fg = options.selectedFg;
      this.style.selected.bold = options.selectedBold;
      this.style.selected.underline = options.selectedUnderline;
      this.style.selected.blink = options.selectedBlink;
      this.style.selected.inverse = options.selectedInverse;
      this.style.selected.invisible = options.selectedInvisible;
    }

    if (!this.style.item) {
      this.style.item = {};
      this.style.item.bg = options.itemBg;
      this.style.item.fg = options.itemFg;
    }

    // 기본값 설정
    this.interactive = options.interactive !== false;

    // 초기 아이템 설정
    if (options.items) {
      this.setItems(options.items);
    }

    // 초기 선택 아이템 설정
    if (typeof options.selected === 'number') {
      this.select(options.selected);
    }

    // 이벤트 바인딩 추가 필요
    this.on('keypress', this._onKeypress.bind(this));
  }

  /**
   * 키 입력 이벤트 핸들러
   */
  private _onKeypress(ch: string, key: any): void {
    if (key.name === 'up' || (this.vi && key.name === 'k')) {
      this.up();
      return;
    }
    if (key.name === 'down' || (this.vi && key.name === 'j')) {
      this.down();
      return;
    }
    if (key.name === 'home') {
      this.select(0);
      return;
    }
    if (key.name === 'end') {
      this.select(this.items.length - 1);
      return;
    }
  }

  /**
   * 목록 아이템 설정
   */
  setItems(items: string[]): void {
    this.items = items.map(item => this.parseItem(item));
    this.ritems = items.slice();

    // 선택 범위 조정
    if (this.selected >= this.items.length) {
      this.selected = this.items.length - 1;
      if (this.selected < 0) this.selected = 0;
    }

    this.emit('set items');
    this.screen?.render();
  }

  /**
   * 아이템 파싱 (태그 처리 등)
   */
  parseItem(item: string): string {
    return this.tags ? this.parseTags(item) : item;
  }

  /**
   * 아이템 추가
   */
  add(item: string): void {
    this.items.push(this.parseItem(item));
    this.ritems.push(item);
    this.emit('add item');
    this.screen?.render();
  }

  /**
   * 아이템 추가 (add의 별칭)
   */
  addItem(item: string): void {
    return this.add(item);
  }

  /**
   * 아이템 제거
   */
  removeItem(i: number): void {
    if (i < 0 || i >= this.items.length) return;

    this.items.splice(i, 1);
    this.ritems.splice(i, 1);

    if (i === this.selected && this.items.length) {
      this.selected = Math.min(this.selected, this.items.length - 1);
    }

    this.emit('remove item');
    this.screen?.render();
  }

  /**
   * 아이템 삽입
   */
  insertItem(i: number, item: string): void {
    if (i < 0 || i > this.items.length) return;

    this.items.splice(i, 0, this.parseItem(item));
    this.ritems.splice(i, 0, item);

    if (i <= this.selected && this.items.length) {
      this.selected++;
    }

    this.emit('insert item');
    this.screen?.render();
  }

  /**
   * 아이템 가져오기
   */
  getItem(i: number): string {
    return this.ritems[i];
  }

  /**
   * 아이템 설정
   */
  setItem(i: number, item: string): void {
    if (i < 0 || i >= this.items.length) return;

    this.items[i] = this.parseItem(item);
    this.ritems[i] = item;

    this.emit('set item');
    this.screen?.render();
  }

  /**
   * 모든 아이템 제거
   */
  clearItems(): void {
    this.items = [];
    this.ritems = [];
    this.selected = 0;

    this.emit('clear items');
    this.screen?.render();
  }

  /**
   * 아이템 선택
   */
  select(i: number): void {
    if (i < 0 || i >= this.items.length) return;

    this.selected = i;

    // 스크롤 조정
    if (this.scrollable) {
      const height = (this.height as number) - this.iheight;

      if (this.selected < this.childBase) {
        this.scrollTo(this.selected);
      } else if (this.selected >= this.childBase + height) {
        this.scrollTo(this.selected - height + 1);
      }
    }

    this.emit('select item', this.items[this.selected], this.selected);
    this.screen?.render();
  }

  /**
   * 선택 이동
   */
  move(offset: number): void {
    this.select(this.selected + offset);
  }

  /**
   * 위로 이동
   */
  up(offset = 1): void {
    this.move(-offset);
  }

  /**
   * 아래로 이동
   */
  down(offset = 1): void {
    this.move(offset);
  }

  /**
   * 컨텐츠 렌더링
   */
  render(): void {
    // 기본 렌더링
    super.render();

    // 현재 자식 오프셋
    const start = this.childBase;
    const height = (this.height as number) - this.iheight;

    // 아이템 렌더링 로직 구현 필요
    // ...

    this.emit('rendered');
  }
}