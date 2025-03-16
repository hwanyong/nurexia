# blessed API Documentation

This documentation provides a comprehensive reference for the blessed library, a powerful curses-like library with a high-level terminal interface API for Node.js.

## Overview

blessed is a feature-rich terminal interface library that allows you to create complex, interactive terminal applications with ease. It provides a DOM-like API for creating and manipulating terminal elements, along with powerful rendering capabilities optimized for terminal environments.

## Table of Contents

1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Core Components](#core-components)
   - [Screen](#screen)
   - [Program](#program)
   - [Node](#node)
4. [Widgets](#widgets)
   - [Basic Widgets](#basic-widgets)
   - [Form Widgets](#form-widgets)
   - [Layout Widgets](#layout-widgets)
   - [Special Widgets](#special-widgets)
5. [Utilities](#utilities)

## Installation

```bash
npm install blessed
```

## Basic Usage

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true,
  title: 'My Terminal App'
});

// Create a box
const box = blessed.box({
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  content: 'Hello world!',
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

// Append the box to the screen
screen.append(box);

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Focus on the box
box.focus();

// Render the screen
screen.render();
```

## Core Components

The blessed library is built around several core components:

- [Screen](./core/screen.md): The main container for all elements
- [Program](./core/program.md): Low-level terminal interface
- [Node](./core/node.md): Base class for all elements

## Widgets

blessed provides a wide range of widgets for building terminal interfaces:

### Basic Widgets

- [Box](./widgets/box.md): Basic container element
- [Text](./widgets/text.md): Simple text display
- [Line](./widgets/line.md): Horizontal or vertical line
- [ScrollableBox](./widgets/scrollable-box.md): Box with scrolling capability
- [ScrollableText](./widgets/scrollable-text.md): Text with scrolling capability
- [BigText](./widgets/big-text.md): Large text display

### Form Widgets

- [Form](./widgets/form.md): Container for form elements
- [Input](./widgets/input.md): Base class for input elements
- [Textarea](./widgets/textarea.md): Multi-line text input
- [Textbox](./widgets/textbox.md): Single-line text input
- [Button](./widgets/button.md): Clickable button
- [Checkbox](./widgets/checkbox.md): Toggleable checkbox
- [RadioSet](./widgets/radioset.md): Container for radio buttons
- [RadioButton](./widgets/radiobutton.md): Radio button element

### List Widgets

- [List](./widgets/list.md): Selectable list of items
- [ListTable](./widgets/listtable.md): List with tabular data
- [ListBar](./widgets/listbar.md): Horizontal list of buttons
- [FileManager](./widgets/filemanager.md): File system browser

### Special Widgets

- [ProgressBar](./widgets/progressbar.md): Progress indicator
- [Loading](./widgets/loading.md): Loading indicator
- [Message](./widgets/message.md): Message dialog
- [Question](./widgets/question.md): Question dialog
- [Prompt](./widgets/prompt.md): Input prompt
- [Table](./widgets/table.md): Data table
- [Terminal](./widgets/terminal.md): Embedded terminal
- [Image](./widgets/image.md): Image display
- [Video](./widgets/video.md): Video player
- [Log](./widgets/log.md): Log display

## Utilities

blessed also provides several utility functions for working with terminal content:

- [escape](./utils/escape.md): Escape text for terminal display
- [stripTags](./utils/striptags.md): Remove tags from text
- [cleanTags](./utils/cleantags.md): Clean tags from text
- [generateTags](./utils/generatetags.md): Generate tags for styling text
- [parseTags](./utils/parsetags.md): Parse tags in text

For detailed information on each component, refer to the specific documentation sections.