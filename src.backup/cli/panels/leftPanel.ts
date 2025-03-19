/**
 * Left Panel Component
 * - Tree Panel (File Explorer)
 * - Context Panel
 */

import blessed from 'blessed';
import { layoutInfo } from '../constants/layout.js';
import { createTreeWidget, setupTreeWidgetEvents, loadSampleTreeData } from '../widgets/treeWidget.js';
import { createScrollBoxWidget } from '../widgets/scrollBoxWidget.js';

export interface LeftPanelComponents {
  panel: blessed.Widgets.BoxElement;
  treePanel: any; // blessedContrib.Widgets.TreeElement;
  contextPanel: blessed.Widgets.BoxElement;
}

export const createLeftPanel = (screen: blessed.Widgets.Screen): LeftPanelComponents => {
  // 왼쪽 패널 컨테이너 생성
  const leftPanel = blessed.box({
    top: 0,
    left: 0,
    width: `${layoutInfo.leftPanel.width}${layoutInfo.leftPanel.widthUnit}`,
    height: `100%-${layoutInfo.bottomPanel.height}`
  });

  // 트리 위젯 생성 (파일 탐색기)
  const treePanel = createTreeWidget({
    label: ' Files ',
    height: '75%'
  });

  // 트리 이벤트 설정
  setupTreeWidgetEvents(treePanel, screen, {
    onSelect: (_node) => {
      // 사용자 정의 선택 이벤트 처리 (언더스코어로 시작하는 변수명은 사용하지 않음을 의미)
    }
  });

  // 트리에 샘플 데이터 로드
  loadSampleTreeData(treePanel);

  // 스크롤 가능한 컨텍스트 패널 생성
  const contextPanel = createScrollBoxWidget({
    top: '75%',
    height: '27%',
    label: ' Context '
  });

  // 패널에 컴포넌트 추가
  leftPanel.append(treePanel);
  leftPanel.append(contextPanel);

  return {
    panel: leftPanel,
    treePanel,
    contextPanel
  };
};