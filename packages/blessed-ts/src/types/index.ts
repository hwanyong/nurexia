/**
 * blessed-ts - A TypeScript implementation of the blessed terminal library
 * Core Type Definitions
 */

import { EventEmitter } from 'events';

/**
 * 색상 정의
 */
export type Color = string;

/**
 * 테두리 스타일 정의
 */
export type BorderType = 'line' | 'bg';

export interface Border {
  type?: BorderType;
  ch?: string;
  bg?: Color;
  fg?: Color;
}

/**
 * 스타일 정의
 */
export interface Style {
  fg?: Color;
  bg?: Color;
  bold?: boolean;
  underline?: boolean;
  blink?: boolean;
  inverse?: boolean;
  invisible?: boolean;
  transparent?: boolean;
  border?: Border;
  focus?: {
    fg?: Color;
    bg?: Color;
    bold?: boolean;
    underline?: boolean;
    blink?: boolean;
    inverse?: boolean;
    invisible?: boolean;
    border?: Border;
  };
  hover?: {
    fg?: Color;
    bg?: Color;
    bold?: boolean;
    underline?: boolean;
    blink?: boolean;
    inverse?: boolean;
    invisible?: boolean;
    border?: Border;
  };
  scrollbar?: {
    fg?: Color;
    bg?: Color;
  };
  track?: {
    fg?: Color;
    bg?: Color;
  };
  item?: {
    fg?: Color;
    bg?: Color;
  };
  selected?: {
    fg?: Color;
    bg?: Color;
  };
}

/**
 * 이벤트 정의
 */
export interface NodeEvents {
  keypress: [string, KeyboardEvent];
  focus: [];
  blur: [];
  click: [MouseEvent];
  mouseover: [MouseEvent];
  mouseout: [MouseEvent];
  mouseup: [MouseEvent];
  mousedown: [MouseEvent];
  mousewheel: [MouseEvent];
  resize: [];
  move: [];
  destroy: [];
  show: [];
  hide: [];
  enable: [];
  disable: [];
}

/**
 * KeyboardEvent 정의
 */
export interface KeyboardEvent {
  name?: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  sequence?: string;
  code?: string;
  raw?: string;
  full?: string;
}

/**
 * MouseEvent 정의
 */
export interface MouseEvent {
  x: number;
  y: number;
  button?: 'left' | 'right' | 'middle';
  shift?: boolean;
  meta?: boolean;
  ctrl?: boolean;
  action?: 'mousedown' | 'mouseup' | 'mousemove' | 'mousewheel';
  code?: string;
}

/**
 * Position 정의
 */
export interface Position {
  xi: number;
  xl: number;
  yi: number;
  yl: number;
}

/**
 * 화면 위치 정의 타입
 */
export type PositionConfig = number | string | 'center';

/**
 * 커서 옵션
 */
export interface CursorOptions {
  artificial?: boolean;
  shape?: 'block' | 'underline' | 'line';
  blink?: boolean;
  color?: Color;
}

/**
 * 스크롤바 옵션
 */
export interface ScrollbarOptions {
  ch?: string;
  track?: {
    bg?: Color;
  };
  style?: {
    fg?: Color;
    bg?: Color;
    inverse?: boolean;
  };
}

/**
 * 화면 옵션
 */
export interface ScreenOptions {
  autoPadding?: boolean;
  fastCSR?: boolean;
  cursor?: CursorOptions;
  debug?: boolean;
  dump?: boolean;
  dockBorders?: boolean;
  focused?: boolean;
  fullUnicode?: boolean;
  sendFocus?: boolean;
  ignoreLocked?: string[];
  log?: string;
  resizeTimeout?: number;
  smartCSR?: boolean;
  tabSize?: number;
  terminal?: string;
  title?: string;
  warnings?: boolean;
  forceUnicode?: boolean;
  input?: NodeJS.ReadableStream;
  output?: NodeJS.WritableStream;
}

/**
 * Screen 인터페이스 미리 선언 (순환 참조 해결)
 */
export interface Screen extends EventEmitter {
  type: 'screen';
}

/**
 * 노드 베이스 옵션
 */
export interface NodeOptions {
  name?: string;
  screen?: Screen;
  parent?: Node;
  children?: Node[];
  focusable?: boolean;
  clickable?: boolean;
  draggable?: boolean;
  hidden?: boolean;
  visible?: boolean;
  fixed?: boolean;
  position?: Position;
  top?: PositionConfig;
  left?: PositionConfig;
  right?: PositionConfig;
  bottom?: PositionConfig;
  width?: number | string | 'half' | 'shrink';
  height?: number | string | 'half' | 'shrink';
  shrink?: boolean;
  style?: Style;
}

