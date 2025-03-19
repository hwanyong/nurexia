/**
 * Scrollable Box Widget Component
 * 스크롤 가능한 박스 컴포넌트
 */

import blessed from 'blessed-extended';

export interface ScrollBoxWidgetConfig {
  top?: number | string;
  left?: number | string;
  width?: string | number;
  height?: string | number;
  label?: string;
  border?: "line" | "bg" | blessed.Widgets.Border;
  style?: any;
}

export const createScrollBoxWidget = (config: ScrollBoxWidgetConfig = {}): blessed.Widgets.BoxElement => {
  // 기본 설정과 사용자 설정 병합
  const finalConfig = {
    label: config.label || ' Box ',
    top: config.top,
    left: config.left,
    width: config.width || '100%',
    height: config.height || '100%',
    border: config.border || {
      type: 'line'
    },
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
      ch: ' ',
      track: {
        bg: 'gray'
      },
      style: {
        inverse: true
      }
    },
    mouse: true,
    keys: true,
    vi: true,
    style: config.style || {
      scrollbar: {
        bg: 'blue'
      },
      border: {
        fg: 'white'
      },
      focus: {
        border: {
          fg: 'green'
        }
      }
    }
  };

  // 스크롤 박스 생성
  return blessed.box(finalConfig);
};