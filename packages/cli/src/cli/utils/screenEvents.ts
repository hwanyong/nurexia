/**
 * Screen Events Utility
 * 스크린 관련 이벤트 설정
 */

import blessed from 'blessed-extended';

export interface ScreenEventHandlers {
  onExit: () => void;
  onSystemMonitorToggle: () => void;
}

export const setupScreenEvents = (
  screen: blessed.Widgets.Screen,
  handlers: ScreenEventHandlers
): void => {
  // 종료 이벤트 (Ctrl+C or Escape)
  screen.key(['C-c', 'escape'], () => {
    handlers.onExit();
  });

  // 시스템 모니터 토글 (F5)
  screen.key(['f5'], () => {
    handlers.onSystemMonitorToggle();
  });

  // 화면 다시 그리기 이벤트 (Ctrl+R)
  screen.key(['C-r'], () => {
    screen.render();
  });

  // 화면 크기 조정 이벤트
  screen.on('resize', () => {
    screen.render();
  });

  // 반응형 레이아웃을 위한 이벤트 리스너 설정
  process.on('SIGWINCH', () => {
    screen.emit('resize');
  });
};