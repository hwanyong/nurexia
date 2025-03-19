#!/usr/bin/env node

/**
 * Nurexia CLI - Command Line Interface
 * 모듈화된 구조로 리팩토링된 메인 진입점
 */

import blessed from 'blessed-ts';
import { createLeftPanel } from './panels/leftPanel.js';
import { createMainPanel } from './panels/mainPanel.js';
import { createRightPanel } from './panels/rightPanel.js';
import { createBottomPanel } from './panels/bottomPanel.js';
import { createSystemMonitorModal } from './modals/systemMonitor.js';
import { setupScreenEvents } from './utils/screenEvents.js';

/**
 * CLI 진입점
 */
const main = async (): Promise<void> => {
  try {
    // 메인 스크린 생성
    const screen = blessed.screen({
      smartCSR: true,
      cursor: {
        artificial: true,
        shape: 'block',
        color: 'green',
        blink: true,
      },
      fullUnicode: true,
      debug: true
    });

    screen.title = 'Nurexia CLI';

    // UI 컴포넌트 생성
    const leftPanelComponents = createLeftPanel(screen);
    const mainPanelComponents = createMainPanel(screen);
    const rightPanelComponents = createRightPanel(screen);
    const bottomPanelComponent = createBottomPanel(screen);
    const systemMonitor = createSystemMonitorModal(screen);

    // 모든 컴포넌트를 스크린에 추가 (중앙 집중식 화면 관리)
    screen.append(leftPanelComponents.panel);
    screen.append(mainPanelComponents.panel);
    screen.append(rightPanelComponents.panel);
    screen.append(bottomPanelComponent.panel);
    screen.append(systemMonitor.modal);

    // 바텀 패널 초기 상태 설정
    bottomPanelComponent.updateStatus('Nurexia CLI - Ready');

    // 이벤트 핸들러 설정
    setupScreenEvents(screen, {
      onExit: () => {
        // 종료 전에 필요한 정리 작업 수행 가능
        process.exit(0);
      },
      onSystemMonitorToggle: systemMonitor.toggle
    });

    // 초기 렌더링
    screen.render();

    // 텍스트 박스에 초기 포커스 설정
    mainPanelComponents.textBox.focus();

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

// CLI 실행
main().catch((error) => {
  console.error('Unhandled Error:', error);
  process.exit(1);
});