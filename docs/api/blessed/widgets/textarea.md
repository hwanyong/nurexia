# Textarea

The Textarea widget is a multi-line text input field that allows users to enter and edit text. It supports features like scrolling, cursor movement, and text selection.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a textarea
const textarea = blessed.textarea({
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: 'blue'
    },
    focus: {
      bg: 'gray'
    }
  },
  keys: true,
  vi: true,
  mouse: true,
  inputOnFocus: true,
  scrollbar: {
    ch: ' ',
    track: {
      bg: 'gray'
    },
    style: {
      inverse: true
    }
  }
});

// Append the textarea to the screen
screen.append(textarea);

// Focus on the textarea
textarea.focus();

// Handle textarea submission
textarea.on('submit', function(value) {
  screen.destroy();
  console.log('Textarea submitted with value:', value);
  process.exit(0);
});

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.textarea(options)`

Creates a new textarea element.

**Parameters:**

- `options` (Object): Configuration options for the textarea

## Options

The Textarea widget inherits all options from the Input element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `inputOnFocus` | Boolean | Whether to automatically enter input mode when the element is focused. Default: `false` |
| `scrollable` | Boolean | Whether the textarea is scrollable. Default: `true` |
| `scrollbar` | Object | Object enabling a scrollbar |
| `wordWrap` | Boolean | Whether to wrap words. Default: `true` |

### Inherited Options

The Textarea widget inherits all options from the Input element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `value` | String | Initial value of the textarea |
| `secret` | Boolean | Whether to hide the input (for passwords). Default: `false` |
| `censor` | Boolean | Whether to censor the input with a character (for passwords). Default: `false` |
| `censorChar` | String | Character to use for censoring. Default: `'*'` |
| `readOnly` | Boolean | Whether the textarea is read-only. Default: `false` |
| `mouse` | Boolean | Whether to enable automatic mouse support for this element. Default: `false` |
| `keys` | Boolean/Array | Use pre-defined keys (i.e. up, down) to navigate the textarea. Default: `false` |
| `vi` | Boolean | Use vi keys with the keys option. Default: `false` |
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The Textarea widget inherits all properties from the Input element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `wordWrap` | Boolean | Whether to wrap words |
| `_clines` | Array | Array of content lines |
| `_clines_height` | Number | Height of content lines |
| `_clines_width` | Number | Width of content lines |
| `_clines_x` | Array | Array of content line x positions |
| `_clines_y` | Array | Array of content line y positions |

## Methods

The Textarea widget inherits all methods from the Input element and adds the following:

### Input Management

#### `textarea.setValue(value)`

Sets the value of the textarea.

**Parameters:**

- `value` (String): The value to set

#### `textarea.getValue()`

Gets the current value of the textarea.

**Returns:**

- String: The current value of the textarea

#### `textarea.clearValue()`

Clears the value of the textarea.

#### `textarea.submit()`

Submits the textarea, emitting the 'submit' event with the current value.

#### `textarea.cancel()`

Cancels the textarea, emitting the 'cancel' event.

### Cursor Movement

#### `textarea.moveCursor(offset)`

Moves the cursor by the specified offset.

**Parameters:**

- `offset` (Number): The offset to move the cursor by

#### `textarea.setLine(i, line)`

Sets a line of text at the specified index.

**Parameters:**

- `i` (Number): The line index
- `line` (String): The line text

#### `textarea.insertLine(i, line)`

Inserts a line of text at the specified index.

**Parameters:**

- `i` (Number): The line index
- `line` (String): The line text

#### `textarea.deleteLine(i)`

Deletes a line of text at the specified index.

**Parameters:**

- `i` (Number): The line index

#### `textarea.getLine(i)`

Gets a line of text at the specified index.

**Parameters:**

- `i` (Number): The line index

**Returns:**

- String: The line text

#### `textarea.getLines()`

Gets all lines of text.

**Returns:**

- Array: The lines of text

### Input Mode

#### `textarea.readInput(callback)`

Enters input mode, allowing the user to type.

**Parameters:**

- `callback` (Function): Function to call when input is complete

#### `textarea.enableInput()`

Enables input mode.

#### `textarea.disableInput()`

Disables input mode.

### Focus Management

#### `textarea.focus()`

Focuses on the textarea.

## Events

The Textarea widget inherits all events from the Input element:

| Event | Description |
|-------|-------------|
| `submit` | Emitted when the textarea is submitted (Ctrl+Enter) |
| `cancel` | Emitted when the textarea is cancelled (Escape key) |
| `action` | Emitted when any action is performed on the textarea |
| `keypress` | Emitted when a key is pressed while the textarea is focused |

## Notes

- The Textarea widget is a multi-line text input field that allows users to enter and edit text.
- It supports features like scrolling, cursor movement, and text selection.
- The `inputOnFocus` option is useful for automatically entering input mode when the element is focused.
- The `wordWrap` option controls whether text is wrapped to fit within the width of the textarea.
- The Textarea widget extends the Input widget, so it inherits all of its options, methods, and events.
- To submit the textarea, press Ctrl+Enter. To cancel, press the Escape key.
- The Textarea widget is useful for entering and editing large amounts of text.