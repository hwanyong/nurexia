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
   * 문자열의 표시 너비 계산
   */
  strWidth(str: string): number {
    if (!str) return 0;

    // 그래핌 기준 길이 계산
    const graphemes = splitter.splitGraphemes(str);

    // 문자별 너비 계산
    return graphemes.reduce((width, char) => {
      // 전각 문자(한자, 한글, 일본어 등) 판별
      if (/[\u1100-\u11FF\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3130-\u318F\u4E00-\u9FFF\uAC00-\uD7AF]/.test(char)) {
        return width + 2;  // 전각 문자는 너비 2
      }
      return width + 1;  // 기타 문자는 너비 1
    }, 0);
  },

  /**
   * 서로게이트 쌍 문자인지 확인
   */
  isSurrogate(str: string, index: number): boolean {
    return index > 0 &&
      index < str.length - 1 &&
      str.charCodeAt(index) >= 0xDC00 &&
      str.charCodeAt(index) <= 0xDFFF &&
      str.charCodeAt(index - 1) >= 0xD800 &&
      str.charCodeAt(index - 1) <= 0xDBFF;
  },

  /**
   * 결합 문자인지 확인
   */
  isCombining(str: string, index: number): boolean {
    if (index <= 0) return false;
    const code = str.charCodeAt(index);
    return (code >= 0x0300 && code <= 0x036F) ||  // 결합 발음 구별 기호
           (code >= 0x1AB0 && code <= 0x1AFF) ||  // 결합 발음 구별 기호 확장
           (code >= 0x1DC0 && code <= 0x1DFF) ||  // 결합 발음 구별 기호 보충
           (code >= 0x20D0 && code <= 0x20FF) ||  // 결합 발음 구별 기호(수식 기호용)
           (code >= 0xFE20 && code <= 0xFE2F);    // 반쪽 결합 기호
  }
};

// 색상 관련 유틸리티
const colors = {
  // 기본 16색
  black: 0,
  red: 1,
  green: 2,
  yellow: 3,
  blue: 4,
  magenta: 5,
  cyan: 6,
  white: 7,

  // 밝은 색
  brightBlack: 8,
  brightRed: 9,
  brightGreen: 10,
  brightYellow: 11,
  brightBlue: 12,
  brightMagenta: 13,
  brightCyan: 14,
  brightWhite: 15,

  /**
   * 16진수 형식의 색상을 RGB로 변환
   */
  hexToRGB(hex: string): { r: number, g: number, b: number } | null {
    if (!hex) return null;

    // 타입 보장을 위한 안전한 정규식 처리
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result || result.length < 4) return null;

    const r = parseInt(result[1]!, 16);
    const g = parseInt(result[2]!, 16);
    const b = parseInt(result[3]!, 16);

    return { r, g, b };
  },

  /**
   * 가장 가까운 xterm 256색 인덱스 찾기
   */
  match(r: number, g: number, b: number): number {
    // 간략화된 버전 - 실제 구현에서는 정교한 색 매칭 알고리즘 사용
    const colorTable: Array<[number, number, number]> = [
      // 기본 8색 (0-7)
      [0, 0, 0], [205, 0, 0], [0, 205, 0], [205, 205, 0],
      [0, 0, 238], [205, 0, 205], [0, 205, 205], [229, 229, 229],
      // 밝은 8색 (8-15)
      [127, 127, 127], [255, 0, 0], [0, 255, 0], [255, 255, 0],
      [92, 92, 255], [255, 0, 255], [0, 255, 255], [255, 255, 255]
    ];

    let minDistance = Infinity;
    let index = 0;

    // 가장 가까운 색 찾기
    for (let i = 0; i < colorTable.length; i++) {
      const colorEntry = colorTable[i];
      if (!colorEntry) continue;

      const cr = colorEntry[0];
      const cg = colorEntry[1];
      const cb = colorEntry[2];

      const distance = Math.sqrt(
        Math.pow(cr - r, 2) +
        Math.pow(cg - g, 2) +
        Math.pow(cb - b, 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        index = i;
      }
    }

    return index;
  }
};

// Factory 함수들
const widgets = {
  Node,
  Element,
  Textarea,
  Box,
  Text,
  List,

  // 생성 함수들
  createNode: (options: any) => new Node(options),
  createTextarea: (options: any) => new Textarea(options),
  createBox: (options: any) => new Box(options),
  createText: (options: any) => new Text(options),
  createList: (options: any) => new List(options)
};

// blessed-ts 라이브러리 버전
const version = '0.1.0';

// 메인 객체
const blessedTs = {
  // 프로그램 및 화면
  Program,
  Screen,
  program: new Program(),
  screen: (options: any) => new Screen(options),

  // 위젯 컴포넌트
  ...widgets,

  // 유틸리티
  unicode,
  colors,

  // 버전 정보
  version
};

// 기본 내보내기
export default blessedTs;