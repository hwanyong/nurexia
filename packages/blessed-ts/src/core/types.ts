/**
 * blessed-ts - 핵심 타입 정의
 */

import { EventEmitter } from 'events';
import { Program } from '../program/program';

/**
 * 색상 정의
 */
export type Color = string | number;

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

// Screen 인터페이스 미리 선언 (순환 참조 해결)
export interface Screen extends EventEmitter {
  type: string;
  program: Program;
  fullUnicode: boolean;
  width: number;
  height: number;
  title: string;
  focused: Node | null;
  children: Node[];

  // 메서드 일부 정의
  render(): void;
  key(name: string | string[], listener: (ch: string, key: KeyboardEvent) => void): void;
  append(element: Node): void;
  remove(element: Node): void;
  _listenKeys(el: Node): void;
}

/**
 * 노드 인터페이스 - 모든 화면 요소의 기반
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

  // 메서드
  prepend(node: Node): void;
  append(node: Node): void;
  remove(node: Node): void;
  insert(node: Node, i: number): void;
  insertBefore(node: Node, refNode: Node): void;
  insertAfter(node: Node, refNode: Node): void;
  detach(): void;
  free(): void;
  destroy(): void;
  focus(): void;
  blur(): void;
  enableMouse(): void;
  disableMouse(): void;

  // 포지션 계산
  lpos?: Position;
  _getCoords(): Position | undefined;
}

/**
 * 요소 인터페이스 - 화면에 표시되는 기본 요소
 */
export interface Element extends Node {
  align: string;
  valign: string;
  content: string;
  border: Border;
  padding: { left: number; right: number; top: number; bottom: number };
  label: string;

  // 렌더링 옵션
  scrollable: boolean;
  tags: boolean;
  wrap: boolean;
  ch: string;
  mouse: boolean;
  keys: boolean | string[];
  vi: boolean;
  alwaysScroll: boolean;
  scrollbar: ScrollbarOptions | boolean;

  // 내부 속성
  _clines: string[];
  childBase: number;
  childOffset: number;
  iheight: number;
  iwidth: number;
  itop: number;
  ileft: number;

  // 메서드
  render(): void;
  setContent(content: string): void;
  getContent(): string;
  getValue?(): string;
  setValue?(value: string): void;
  strWidth(text: string): number;
  scrollTo(offset: number): void;
}

/**
 * 박스 인터페이스 - 기본 박스 요소
 */
export interface Box extends Element {
  type: 'box';
}

/**
 * 텍스트 인터페이스 - 텍스트 표시 요소
 */
export interface Text extends Element {
  type: 'text';
}

/**
 * 텍스트영역 인터페이스 - 다중 라인 입력 요소
 */
export interface Textarea extends Element {
  type: 'textarea';
  value: string;
  options: ElementOptions;

  getValue(): string;
  setValue(text: string): void;
  submit(): void;
  cancel(): void;
  readInput(callback?: (err: Error | null, value: string | null) => void): void;
  readEditor(callback?: (err: Error | null, value: string | null) => void): void;
}