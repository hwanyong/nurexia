/**
 * blessed-ts 타입 정의
 * 다국어 입력 및 터미널 UI를 위한 라이브러리
 */

import * as types from './types';

// 타입 재내보내기
export * from './types';

// 클래스 및 함수
export class Node implements types.Node {}
export class Element extends Node implements types.Element {}
export class Textarea extends Element implements types.Textarea {}

// 기본 내보내기 타입
declare const blessedTs: {
  program: (options?: any) => any;
  screen: (options?: any) => types.Screen;

  // 위젯 클래스들
  Node: typeof Node;
  Element: typeof Element;
  Textarea: typeof Textarea;

  // 유틸리티
  unicode: {
    splitGraphemes(str: string): string[];
    strWidth(str: string): number;
    isSurrogate(str: string, index: number): boolean;
  };

  // 버전 정보
  version: string;
};

export default blessedTs;