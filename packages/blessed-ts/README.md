# blessed-ts

A TypeScript implementation of the [blessed](https://github.com/chjj/blessed) terminal interface library with improved IME and multilingual support.

## Features

- Complete TypeScript conversion of the blessed library
- Full type safety and IntelliSense support
- Enhanced IME (Input Method Editor) support for Asian languages
- Improved multilingual text rendering
- Unicode handling with proper grapheme cluster support
- Modern codebase with ES modules

## IME Support

This library includes enhanced IME support for languages that require composition-based input methods:

- **Korean (한글)**: Full support for Hangul composition
- **Japanese (日本語)**: Support for Hiragana, Katakana, and Kanji input
- **Chinese (中文)**: Support for both Simplified and Traditional Chinese input
- **Other languages**: Better support for other non-Latin scripts

Features of the IME implementation:

- Visual feedback during composition
- Proper cursor positioning within composed text
- Underline style for text being composed
- Support for composition cancellation and editing

## Installation

```bash
npm install blessed-ts
```

## Basic Usage

```typescript
import { Screen, Box, Text } from 'blessed-ts';

// Create a screen
const screen = new Screen({
  smartCSR: true,
  title: 'blessed-ts example',
  fullUnicode: true,
});

// Create a box
const box = new Box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  content: 'Hello, world!',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: '#f0f0f0'
    }
  }
});

// Quit on Escape, q, or Ctrl+C
screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

// Render the screen
screen.render();
```

## IME Input Example

To see the IME input support in action:

```bash
npm run start:ime-example
```

This example demonstrates:
- Real-time IME composition feedback
- Support for Korean, Japanese, and Chinese input
- Proper rendering of multilingual text

## Documentation

For detailed API documentation, see the [Wiki](https://github.com/your-username/blessed-ts/wiki).

## License

MIT