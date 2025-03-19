/**
 * Main Panel Component
 * - Agent Conversation Box
 * - Text Input Box
 */

import blessed from 'blessed-extended';
import { layoutInfo, textBoxConfig } from '../constants/layout.js';
import { createScrollBoxWidget } from '../widgets/scrollBoxWidget.js';
import { createTextareaWidget, setupTextareaAutoResize } from '../widgets/textareaWidget.js';

export interface MainPanelComponents {
  panel: blessed.Widgets.BoxElement;
  agentBox: blessed.Widgets.BoxElement;
  textBox: blessed.Widgets.TextareaElement;
  updateTextBoxHeight: (newHeight?: number) => void;
}

export const createMainPanel = (screen: blessed.Widgets.Screen): MainPanelComponents => {
  // 메인 패널 컨테이너 생성
  const mainPanel = blessed.box({
    top: 0,
    left: `${layoutInfo.leftPanel.width}%`,
    width: `${100 - layoutInfo.leftPanel.width - layoutInfo.rightPanel.width + 1}%`,
    height: `100%-${layoutInfo.bottomPanel.height}`
  });

  // 대화 표시 박스 생성 (스크롤 가능)
  const mainAgentBox = createScrollBoxWidget({
    top: 0,
    left: 0,
    width: '100%-1', // 좌우 테두리 고려
    height: `100%-${textBoxConfig.initialHeight}`,
    label: ' Conversation '
  });

  // 텍스트 입력 위젯 생성
  const textAreaResult = createTextareaWidget({
    bottom: 0,
    left: 0,
    width: '100%-1',
    label: ' Prompt '
  }, textBoxConfig);

  // 텍스트 영역에 자동 리사이징 설정
  setupTextareaAutoResize(textAreaResult.widget, textAreaResult.updateHeight, screen, mainAgentBox);

  // 패널에 컴포넌트 추가
  mainPanel.append(mainAgentBox);
  mainPanel.append(textAreaResult.widget);

  return {
    panel: mainPanel,
    agentBox: mainAgentBox,
    textBox: textAreaResult.widget,
    updateTextBoxHeight: textAreaResult.updateHeight
  };
};