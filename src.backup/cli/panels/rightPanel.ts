/**
 * Right Panel Component
 * - Task Panel
 * - Agent Map Panel
 */

import blessed from 'blessed';
import { layoutInfo } from '../constants/layout.js';
import { createScrollBoxWidget } from '../widgets/scrollBoxWidget.js';

export interface RightPanelComponents {
  panel: blessed.Widgets.BoxElement;
  taskPanel: blessed.Widgets.BoxElement;
  agentMapPanel: blessed.Widgets.BoxElement;
}

export const createRightPanel = (_screen: blessed.Widgets.Screen): RightPanelComponents => {
  // 오른쪽 패널 컨테이너 생성
  const rightPanel = blessed.box({
    top: 0,
    right: 0,
    width: `${layoutInfo.rightPanel.width}${layoutInfo.rightPanel.widthUnit}`,
    height: `100%-${layoutInfo.bottomPanel.height}`
  });

  // 작업 패널 생성 (스크롤 가능)
  const taskPanel = createScrollBoxWidget({
    top: 0,
    left: 0,
    width: '100%',
    height: '50%',
    label: ' Task Panel '
  });

  // 에이전트 맵 패널 생성
  const agentMapPanel = createScrollBoxWidget({
    top: '50%',
    left: 0,
    width: '100%',
    height: '52%',
    label: ' Agent Map '
  });

  // 패널에 컴포넌트 추가
  rightPanel.append(taskPanel);
  rightPanel.append(agentMapPanel);

  return {
    panel: rightPanel,
    taskPanel,
    agentMapPanel
  };
};