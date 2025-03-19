/**
 * Left Panel Component
 * 왼쪽 패널 (메뉴 및 옵션)
 */

import blessed from 'blessed-extended';
import { layoutInfo } from '../constants/layout.js';

export interface LeftPanelComponents {
  panel: blessed.Widgets.BoxElement;
  menuList: blessed.Widgets.ListElement;
  selectMenuItem: (index: number) => void;
}

export const createLeftPanel = (screen: blessed.Widgets.Screen): LeftPanelComponents => {
  // 왼쪽 패널 컨테이너 생성
  const leftPanel = blessed.box({
    top: 0,
    left: 0,
    width: `${layoutInfo.leftPanel.width}%`,
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

  // 메뉴 제목
  const menuTitle = blessed.text({
    top: 0,
    left: 'center',
    content: '[ MENU ]',
    style: {
      fg: 'green',
      bold: true
    }
  });

  // 메뉴 리스트 생성
  const menuList = blessed.list({
    top: 2,
    left: 1,
    width: '100%-3',
    height: '50%-3',
    items: [
      'Dashboard',
      'Conversations',
      'Settings',
      'Help',
      'About'
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

  // 선택된 메뉴 항목의 설명
  const menuDescription = blessed.box({
    top: '50%+1',
    left: 1,
    width: '100%-3',
    height: '50%-3',
    label: ' Description ',
    content: 'Select a menu item to see description',
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      border: {
        fg: 'white'
      }
    }
  });

  // 메뉴 선택 이벤트 처리
  menuList.on('select', (_, index) => {
    selectMenuItem(index);
  });

  // 메뉴 항목 선택 함수
  const selectMenuItem = (index: number): void => {
    let desc = '';

    switch(index) {
      case 0:
        desc = 'Dashboard: Overview of your activity and status.';
        break;
      case 1:
        desc = 'Conversations: Manage your chat history and interactions.';
        break;
      case 2:
        desc = 'Settings: Configure application preferences.';
        break;
      case 3:
        desc = 'Help: View documentation and get assistance.';
        break;
      case 4:
        desc = 'About: Information about this application.';
        break;
      default:
        desc = 'No description available.';
    }

    menuDescription.setContent(desc);
    screen.render();
  };

  // 패널에 컴포넌트 추가
  leftPanel.append(menuTitle);
  leftPanel.append(menuList);
  leftPanel.append(menuDescription);

  return {
    panel: leftPanel,
    menuList,
    selectMenuItem
  };
};