/**
 * 요소 옵션
 */
export interface ElementOptions extends NodeOptions {
  tags?: boolean;
  content?: string;
  border?: boolean | BorderType | Border;
  hoverBg?: Color;
  hoverFg?: Color;
  hoverEffects?: any;
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  wrap?: boolean;
  padding?: number | { left?: number; right?: number; top?: number; bottom?: number };
  label?: string;
  scrollable?: boolean;
  ch?: string;
  mouse?: boolean;
  keys?: boolean | string[];
  vi?: boolean;
  alwaysScroll?: boolean;
  scrollbar?: boolean | ScrollbarOptions;
  shadow?: boolean;
  fill?: boolean;
  autoFocus?: boolean;
}

/**
 * 위젯 타입 정의
 */
export interface BoxOptions extends ElementOptions {
  // 기본 box는 추가 옵션이 없지만 확장성을 위해 인터페이스를 유지
}

export interface TextOptions extends ElementOptions {
  bold?: boolean;
  underline?: boolean;
  blink?: boolean;
  inverse?: boolean;
  invisible?: boolean;
}

export interface ListOptions extends BoxOptions {
  items?: string[];
  interactive?: boolean;
  selected?: number;
  itemFg?: Color;
  itemBg?: Color;
  selectedFg?: Color;
  selectedBg?: Color;
}

export interface TextareaOptions extends ElementOptions {
  value?: string;
  inputOnFocus?: boolean;
}

export interface InputOptions extends TextareaOptions {
  // Input은 Textarea를 상속하므로 동일한 옵션 사용
}

export interface ProgressBarOptions extends ElementOptions {
  orientation?: 'horizontal' | 'vertical';
  pch?: string;
  filled?: number;
  value?: number;
  maxValue?: number;
}

export interface ButtonOptions extends ElementOptions {
  mouse?: boolean;
  keys?: boolean;
  checked?: boolean;
}

export interface CheckboxOptions extends ButtonOptions {
  text?: string;
  checked?: boolean;
}

export interface RadioButtonOptions extends CheckboxOptions {
  // RadioButton은 Checkbox를 상속하므로 동일한 옵션 사용
}

export interface RadioSetOptions extends BoxOptions {
  items?: string[];
}

export interface TableOptions extends BoxOptions {
  rows?: string[][];
  data?: string[][];
  pad?: number;
  noCellBorders?: boolean;
  fillCellBorders?: boolean;
}

/**
 * 노드 클래스 인터페이스
 */
export interface Node extends EventEmitter {
  type: string;
  name: string;
  parent: Node | null;
  screen: Screen;
  children: Node[];
  data: any;
  index: number;
  position: Position;
  width: number | string;
  height: number | string;
  left: number | string;
  top: number | string;
  right: number | string;
  bottom: number | string;
  clickable: boolean;
  focusable: boolean;
  focused: boolean;
  hidden: boolean;
  visible: boolean;
  draggable: boolean;
  detached: boolean;
  fixed: boolean;
  destroyed: boolean;
  atop: boolean;
  style: Style;

  // Node의 기본 메서드
  prepend(node: Node): void;
  append(node: Node): void;
  remove(node: Node): void;
  insert(node: Node, i: number): void;
  insertBefore(node: Node, refNode: Node): void;
  insertAfter(node: Node, refNode: Node): void;
  detach(): void;
  free(): void;
  destroy(): void;
  forDescendants(iter: (node: Node) => boolean | void, s?: boolean): void;
  forAncestors(iter: (node: Node) => boolean | void): void;
  collectDescendants(test: (node: Node) => boolean): Node[];
  collectAncestors(test: (node: Node) => boolean): Node[];
  emitDescendants(type: string | symbol, ...args: any[]): void;
  get(name: string, recursive?: boolean): Node | undefined;
  set(name: string, node: Node): void;
  remove(name: string): void;
  insertBefore(node: Node, refNode: Node): void;
  insertAfter(node: Node, refNode: Node): void;
  getLastDescendant(): Node;
  hasDescendant(node: Node): boolean;
  hasAncestor(node: Node): boolean;
  focus(): void;
  blur(): void;
  setIndex(index: number): void;
  setFront(): void;
  setBack(): void;
  setLabel(args: any): void;
  removeLabel(): void;
  setHover(args: any): void;
  removeHover(): void;
  enableMouse(): void;
  disableMouse(): void;
}

/**
 * 화면 인터페이스 - 완전 정의
 */
