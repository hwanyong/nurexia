/**
 * Bottom Panel Component
 * 상태 표시 및 키 도움말을 위한 하단 패널
 */

import blessed from 'blessed-extended';
import { layoutInfo } from '../constants/layout.js';

export interface BottomPanelComponents {
  panel: blessed.Widgets.BoxElement;
  statusText: blessed.Widgets.TextElement;
  updateStatus: (text: string) => void;
}

export const createBottomPanel = (screen: blessed.Widgets.Screen): BottomPanelComponents => {
  // 하단 패널 컨테이너 생성
  const bottomPanel = blessed.box({
    bottom: 0,
    left: 0,
    width: '100%',
    height: layoutInfo.bottomPanel.height,
    style: {
      bg: 'blue'
    }
  });

  // 상태 표시 텍스트 생성
  const statusText = blessed.text({
    top: 0,
    left: 1,
    content: 'Ready',
    style: {
      fg: 'white',
      bold: true
    }
  });

  // 키 도움말 텍스트 생성
  const keyHelpText = blessed.text({
    top: 0,
    right: 1,
    content: 'Ctrl+C: Exit | F1: Help | F5: Toggle Monitor',
    style: {
      fg: 'white'
    }
  });

  // 패널에 컴포넌트 추가
  bottomPanel.append(statusText);
  bottomPanel.append(keyHelpText);

  // 상태 업데이트 헬퍼 함수
  const updateStatus = (text: string): void => {
    statusText.setContent(text);
    screen.render();
  };

  return {
    panel: bottomPanel,
    statusText,
    updateStatus
  };
};