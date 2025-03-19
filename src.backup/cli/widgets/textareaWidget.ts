/**
 * Textarea Widget Component
 * 멀티라인 텍스트 입력을 위한 컴포넌트
 */

import blessed from 'blessed';
import GraphemeSplitter from 'grapheme-splitter';

// 그래핌 분할기 인스턴스 생성
const splitter = new GraphemeSplitter();

export interface TextareaWidgetConfig {
  label?: string;
  width?: string | number;
  height?: string | number;
  border?: "line" | "bg" | blessed.Widgets.Border;
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
  widget: blessed.Widgets.TextareaElement;
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
  const textarea = blessed.textarea(finalConfig);

  // IME 입력 처리를 위한 패치
  // @ts-ignore - '_listener' 메소드는 blessed 내부 메소드이지만 TypeScript 타입에는 없음
  const originalListener = textarea._listener;
  if (originalListener) {
    // @ts-ignore
    textarea._listener = function(ch, key) {
      // 다국어 조합 중인 문자 처리 로직
      if (ch && this.screen.fullUnicode) {
        if (key.name === 'backspace') {
          // 백스페이스 처리 개선: 마지막 그래핌(완성된 글자 단위) 삭제
          if (this.value.length) {
            const graphemes = splitter.splitGraphemes(this.value);
            if (graphemes.length > 0) {
              // 마지막 그래핌 제거
              graphemes.pop();
              this.value = graphemes.join('');
              this.screen.render();
            }
          }
        } else {
          // 조합형 문자(한글 등) 처리 개선
          if (!/^[\x00-\x08\x0b-\x0c\x0e-\x1f\x7f]$/.test(ch)) {
            this.value += ch;
            this.screen.render();
          }
        }
      } else {
        // 기존 로직 실행
        originalListener.call(this, ch, key);
      }
    };
  }

  // blessed의 getValue 메소드 오버라이드
  const originalGetValue = textarea.getValue;
  textarea.getValue = function() {
    const value = originalGetValue.call(this);
    // 다국어 문자가 포함된 경우 그래핌 단위로 처리하여 정확한 문자열 반환
    if (this.screen.fullUnicode && value) {
      return splitter.splitGraphemes(value).join('');
    }
    return value;
  };

  // 높이 업데이트 함수
  const updateHeight = (newHeight?: number, screen?: blessed.Widgets.Screen) => {
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
  textarea: blessed.Widgets.TextareaElement,
  updateHeight: (newHeight?: number) => void,
  screen: blessed.Widgets.Screen,
  adjacentElement?: blessed.Widgets.BoxElement
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