export interface Screen extends EventEmitter {
  type: 'screen';
  program: any; // Program 타입을 추가할 경우 변경
  tput: any; // TPut 타입을 추가할 경우 변경

  // Screen에 추가되는 속성 및 메서드
  title: string;
  children: Node[];
  width: number;
  height: number;
  cols: number;
  rows: number;
  focused: Node | null; // 현재 포커스된 노드 또는 null
  cursor: {
    x: number;
    y: number;
    shape: string;
    color: string | null;
    blink: boolean;
  };
  data: any;
  fullUnicode: boolean;

  // Screen의 메서드
  alloc(): void;
  render(): void;
  realloc(): void;
  draw(start: number, end: number): void;
  clearRegion(xi: number, xl: number, yi: number, yl: number): void;
  fillRegion(attr: string, ch: string, xi: number, xl: number, yi: number, yl: number): void;
  focusNext(): boolean;
  focusPrevious(): boolean;
  focusPush(element: Node): void;
  focusPop(): void;
  saveFocus(): void;
  restoreFocus(): void;
  rewindFocus(): void;
  key(name: string | string[], listener: (ch: string, key: KeyboardEvent) => void): void;
  onceKey(name: string | string[], listener: (ch: string, key: KeyboardEvent) => void): void;
  unkey(name: string | string[], listener: (ch: string, key: KeyboardEvent) => void): void;
  spawn(file: string, args: string[], options: any): void;
  exec(file: string, args: string[], options: any, callback: (err: Error | null, data: string) => void): void;
  readEditor(options: any, callback: (err: Error | null, data: string) => void): void;
  setEffects(el: Element, fel: Element, over: boolean, out: boolean, effects: any, temp: any): void;
  lockKeys: boolean;
  leave(): void;
  destroy(): void;
  append(element: Node): void;
  prepend(element: Node): void;
  insert(element: Node, i: number): void;
  remove(element: Node): void;
  insertBefore(element: Node, other: Node): void;
  insertAfter(element: Node, other: Node): void;
}

/**
 * 요소 인터페이스
 */
export interface Element extends Node {
  position: Position;
  align: string;
  valign: string;
  content: string;
  hidden: boolean;
  border: Border;
  style: Style;

  render(): void;
  setContent(content: string): void;
  getContent(): string;
  getText(): string;
  setText(text: string): void;
  parseTags(text: string): string;
  setLine(i: number, line: string): void;
  getLine(i: number): string;
  getBaseLine(i: number): string;
  getScreenLine(i: number): string;
  insertLine(i: number, line: string): void;
  deleteLine(i: number): void;
  clearLine(i: number): void;
  clearPos(x: number, y: number): void;
  clearValue(): void;
  show(): void;
  hide(): void;
  toggle(): void;
  focus(): void;
  setFront(): void;
  setBack(): void;
  setLabel(options: any): void;
  move(dx: number, dy: number): void;
  moveX(dx: number): void;
  moveY(dy: number): void;
  enableMouse(): void;
  disableMouse(): void;
  enableKeys(): void;
  disableKeys(): void;
  enableInput(): void;
  disableInput(): void;
}

/**
 * 박스 인터페이스
 */
export interface Box extends Element {
  type: 'box';
  children: Element[];
}

/**
 * 텍스트 인터페이스
 */
export interface Text extends Element {
  type: 'text';
  content: string;
}

/**
 * 텍스트영역 인터페이스
 */
export interface Textarea extends Element {
  type: 'textarea';
  value: string;

  getValue(): string;
  setValue(text: string): void;
  submit(): void;
  cancel(): void;
  readInput(callback?: (err: Error | null, value: string | null) => void): void;
  readEditor(callback?: (err: Error | null, value: string | null) => void): void;
}

/**
 * 입력 인터페이스
 */
export interface Input extends Omit<Textarea, 'type'> {
  type: 'input';
}

/**
 * 리스트 인터페이스
 */
export interface List extends Element {
  type: 'list';
  items: string[];
  selected: number;
  interactive: boolean;

  setItems(items: string[]): void;
  add(item: string): void;
  addItem(item: string): void;
  removeItem(i: number): void;
  insertItem(i: number, item: string): void;
  getItem(i: number): string;
  setItem(i: number, item: string): void;
  clearItems(): void;
  select(i: number): void;
  move(offset: number): void;
  up(offset?: number): void;
  down(offset?: number): void;
}

/**
 * 프로그레스바 인터페이스
 */
export interface ProgressBar extends Element {
  type: 'progressbar';
  filled: number;
  value: number;
  pch: string;
  orientation: 'horizontal' | 'vertical';

  progress(amount: number): void;
  setProgress(amount: number): void;
  reset(): void;
}