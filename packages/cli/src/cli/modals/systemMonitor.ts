/**
 * System Monitor Modal Component
 * 시스템 정보를 표시하는 모달 컴포넌트
 */

import blessed from 'blessed-extended';
import os from 'os';

export interface SystemMonitorComponents {
  modal: blessed.Widgets.BoxElement;
  visible: boolean;
  toggle: () => void;
  update: () => void;
}

export const createSystemMonitorModal = (screen: blessed.Widgets.Screen): SystemMonitorComponents => {
  // 모달 상태 관리
  let visible = false;
  let updateInterval: NodeJS.Timeout | null = null;

  // 모달 컨테이너 생성
  const modal = blessed.box({
    top: 'center',
    left: 'center',
    width: '50%',
    height: '70%',
    border: {
      type: 'line'
    },
    style: {
      border: {
        fg: 'blue'
      }
    },
    label: ' System Monitor ',
    hidden: true,
    tags: true
  });

  // 내용 컨테이너
  const content = blessed.box({
    top: 1,
    left: 1,
    width: '100%-2',
    height: '100%-4',
    scrollable: true,
    tags: true,
    mouse: true,
    keys: true,
    vi: true,
    alwaysScroll: true,
    scrollbar: {
      ch: ' ',
      style: {
        inverse: true
      },
      track: {
        bg: 'gray'
      }
    }
  });

  // 닫기 버튼
  const closeButton = blessed.button({
    bottom: 1,
    right: 1,
    width: 8,
    height: 1,
    content: 'Close',
    style: {
      bg: 'blue',
      fg: 'white',
      focus: {
        bg: 'red'
      }
    }
  });

  // 버튼 이벤트 연결
  closeButton.on('press', () => {
    toggle();
  });

  // 패널에 컴포넌트 추가
  modal.append(content);
  modal.append(closeButton);

  // ESC 키로 모달 닫기
  modal.key(['escape'], () => {
    toggle();
  });

  // 시스템 정보 업데이트 함수
  const update = (): void => {
    const cpuInfo = os.cpus();
    const memInfo = {
      total: os.totalmem(),
      free: os.freemem()
    };

    const memUsage = process.memoryUsage();
    const uptime = os.uptime();

    // 정보 포맷팅
    let info = '';
    info += `{bold}System Information{/bold}\n\n`;
    info += `Hostname: ${os.hostname()}\n`;
    info += `Platform: ${os.platform()} ${os.release()}\n`;
    info += `Architecture: ${os.arch()}\n`;
    info += `Uptime: ${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s\n\n`;

    info += `{bold}Memory{/bold}\n\n`;
    info += `Total: ${(memInfo.total / (1024 * 1024 * 1024)).toFixed(2)} GB\n`;
    info += `Free: ${(memInfo.free / (1024 * 1024 * 1024)).toFixed(2)} GB\n`;
    info += `Used: ${((memInfo.total - memInfo.free) / (1024 * 1024 * 1024)).toFixed(2)} GB\n`;
    info += `Usage: ${Math.round(((memInfo.total - memInfo.free) / memInfo.total) * 100)}%\n\n`;

    info += `{bold}Process Memory{/bold}\n\n`;
    info += `RSS: ${(memUsage.rss / (1024 * 1024)).toFixed(2)} MB\n`;
    info += `Heap Total: ${(memUsage.heapTotal / (1024 * 1024)).toFixed(2)} MB\n`;
    info += `Heap Used: ${(memUsage.heapUsed / (1024 * 1024)).toFixed(2)} MB\n`;
    info += `External: ${(memUsage.external / (1024 * 1024)).toFixed(2)} MB\n\n`;

    info += `{bold}CPU{/bold}\n\n`;
    info += `Cores: ${cpuInfo.length}\n`;
    info += `Model: ${cpuInfo[0].model}\n`;

    // 콘텐츠 업데이트
    content.setContent(info);
    screen.render();
  };

  // 토글 함수 (모달 표시/숨김)
  const toggle = (): void => {
    visible = !visible;
    modal.hidden = !visible;

    if (visible) {
      update();
      updateInterval = setInterval(update, 1000);
      closeButton.focus();
    } else {
      if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
      }
    }

    screen.render();
  };

  return {
    modal,
    visible,
    toggle,
    update
  };
};