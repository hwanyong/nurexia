/**
 * Right Panel Component
 * 오른쪽 패널 (상태 및 정보)
 */

import blessed from 'blessed-extended';
import { layoutInfo } from '../constants/layout.js';

export interface RightPanelComponents {
  panel: blessed.Widgets.BoxElement;
  infoBox: blessed.Widgets.BoxElement;
  updateInfo: (text: string) => void;
}

export const createRightPanel = (screen: blessed.Widgets.Screen): RightPanelComponents => {
  // 오른쪽 패널 컨테이너 생성
  const rightPanel = blessed.box({
    top: 0,
    right: 0,
    width: `${layoutInfo.rightPanel.width}%`,
    height: `100%-${layoutInfo.bottomPanel.height}`,
    border: {
      type: 'line'
    },
    style: {
      border: {
        fg: 'white'
      }
    }
  });

  // 정보 제목
  const infoTitle = blessed.text({
    top: 0,
    left: 'center',
    content: '[ INFO ]',
    style: {
      fg: 'green',
      bold: true
    }
  });

  // 정보 박스
  const infoBox = blessed.box({
    top: 2,
    left: 1,
    width: '100%-3',
    height: '60%-3',
    content: 'Welcome to Nurexia CLI',
    border: {
      type: 'line'
    },
    padding: 1,
    style: {
      fg: 'white',
      border: {
        fg: 'white'
      }
    }
  });

  // 퀵 액션 리스트
  const quickActions = blessed.list({
    top: '60%+1',
    left: 1,
    width: '100%-3',
    height: '40%-3',
    label: ' Quick Actions ',
    items: [
      'New Conversation',
      'Import Data',
      'Export Results',
      'Clear All'
    ],
    style: {
      selected: {
        fg: 'black',
        bg: 'green'
      },
      item: {
        fg: 'white'
      }
    },
    keys: true,
    mouse: true,
    border: {
      type: 'line'
    }
  });

  // 퀵 액션 이벤트 처리
  quickActions.on('select', (item: any, index: number) => {
    // 여기에 액션 처리 로직 추가
    infoBox.setContent(`Selected action: ${item.content}`);
    screen.render();
  });

  // 정보 업데이트 헬퍼 함수
  const updateInfo = (text: string): void => {
    infoBox.setContent(text);
    screen.render();
  };

  // 패널에 컴포넌트 추가
  rightPanel.append(infoTitle);
  rightPanel.append(infoBox);
  rightPanel.append(quickActions);

  return {
    panel: rightPanel,
    infoBox,
    updateInfo
  };
};