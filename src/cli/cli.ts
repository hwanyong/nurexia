#!/usr/bin/env node

/**
 * Nurexia CLI - Command Line Interface
 */

import blessed from 'blessed';
import blessedContrib from 'blessed-contrib';
// import enquirer from 'enquirer';

const layoutInfo = {
  leftPanel: {
    width: 15,
    widthUnit: '%'
  },
  rightPanel: {
    width: 18,
    widthUnit: '%'
  },
  statusBar: {
    height: 1,
    heightUnit: ''
  }
};

const screen = blessed.screen({
  smartCSR: true,
  cursor: {
    artificial: true,
    shape: 'block',
    color: 'green',
    blink: true,
  },
  debug: true
});

//#region Event Handlers
// Configure screen event handlers
const setupScreenEvents = (screen: blessed.Widgets.Screen): void => {
  // Quit on Escape, q, or Control-C.
  screen.key(['C-c'], () => {
    process.exit(0);
  });

  // F10 key toggles the system monitor modal
  screen.key(['f10'], () => {
    toggleSystemMonitorModal();
  });
};
//#endregion Event Handlers

// Create a modal version of the system monitor that can be toggled
const systemMonitorModal = blessedContrib.line({
  top: 'center',
  left: 'center',
  width: 50,
  height: 15,
  border: {
    type: 'line'
  },
  style: {
    line: "yellow",
    text: "green",
    baseline: "black"
  },
  label: ' System Monitor ',
  xLabelPadding: 3,
  xPadding: 5,
  showLegend: true,
  wholeNumbersOnly: false,
  // Make the modal draggable
  draggable: true,
  hidden: true // Hidden by default
});

//#region System Monitor dummy data
const systemMonitorData = [{
  title: 'CPU Usage',
  x: ['t1', 't2', 't3', 't4'],
  y: [5, 1, 7, 5],
  style: {
    line: 'red'
  }
}, {
  title: 'Memory Usage',
  x: ['t1', 't2', 't3', 't4'],
  y: [2, 4, 9, 8],
  style: { line: 'yellow' }
}, {
  title: 'Disk Usage',
  x: ['t1', 't2', 't3', 't4'],
  y: [22, 7, 12, 1],
  style: { line: 'blue' }
}]
//#endregion System Monitor dummy data

// Function to toggle the system monitor modal
const toggleSystemMonitorModal = () => {
  // Toggle visibility
  systemMonitorModal.hidden = !systemMonitorModal.hidden;

  // When shown, bring to front and set the latest data
  if (!systemMonitorModal.hidden) {
    systemMonitorModal.setFront();
    systemMonitorModal.setData(systemMonitorData);
    systemMonitorModal.focus();
  }

  screen.render();
};


const statusBar = blessed.box({
  bottom: 0,
  left: 0,
  width: '100%',
  height: parseInt(`${layoutInfo.statusBar.height}${layoutInfo.statusBar.heightUnit}`),
  content: 'Status Bar',
  style: {
    bg: 'white',
    fg: 'black'
  }
});

const leftPanel = blessed.box({
  top: 0,
  left: 0,
  width: `${layoutInfo.leftPanel.width}${layoutInfo.leftPanel.widthUnit}`,
  height: `100%-${layoutInfo.statusBar.height}`,
  content: 'Left Panel'
});

const treePanel = blessedContrib.tree({
  label: ' Files ',
  width: '100%',
  height: '75%',
  lineWidth: 1,
  line: true,
  border: {
    type: 'line'
  },
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
});
//#region Tree dummy data
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
})
//#endregion Tree dummy data

const setupTreePanelEvents = (tree: blessedContrib.Widgets.TreeElement, screen: blessed.Widgets.Screen) => {
  tree.on('select', (node) => {
    if (node.myCustomProperty) {
      screen.debug(`Selected node: ${node.name} (custom property: ${node.myCustomProperty})`);
    }
    screen.debug(`Selected node: ${node.name}`);
  });
};

const contextPanel = blessed.box({
  top: '75%',
  left: 0,
  width: '100%',
  height: '27%',
  border: {
    type: 'line',
  },
  label: ' Context ',
  scrollable: true,
  alwaysScroll: true,
  scrollbar: {
    style: {
      bg: 'white'
    },
    track: {
      bg: 'gray'
    }
  }
});

