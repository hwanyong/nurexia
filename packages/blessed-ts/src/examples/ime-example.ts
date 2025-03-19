/**
 * IME Input Example - Demonstrates multilingual input support
 *
 * This example shows how blessed-ts supports IME input for languages like:
 * - Korean (한글)
 * - Japanese (日本語)
 * - Chinese (中文)
 *
 * Run with: `npm run start:ime-example`
 */

import { Screen } from '../widgets/screen';
import { Box } from '../widgets/box';
import { Textarea } from '../widgets/textarea';
import { Text } from '../widgets/text';

// Create screen
const screen = new Screen({
  smartCSR: true,
  title: 'IME Input Example',
  fullUnicode: true,
});

// Create box for instructions
const instructionsBox = new Box({
  parent: screen,
  top: 0,
  left: 0,
  width: '100%',
  height: '30%',
  content: [
    '{bold}Blessed-TS IME Input Example{/bold}',
    '',
    'This example demonstrates IME input support for multilingual text',
    'You can type any language including Korean, Japanese, and Chinese',
    '',
    'Top textarea: Standard input with IME support',
    'Bottom textarea: Shows what you typed (press Enter to submit)',
    '',
    'Press Escape twice to exit'
  ].join('\n'),
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    border: {
      fg: 'blue'
    }
  }
});

// Create input textarea
const textarea = new Textarea({
  parent: screen,
  top: '30%',
  left: 'center',
  width: '80%',
  height: '20%',
  border: {
    type: 'line'
  },
  style: {
    border: {
      fg: 'green'
    },
    focus: {
      border: {
        fg: 'red'
      }
    }
  },
  inputOnFocus: true,
  imeSupport: true,
  vi: true,
  keys: true,
  mouse: true,
  label: 'Input (supports IME)'
});

// Create output box
const outputBox = new Box({
  parent: screen,
  top: '55%',
  left: 'center',
  width: '80%',
  height: '40%',
  content: 'Type in the input field above and press Enter to see your text here',
  tags: true,
  scrollable: true,
  border: {
    type: 'line'
  },
  style: {
    border: {
      fg: 'blue'
    }
  },
  label: 'Output'
});

// Add an input handler that copies submitted text to the output
textarea.on('submit', (value) => {
  if (value) {
    const timestamp = new Date().toLocaleTimeString();
    outputBox.setContent(
      outputBox.content + '\n' +
      `[${timestamp}] ` +
      `You typed: "${value}"`
    );
    textarea.clearValue();
    screen.render();
  }
});

// Add a helper status line
const statusLine = new Text({
  parent: screen,
  bottom: 0,
  left: 0,
  width: '100%',
  height: 1,
  content: 'Press Escape to exit, Tab to switch focus',
  style: {
    bg: 'blue',
    fg: 'white'
  }
});

// Add key handlers
screen.key(['escape'], () => {
  return process.exit(0);
});

screen.key(['tab'], () => {
  if (screen.focused === textarea) {
    outputBox.focus();
  } else {
    textarea.focus();
  }
});

// Focus the input by default
textarea.focus();

// Render the screen
screen.render();