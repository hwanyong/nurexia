/**
 * Scroll Box Widget Component
 * 스크롤 가능한 텍스트/콘텐츠 박스
 */

import blessed from 'blessed';

export interface ScrollBoxWidgetConfig {
  label?: string;
  width?: string | number;
  height?: string | number;
  border?: "line" | "bg" | blessed.Widgets.Border;
  style?: any;
  bottom?: number | string;
  top?: number | string;
  left?: number | string;
  right?: number | string;
  content?: string;
}

export const createScrollBoxWidget = (config: ScrollBoxWidgetConfig = {}): blessed.Widgets.BoxElement => {
  // 기본 설정과 사용자 설정 병합
  const finalConfig = {
    label: config.label || '',
    width: config.width || '100%',
    height: config.height || '100%',
    border: config.border || {
      type: 'line'
    },
    bottom: config.bottom,
    top: config.top,
    left: config.left,
    right: config.right,
    content: config.content || '',
    scrollable: true,
    alwaysScroll: true,
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
    },
    keys: true,
    mouse: true
  };

  // 박스 위젯 생성
  return blessed.box(finalConfig);
};

/**
 * 콘텐츠 추가 유틸리티 함수
 */
export const appendContent = (
  box: blessed.Widgets.BoxElement,
  content: string,
  screen?: blessed.Widgets.Screen
): void => {
  const currentContent = box.getContent() || '';
  box.setContent(`${currentContent}\n${content}`);

  // 자동으로 스크롤을 아래로 이동
  box.scrollTo(box.getScrollHeight());

  // 화면 다시 그리기 (screen이 제공된 경우)
  if (screen) {
    screen.render();
  }
};