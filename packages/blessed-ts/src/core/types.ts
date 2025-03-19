/**
 * blessed-ts - Core Types
 * 핵심 타입과 인터페이스 정의
 */

// types/index.ts 의 타입들 재내보내기
export * from '../types/index';

/**
 * 이벤트 이름 타입
 */
export type EventName = string | symbol;

/**
 * 키 이벤트 타입
 */
export interface KeyEvent {
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  sequence: string;
  raw: string;
}

/**
 * 마우스 이벤트 타입
 */
export interface MouseEvent {
  x: number;
  y: number;
  button: 'left' | 'middle' | 'right' | 'unknown';
  action: 'mousedown' | 'mouseup' | 'mousemove' | 'wheel';
  shift: boolean;
  meta: boolean;
  ctrl: boolean;
}

/**
 * 프로그램 옵션
 */
export interface ProgramOptions {
  input?: NodeJS.ReadableStream;
  output?: NodeJS.WritableStream;
  terminal?: boolean;
  buffer?: boolean;
  zero?: boolean;
  tput?: boolean;
  tputTerminal?: string;
  useGlobal?: boolean;
  forceUnicode?: boolean;
  enableMouse?: boolean;
}

/**
 * 스크린 옵션
 */
export interface ScreenOptions {
  program?: any;
  autoPadding?: boolean;
  smartCSR?: boolean;
  fastCSR?: boolean;
  title?: string;
  tabSize?: number;
  fullUnicode?: boolean;
  dockBorders?: boolean;
  cursor?: boolean | 'line' | 'block' | 'underline';
  debug?: boolean;
  ignoreLocked?: boolean;
  resizeTimeout?: number;
  forceUnicode?: boolean;
  warnings?: boolean;
}