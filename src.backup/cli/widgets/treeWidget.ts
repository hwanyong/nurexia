/**
 * Tree Widget Component
 * 파일 탐색기 등에 사용되는 트리 구조 위젯
 */

import blessedContrib from 'blessed-contrib';
import blessed from 'blessed';

export interface TreeWidgetConfig {
  label?: string;
  width?: string | number;
  height?: string | number;
  border?: "line" | "bg" | blessed.Widgets.Border;
}

export const createTreeWidget = (config: TreeWidgetConfig = {}): blessedContrib.Widgets.TreeElement => {
  // 기본 설정과 사용자 설정 병합
  const finalConfig = {
    label: config.label || ' Files ',
    width: config.width || '100%',
    height: config.height || '100%',
    border: config.border || {
      type: 'line'
    },
    lineWidth: 1,
    line: true,
    inputOnFocus: true,
    mouse: true,
    style: {
      selected: {
        bg: 'white',
        fg: 'green'
      },
      item: {
        hover: {
          bg: 'white',
          fg: 'green'
        }
      }
    },
    scrollable: true
  };

  // 트리 위젯 생성
  return blessedContrib.tree(finalConfig);
};

/**
 * 트리 위젯에 이벤트 핸들러를 설정
 */
export const setupTreeWidgetEvents = (
  tree: blessedContrib.Widgets.TreeElement,
  screen: blessed.Widgets.Screen,
  callbacks: {
    onSelect?: (node: any) => void
  } = {}
): void => {
  tree.on('select', (node) => {
    // 기본 디버그 로깅
    if (node.myCustomProperty) {
      screen.debug(`Selected node: ${node.name} (custom property: ${node.myCustomProperty})`);
    }
    screen.debug(`Selected node: ${node.name}`);

    // 사용자 정의 콜백이 있으면 실행
    if (callbacks.onSelect) {
      callbacks.onSelect(node);
    }
  });
};

/**
 * 기본 파일 트리 데이터 로드 (예시용)
 */
export const loadSampleTreeData = (treePanel: blessedContrib.Widgets.TreeElement): void => {
  treePanel.setData({
    name: '/code_agent',
    extended: true,
    children: {
      'src': {
        name: 'src',
        children: {
          'main.js': {
            name: 'main.js'
          },
          'helpers': {
            name: 'helpers',
            extended: false,
            children: {
              'utils.js': {
                name: 'utils.js'
              },
              'validation.js': {
                name: 'validation.js'
              }
            }
          }
        }
      },
      'tests': {
        name: 'tests',
        children: {
          'test_main.js': {
            name: 'test_main.js'
          }
        }
      },
      'package.json': {
        name: 'package.json'
      }
    }
  });
};