# Checkbox

The Checkbox widget is an interactive element that allows users to toggle between checked and unchecked states. It is commonly used in forms to enable users to select multiple options from a list.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a checkbox
const checkbox = blessed.checkbox({
  top: 'center',
  left: 'center',
  width: 'shrink',
  height: 'shrink',
  content: 'Check me',
  checked: false,
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
    },
    hover: {
      bg: 'gray'
    }
  },
  mouse: true,
  keys: true
});

// Append the checkbox to the screen
screen.append(checkbox);

// Focus on the checkbox
checkbox.focus();

// Handle checkbox check/uncheck
checkbox.on('check', function() {
  console.log('Checkbox checked!');
});

checkbox.on('uncheck', function() {
  console.log('Checkbox unchecked!');
});

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.checkbox(options)`

Creates a new checkbox element.

**Parameters:**

- `options` (Object): Configuration options for the checkbox

## Options

The Checkbox widget inherits all options from the Input element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `checked` | Boolean | Whether the checkbox is checked. Default: `false` |
| `content` | String | The text content displayed next to the checkbox |
| `check` | String | The character to use for the checked state. Default: `'✓'` |
| `bold` | Boolean | Whether to display the text in bold. Default: `false` |
| `mouse` | Boolean | Whether to enable mouse support for this element. Default: `false` |
| `keys` | Boolean/Array | Use pre-defined keys (i.e. space) to toggle the checkbox. Default: `false` |
| `align` | String | Text alignment: 'left', 'center', or 'right'. Default: 'left' |
| `padding` | Number/Object | Padding inside the checkbox |

### Inherited Options

The Checkbox widget inherits all options from the Input element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The Checkbox widget inherits all properties from the Input element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `checked` | Boolean | Whether the checkbox is checked |
| `value` | Boolean | The value of the checkbox (same as checked) |
| `text` | String | The text content displayed next to the checkbox |

## Methods

The Checkbox widget inherits all methods from the Input element and adds the following:

### Checkbox Management

#### `checkbox.check()`

Checks the checkbox, emitting the 'check' event.

#### `checkbox.uncheck()`

Unchecks the checkbox, emitting the 'uncheck' event.

#### `checkbox.toggle()`

Toggles the checkbox state, emitting either the 'check' or 'uncheck' event.

#### `checkbox.setValue(value)`

Sets the value (checked state) of the checkbox.

**Parameters:**

- `value` (Boolean): The value to set

#### `checkbox.getValue()`

Gets the current value (checked state) of the checkbox.

**Returns:**

- Boolean: The current value of the checkbox

#### `checkbox.setContent(text)`

Sets the text content displayed next to the checkbox.

**Parameters:**

- `text` (String): The text to set

#### `checkbox.getContent()`

Gets the text content displayed next to the checkbox.

**Returns:**

- String: The text content

### Focus Management

#### `checkbox.focus()`

Focuses on the checkbox.

## Events

The Checkbox widget inherits all events from the Input element and adds the following:

| Event | Description |
|-------|-------------|
| `check` | Emitted when the checkbox is checked |
| `uncheck` | Emitted when the checkbox is unchecked |
| `click` | Emitted when the checkbox is clicked with the mouse |
| `mouseover` | Emitted when the mouse moves over the checkbox |
| `mouseout` | Emitted when the mouse moves out of the checkbox |
| `mousedown` | Emitted when a mouse button is pressed down on the checkbox |
| `mouseup` | Emitted when a mouse button is released on the checkbox |
| `keypress` | Emitted when a key is pressed while the checkbox is focused |

## Notes

- The Checkbox widget is an interactive element that allows users to toggle between checked and unchecked states.
- It is commonly used in forms to enable users to select multiple options from a list.
- The checkbox can be toggled by clicking it with the mouse or by pressing the Space key when it is focused.
- The `style.hover` option can be used to change the appearance of the checkbox when the mouse is over it.
- The `style.focus` option can be used to change the appearance of the checkbox when it is focused.
- The Checkbox widget extends the Input widget, so it inherits all of its options, methods, and events.
- The checkbox can be customized with different borders, colors, and styles to match the look and feel of your application.
- The `check` option can be used to customize the character displayed when the checkbox is checked.