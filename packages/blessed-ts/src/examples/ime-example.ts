/**
 * IME Composition Example - blessed-ts
 *
 * This example demonstrates the IME (Input Method Editor) composition functionality
 * for typing non-Latin scripts like Chinese, Japanese, Korean, etc.
 *
 * Usage:
 * $ npx ts-node src/examples/ime-example.ts
 */

import blessed from '../index';
import { Textarea } from '../widgets/textarea';
import { Screen } from '../widgets/screen';
import { Box } from '../widgets/box';

// Create a screen
const mainScreen = new Screen({
  smartCSR: true,
  title: 'blessed-ts IME Example',
  fullUnicode: true,
  terminal: process.env.TERM,
  tput: false // Disable tput to avoid file not found error
});

// Create a box for instructions
const instructionsBox = new Box({
  parent: mainScreen,
  top: 0,
  left: 0,
  width: '100%',
  height: 6,
  content: [
    '{bold}IME Composition Example{/bold}',
    '',
    'This example demonstrates IME composition for multilingual input.',
    'Type in the textarea below using your system\'s IME:',
    '• Korean (Hangul) - Press {bold}Alt+Space{/bold} or {bold}Right Alt{/bold} on most systems to switch',
    '• Press {bold}Esc{/bold} to exit'
  ].join('\n'),
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'blue',
    border: {
      fg: 'white'
    }
  }
});

// Create a textarea with IME support
const inputArea = new Textarea({
  parent: mainScreen,
  top: 7,
  left: 0,
  width: '100%',
  height: 10,
  label: ' Input (with IME support) ',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: 'green'
    }
  },
  // IME specific options
  imeSupport: true,
  imeStyle: 'underline'
});

// Create a display box to show the entered text
const displayBox = new Box({
  parent: mainScreen,
  top: 18,
  left: 0,
  width: '100%',
  height: 4,
  label: ' Captured Text ',
  content: '',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: 'magenta'
    }
  }
});

// Create help information
const helpBox = new Box({
  parent: mainScreen,
  bottom: 0,
  left: 0,
  width: '100%',
  height: 3,
  content: '{center}Press {bold}Enter{/bold} to submit text • {bold}Ctrl+e{/bold} for external editor • {bold}Esc{/bold} to exit{/center}',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'grey',
    border: {
      fg: 'white'
    }
  }
});

// Start reading input
inputArea.focus();
inputArea.readInput((err, value) => {
  if (err) {
    mainScreen.destroy();
    return console.error('Error:', err);
  }

  if (value === undefined) {
    // ESC was pressed
    mainScreen.destroy();
    return;
  }

  // Display the entered text
  displayBox.setContent(value || '[empty]');
  mainScreen.render();

  // Restart input reading
  setTimeout(() => {
    inputArea.clearValue();
    inputArea.readInput();
  }, 500);
});

// Event handlers for escape key
mainScreen.on('key', (ch, key) => {
  if (key.name === 'escape' || key.name === 'q') {
    mainScreen.destroy();
    process.exit(0);
  }
});

// Render the screen
mainScreen.render();