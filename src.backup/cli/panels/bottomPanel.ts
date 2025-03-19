/**
 * Bottom Panel Component
 * 하단의 상태바 및 기타 정보를 표시하는 패널
 */

import blessed from 'blessed';
import { layoutInfo } from '../constants/layout.js';

export interface BottomPanelComponent {
  panel: blessed.Widgets.BoxElement;
  updateStatus: (content: string) => void;
}

export const createBottomPanel = (screen: blessed.Widgets.Screen): BottomPanelComponent => {
  // 바텀 패널 생성 (기존 상태바에서 확장)
  const bottomPanel = blessed.box({
    bottom: 0,
    left: 0,
    width: '100%',
    height: parseInt(`${layoutInfo.bottomPanel.height}${layoutInfo.bottomPanel.heightUnit}`),
    content: 'Nurexia CLI - Ready',
    style: {
      bg: 'white',
      fg: 'black'
    }
  });

  // 상태 업데이트 함수
  const updateStatus = (content: string) => {
    bottomPanel.setContent(content);
    screen.render();
  };

  return {
    panel: bottomPanel,
    updateStatus
  };
};