# Textbox

The Textbox widget is a single-line text input field that allows users to enter and edit text. It is similar to the Input widget but with additional features for text editing and cursor movement.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a textbox
const textbox = blessed.textbox({
  top: 'center',
  left: 'center',
  width: '50%',
  height: 3,
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
  mouse: true,
  inputOnFocus: true
});

// Append the textbox to the screen
screen.append(textbox);

// Focus on the textbox
textbox.focus();

// Handle textbox submission
textbox.on('submit', function(value) {
  screen.destroy();
  console.log('Textbox submitted with value:', value);
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

### `blessed.textbox(options)`

Creates a new textbox element.

**Parameters:**

- `options` (Object): Configuration options for the textbox

## Options

The Textbox widget inherits all options from the Input element:

| Option | Type | Description |
|--------|------|-------------|
| `inputOnFocus` | Boolean | Whether to automatically enter input mode when the element is focused. Default: `false` |
| `value` | String | Initial value of the textbox |
| `secret` | Boolean | Whether to hide the input (for passwords). Default: `false` |
| `censor` | Boolean | Whether to censor the input with a character (for passwords). Default: `false` |
| `censorChar` | String | Character to use for censoring. Default: `'*'` |
| `readOnly` | Boolean | Whether the textbox is read-only. Default: `false` |
| `mouse` | Boolean | Whether to enable automatic mouse support for this element. Default: `false` |
| `keys` | Boolean/Array | Use pre-defined keys (i.e. left, right) to navigate the textbox. Default: `false` |
| `vi` | Boolean | Use vi keys with the keys option. Default: `false` |
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The Textbox widget inherits all properties from the Input element:

| Property | Type | Description |
|----------|------|-------------|
| `value` | String | Current value of the textbox |
| `inputOnFocus` | Boolean | Whether to automatically enter input mode when the element is focused |
| `secret` | Boolean | Whether to hide the input (for passwords) |
| `censor` | Boolean | Whether to censor the input with a character (for passwords) |
| `censorChar` | String | Character to use for censoring |
| `readOnly` | Boolean | Whether the textbox is read-only |

## Methods

The Textbox widget inherits all methods from the Input element:

### Input Management

#### `textbox.setValue(value)`

Sets the value of the textbox.

**Parameters:**

- `value` (String): The value to set

#### `textbox.getValue()`

Gets the current value of the textbox.

**Returns:**

- String: The current value of the textbox

#### `textbox.clearValue()`

Clears the value of the textbox.

#### `textbox.submit()`

Submits the textbox, emitting the 'submit' event with the current value.

#### `textbox.cancel()`

Cancels the textbox, emitting the 'cancel' event.

### Cursor Movement

#### `textbox.moveCursor(offset)`

Moves the cursor by the specified offset.

**Parameters:**

- `offset` (Number): The offset to move the cursor by

#### `textbox.setPosition(pos)`

Sets the cursor position.

**Parameters:**

- `pos` (Number): The position to set the cursor to

#### `textbox.getPosition()`

Gets the current cursor position.

**Returns:**

- Number: The current cursor position

### Input Mode

#### `textbox.readInput(callback)`

Enters input mode, allowing the user to type.

**Parameters:**

- `callback` (Function): Function to call when input is complete

#### `textbox.enableInput()`

Enables input mode.

#### `textbox.disableInput()`

Disables input mode.

### Focus Management

#### `textbox.focus()`

Focuses on the textbox.

## Events

The Textbox widget inherits all events from the Input element:

| Event | Description |
|-------|-------------|
| `submit` | Emitted when the textbox is submitted (Enter key) |
| `cancel` | Emitted when the textbox is cancelled (Escape key) |
| `action` | Emitted when any action is performed on the textbox |
| `keypress` | Emitted when a key is pressed while the textbox is focused |

## Notes

- The Textbox widget is a single-line text input field that allows users to enter and edit text.
- It is similar to the Input widget but with additional features for text editing and cursor movement.
- The `inputOnFocus` option is useful for automatically entering input mode when the element is focused.
- The Textbox widget is useful for forms and user input in terminal applications.
- For multi-line text input, consider using the Textarea widget instead.
- The Textbox widget extends the Input widget, so it inherits all of its options, methods, and events.
- To submit the textbox, press the Enter key. To cancel, press the Escape key.