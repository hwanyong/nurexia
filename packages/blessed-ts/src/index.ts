/**
 * blessed-ts
 * TypeScript 기반 터미널 UI 라이브러리 with 향상된 다국어 지원
 */

// 핵심 타입 정의 내보내기
export * from './core/types';

// 프로그램/터미널 제어 관련
import { Program } from './program/program';

// 핵심 위젯들
import { Node } from './widgets/node';
import { Element } from './widgets/element';
import { Textarea } from './widgets/textarea';
import { Box } from './widgets/box';
import { Text } from './widgets/text';
import { List } from './widgets/list';
import { Screen } from './widgets/screen';

// 그래핌 분할기 - 한글 등 다국어 지원에 필요
import GraphemeSplitter from 'grapheme-splitter';
const splitter = new GraphemeSplitter();

// Unicode 관련 유틸리티
const unicode = {
  /**
   * 문자열을 그래핌 단위로 분할
   */
  splitGraphemes(str: string): string[] {
    return splitter.splitGraphemes(str);
  },

  /**
   * 문자열의 그래핌 단위 길이 계산
   */
  graphemeLength(str: string): number {
    return splitter.splitGraphemes(str).length;
  },

  /**
   * Unicode 문자의 디스플레이 너비 계산
   * East Asian Width (EAW) 특성 고려
   */
  charWidth(ch: string): number {
    // 구현 필요: East Asian Width 계산
    return 1;
  },

  /**
   * 문자열의 전체 디스플레이 너비 계산
   */
  strWidth(str: string): number {
    let width = 0;
    const graphemes = splitter.splitGraphemes(str);

    for (const g of graphemes) {
      width += this.charWidth(g);
    }

    return width;
  }
};

// 메인 모듈 내보내기
export default {
  Program,
  Node,
  Element,
  Screen,
  Box,
  Text,
  List,
  Textarea,
  unicode
};