/**
 * filemanager-log-example.ts
 * Demonstration of FileManager and Log widgets
 */

import { Screen } from '../widgets/screen';
import { Box } from '../widgets/box';
import { FileManager } from '../widgets/filemanager';
import { Log } from '../widgets/log';
import { Button } from '../widgets/button';

// Initialize the screen
const screen = new Screen({
  smartCSR: true,
  title: 'Blessed-TS FileManager and Log Example'
});

// Create a box for the title
const title = new Box({
  parent: screen,
  top: 0,
  left: 'center',
  width: '100%',
  height: 3,
  content: 'FileManager and Log Example',
  tags: true,
  style: {
    fg: 'white',
    bg: 'blue',
    bold: true
  },
  align: 'center',
  valign: 'middle'
});

// Create a FileManager widget
const fileManager = new FileManager({
  parent: screen,
  top: 3,
  left: 0,
  width: '50%',
  height: '100%-6',
  border: {
    type: 'line'
  },
  style: {
    border: {
      fg: 'blue'
    },
    selected: {
      bg: 'blue',
      fg: 'white',
      bold: true
    }
  },
  label: ' File Browser - %path ',
  keys: true,
  vi: true,
  mouse: true
});

// Create a Log widget
const log = new Log({
  parent: screen,
  top: 3,
  right: 0,
  width: '50%',
  height: '100%-6',
  border: {
    type: 'line'
  },
  style: {
    border: {
      fg: 'green'
    }
  },
  label: ' Activity Log ',
  tags: true,
  scrollback: 100,
  scrollbar: {
    ch: ' ',
    track: {
      bg: 'gray'
    },
    style: {
      bg: 'blue'
    }
  },
  mouse: true
});

// Add a quit button
const quitButton = new Button({
  parent: screen,
  bottom: 1,
  left: 'center',
  width: 'shrink',
  height: 'shrink',
  content: 'Quit',
  style: {
    bg: 'red',
    fg: 'white'
  },
  align: 'center',
  valign: 'middle',
  mouse: true
});

// Log initial message
log.log('{green-fg}Application started.{/green-fg}');
log.log('Navigate through files using arrow keys or vim keybindings (h,j,k,l).');
log.log('Press Enter to select a file or directory.');

// Set up event handlers
fileManager.on('cd', (dir, oldDir) => {
  log.log(`{yellow-fg}Changed directory:{/yellow-fg} ${oldDir} -> ${dir}`);
});

fileManager.on('file', (file) => {
  log.log(`{magenta-fg}Selected file:{/magenta-fg} ${file}`);
});

fileManager.on('error', (err) => {
  log.log(`{red-fg}Error:{/red-fg} ${err.message}`);
});

// Handle quit button
quitButton.on('press', () => {
  log.log('{red-fg}Exiting application...{/red-fg}');
  setTimeout(() => screen.destroy(), 500);
});

// Global key bindings
screen.on('keypress', (ch, key) => {
  if (key.name === 'escape' || key.name === 'q' || (key.name === 'c' && key.ctrl)) {
    screen.destroy();
  }
});

// Focus on the file manager initially
fileManager.focus();

// Refresh the file manager to show current directory
fileManager.refresh();

// Render the screen
screen.render();

// Example log messages every few seconds
let count = 0;
const timer = setInterval(() => {
  count++;
  log.log(`Automatic log message #${count}`);

  if (count >= 10) {
    clearInterval(timer);
    log.log('{cyan-fg}Automatic logging stopped.{/cyan-fg}');
  }

  screen.render();
}, 3000);