const mainPanel = blessed.box({
  top: 0,
  left: `${layoutInfo.leftPanel.width}%`,
  width: `${100 - layoutInfo.leftPanel.width - layoutInfo.rightPanel.width + 1}%`,
  height: `100%-${layoutInfo.statusBar.height}`,
  content: 'Main Panel'
});

// mainAgentBox와 mainTextBox의 상태를 관리하는 변수들
let mainTextBoxHeight = 3;
const maxTextBoxHeight = 25;
const minTextBoxHeight = 3;

const mainAgentBox = blessed.box({
  top: 0,
  left: 0,
  width: '100%-1', // 좌우 테두리를 고려하여 너비 조정
  height: `100%-${mainTextBoxHeight}`,
  border: {
    type: 'line'
  },
  label: ' Conversation ',
});

const mainTextBox = blessed.textarea({
  bottom: 0,
  left: 0,
  width: '100%-1', // 좌우 테두리를 고려하여 너비 조정
  height: mainTextBoxHeight,
  border: {
    type: 'line'
  },
  label: ' Prompt ',
  inputOnFocus: true,
  keys: true,
  mouse: true,
  vi: false,
  scrollable: true,
  alwaysScroll: true,
  scrollbar: {
    style: {
      bg: 'white'
    },
    track: {
      bg: 'gray'
    }
  },
  style: {
    border: {
      type: 'line',
      fg: 'white'
    },
    focus: {
      border: {
        type: 'line',
        fg: 'green'
      }
    }
  }
});

// mainTextBox에 입력 이벤트 리스너 추가하는 함수
const setupTextBoxEvents = (textBox: blessed.Widgets.TextareaElement) => {
  textBox.on('keypress', () => {
    // 현재 입력된 텍스트 가져오기
    const text = textBox.getValue();
    // 줄 수 계산
    const lineCount = text.split('\n').length;
    // 새 높이 계산 (줄 수 + 2: 테두리와 여백 고려)
    let newHeight = Math.min(lineCount + 2, maxTextBoxHeight);
    newHeight = Math.max(newHeight, minTextBoxHeight);

    // 높이가 변경되었을 때만 업데이트
    if (newHeight !== mainTextBoxHeight) {
      mainTextBoxHeight = newHeight;
      mainTextBox.height = mainTextBoxHeight;
      mainAgentBox.height = `100%-${mainTextBoxHeight}`;
      screen.render();
    }
  });
};

const rightPanel = blessed.box({
  top: 0,
  right: 0,
  width: `${layoutInfo.rightPanel.width}${layoutInfo.rightPanel.widthUnit}`,
  height: `100%-${layoutInfo.statusBar.height}`,
  content: 'Right Panel'
});

const taskPanel = blessed.box({
  top: 0,
  left: 0,
  width: '100%',
  height: '50%',
  border: {
    type: 'line',
  },
  label: ' Task Panel '
});

const agentMapPanel = blessed.box({
  top: '50%',
  left: 0,
  width: '100%',
  height: '52%',
  border: {
    type: 'line',
  },
  label: ' Agent Map '
});

// CLI 진입점
const main = async (): Promise<void> => {
  // const args = process.argv.slice(2);
  // const name = args[0] || 'CLI User';

  setupScreenEvents(screen);
  setupTextBoxEvents(mainTextBox); // 텍스트 박스 이벤트 설정
  setupTreePanelEvents(treePanel, screen); // 트리 패널 이벤트 설정

  screen.title = 'Nurexia CLI';

  // Add the modal system monitor to screen
  screen.append(systemMonitorModal);
  systemMonitorModal.setData(systemMonitorData);

  screen.append(leftPanel);
  leftPanel.append(treePanel);
  leftPanel.append(contextPanel);

  screen.append(mainPanel);
  mainPanel.append(mainAgentBox);
  mainPanel.append(mainTextBox);

  screen.append(rightPanel);
  rightPanel.append(taskPanel);
  rightPanel.append(agentMapPanel);

  screen.append(statusBar);

  screen.render()
};

// CLI 실행
main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});