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
}

/**
 * 위치 및 크기 정의
 */
export type Position = number | string | 'center';

/**
 * 노드 타입
 */
export type NodeType = 'node' | 'element' | 'screen' | 'box' | 'text' | 'list' | 'form' | 'input' | 'textarea';

/**
 * 기본 위젯 옵션 인터페이스
 */
export interface NodeOptions {
  screen?: any;
  parent?: any;
  type?: NodeType;
  style?: Style;
  height?: Position;
  width?: Position;
  top?: Position;
  left?: Position;
  right?: Position;
  bottom?: Position;
  shrink?: boolean;
  scrollable?: boolean;
  mouse?: boolean;
  keys?: boolean;
  focused?: boolean;
  hidden?: boolean;
  tags?: boolean;
  draggable?: boolean;
}