/**
 * Textarea Widget Component
 * 멀티라인 텍스트 입력을 위한 컴포넌트
 */

import blessed from 'blessed-ts';
import GraphemeSplitter from 'grapheme-splitter';

// 그래핌 분할기 인스턴스 생성
const splitter = new GraphemeSplitter();

export interface TextareaWidgetConfig {
  label?: string;
  width?: string | number;
  height?: string | number;
  border?: "line" | "bg" | blessed.Border;
  style?: any;
  bottom?: number | string;
  top?: number | string;
  left?: number | string;
  right?: number | string;
}

export interface TextareaHeightConfig {
  initialHeight: number;
  minHeight: number;
  maxHeight: number;
}

export const createTextareaWidget = (
  config: TextareaWidgetConfig = {},
  heightConfig: TextareaHeightConfig = { initialHeight: 3, minHeight: 3, maxHeight: 25 }
): {
  widget: blessed.Textarea;
  currentHeight: number;
  updateHeight: (newHeight?: number) => void;
} => {
  // 기본 설정과 사용자 설정 병합
  const finalConfig = {
    label: config.label || ' Input ',
    width: config.width || '100%',
    height: heightConfig.initialHeight,
    border: config.border || {
      type: 'line'
    },
    bottom: config.bottom,
    top: config.top,
    left: config.left,
    right: config.right,
    inputOnFocus: true,
    keys: true,
    mouse: true,
    vi: false,
    scrollable: true,
    alwaysScroll: true,
    fullUnicode: true, // 다국어 지원을 위한 유니코드 활성화
    scrollbar: {
      style: {
        bg: 'white'
      },
      track: {
        bg: 'gray'
      }
    },
    style: config.style || {
      border: {
        type: 'line',
        fg: 'white'
      },
      focus: {
        border: {
          type: 'line',
          fg: 'green'
        }
      }
    }
  };

  // 현재 높이 상태 관리
  let currentHeight = heightConfig.initialHeight;

  // 텍스트 입력 위젯 생성
  const textarea = blessed.createTextarea(finalConfig);

  // 높이 업데이트 함수
  const updateHeight = (newHeight?: number, screen?: blessed.Screen) => {
    if (newHeight === undefined) {
      // 내용을 기반으로 높이 계산 (그래핌 고려)
      const text = textarea.getValue();
      // 줄바꿈 기준으로 라인 수 계산
      const lineCount = text.split('\n').length;
      newHeight = Math.min(lineCount + 2, heightConfig.maxHeight);
      newHeight = Math.max(newHeight, heightConfig.minHeight);
    }

    // 높이가 변경된 경우에만 업데이트
    if (newHeight === currentHeight) {
      return;
    }

    currentHeight = newHeight;
    textarea.height = newHeight;

    // 스크롤 위치 조정
    const lineCount = textarea.getValue().split('\n').length;
    textarea.scrollTo(lineCount);

    // 화면 다시 그리기 (screen이 제공되면)
    if (screen) {
      screen.emit('resize');
      screen.render();
    }

    return currentHeight;
  };

  return {
    widget: textarea,
    currentHeight,
    updateHeight
  };
};

/**
 * 텍스트 영역 위젯에 자동 높이 조정 이벤트 추가
 */
export const setupTextareaAutoResize = (
  textarea: blessed.Textarea,
  updateHeight: (newHeight?: number) => void,
  screen: blessed.Screen,
  adjacentElement?: blessed.Element
): void => {
  textarea.on('keypress', () => {
    // 텍스트 내용에 따라 높이 업데이트
    const newHeight = updateHeight(undefined);

    // 인접 요소가 있다면 그 높이도 조정
    if (adjacentElement && newHeight !== undefined) {
      adjacentElement.height = `100%-${newHeight}`;
    }

    // 화면 다시 그리기
    screen.emit('resize');
    screen.render();
  });
};