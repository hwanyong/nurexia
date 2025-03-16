# Input

The Input widget is the base class for all input elements in blessed. It provides common functionality for handling user input, such as keyboard events and focus management.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create an input element
const input = blessed.input({
  top: 'center',
  left: 'center',
  width: 30,
  height: 1,
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
  }
});

// Append the input to the screen
screen.append(input);

// Focus on the input
input.focus();

// Handle input submission
input.on('submit', function(value) {
  screen.destroy();
  console.log('Input submitted with value:', value);
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

### `blessed.input(options)`

Creates a new input element.

**Parameters:**

- `options` (Object): Configuration options for the input

## Options

The Input widget inherits all options from the ScrollableBox element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `value` | String | Initial value of the input |
| `inputOnFocus` | Boolean | Whether to automatically enter input mode when the element is focused. Default: `false` |
| `secret` | Boolean | Whether to hide the input (for passwords). Default: `false` |
| `censor` | Boolean | Whether to censor the input with a character (for passwords). Default: `false` |
| `censorChar` | String | Character to use for censoring. Default: `'*'` |
| `readOnly` | Boolean | Whether the input is read-only. Default: `false` |
| `mouse` | Boolean | Whether to enable automatic mouse support for this element. Default: `false` |
| `keys` | Boolean/Array | Use pre-defined keys (i.e. up, down) to navigate the input. Default: `false` |
| `vi` | Boolean | Use vi keys with the keys option. Default: `false` |

### Inherited Options

The Input widget inherits all options from the ScrollableBox element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The Input widget inherits all properties from the ScrollableBox element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `value` | String | Current value of the input |
| `inputOnFocus` | Boolean | Whether to automatically enter input mode when the element is focused |
| `secret` | Boolean | Whether to hide the input (for passwords) |
| `censor` | Boolean | Whether to censor the input with a character (for passwords) |
| `censorChar` | String | Character to use for censoring |
| `readOnly` | Boolean | Whether the input is read-only |

## Methods

The Input widget inherits all methods from the ScrollableBox element and adds the following:

### Input Management

#### `input.setValue(value)`

Sets the value of the input.

**Parameters:**

- `value` (String): The value to set

#### `input.getValue()`

Gets the current value of the input.

**Returns:**

- String: The current value of the input

#### `input.clearValue()`

Clears the value of the input.

#### `input.submit()`

Submits the input, emitting the 'submit' event with the current value.

#### `input.cancel()`

Cancels the input, emitting the 'cancel' event.

### Input Mode

#### `input.readInput(callback)`

Enters input mode, allowing the user to type.

**Parameters:**

- `callback` (Function): Function to call when input is complete

#### `input.enableInput()`

Enables input mode.

#### `input.disableInput()`

Disables input mode.

### Focus Management

#### `input.focus()`

Focuses on the input.

## Events

The Input widget inherits all events from the ScrollableBox element and adds the following:

| Event | Description |
|-------|-------------|
| `submit` | Emitted when the input is submitted (Enter key) |
| `cancel` | Emitted when the input is cancelled (Escape key) |
| `action` | Emitted when any action is performed on the input |
| `keypress` | Emitted when a key is pressed while the input is focused |

## Notes

- The Input widget is the base class for all input elements in blessed, such as Textbox, Textarea, and more.
- It provides common functionality for handling user input, such as keyboard events and focus management.
- The `inputOnFocus` option is useful for automatically entering input mode when the element is focused.
- The `secret` and `censor` options are useful for password inputs.
- The Input widget extends the ScrollableBox widget, so it inherits all of its options, methods, and events.
- To submit the input, press the Enter key. To cancel, press the Escape key.