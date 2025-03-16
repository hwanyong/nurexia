# Button

The Button widget is an interactive element that can be clicked or pressed to trigger an action. It is commonly used in forms and user interfaces to provide a way for users to submit data or trigger events.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a button
const button = blessed.button({
  top: 'center',
  left: 'center',
  width: 20,
  height: 3,
  content: 'Click me!',
  align: 'center',
  valign: 'middle',
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'blue',
    border: {
      fg: 'white'
    },
    focus: {
      bg: 'red'
    },
    hover: {
      bg: 'green'
    }
  },
  mouse: true,
  keys: true
});

// Append the button to the screen
screen.append(button);

// Focus on the button
button.focus();

// Handle button press
button.on('press', function() {
  screen.destroy();
  console.log('Button pressed!');
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

### `blessed.button(options)`

Creates a new button element.

**Parameters:**

- `options` (Object): Configuration options for the button

## Options

The Button widget inherits all options from the Box element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `content` | String | The text content of the button |
| `align` | String | Text alignment: 'left', 'center', or 'right'. Default: 'center' |
| `valign` | String | Vertical alignment: 'top', 'middle', or 'bottom'. Default: 'middle' |
| `mouse` | Boolean | Whether to enable mouse support for this element. Default: `true` |
| `keys` | Boolean/Array | Use pre-defined keys (i.e. enter) to trigger the button. Default: `true` |
| `autoFocus` | Boolean | Whether to automatically focus the button. Default: `false` |
| `padding` | Number/Object | Padding inside the button |
| `shrink` | Boolean | Whether to shrink the button to its content. Default: `false` |

### Inherited Options

The Button widget inherits all options from the Box element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The Button widget inherits all properties from the Box element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `pressed` | Boolean | Whether the button is currently pressed |
| `value` | String | The value of the button (same as content) |

## Methods

The Button widget inherits all methods from the Box element and adds the following:

### Button Management

#### `button.press()`

Programmatically press the button, emitting the 'press' event.

#### `button.setValue(value)`

Sets the value (content) of the button.

**Parameters:**

- `value` (String): The value to set

#### `button.getValue()`

Gets the current value (content) of the button.

**Returns:**

- String: The current value of the button

### Focus Management

#### `button.focus()`

Focuses on the button.

## Events

The Button widget inherits all events from the Box element and adds the following:

| Event | Description |
|-------|-------------|
| `press` | Emitted when the button is pressed (clicked or Enter key) |
| `click` | Emitted when the button is clicked with the mouse |
| `mouseover` | Emitted when the mouse moves over the button |
| `mouseout` | Emitted when the mouse moves out of the button |
| `mousedown` | Emitted when a mouse button is pressed down on the button |
| `mouseup` | Emitted when a mouse button is released on the button |
| `keypress` | Emitted when a key is pressed while the button is focused |

## Notes

- The Button widget is an interactive element that can be clicked or pressed to trigger an action.
- It is commonly used in forms and user interfaces to provide a way for users to submit data or trigger events.
- The button can be pressed by clicking it with the mouse or by pressing the Enter key when it is focused.
- The `style.hover` option can be used to change the appearance of the button when the mouse is over it.
- The `style.focus` option can be used to change the appearance of the button when it is focused.
- The Button widget extends the Box widget, so it inherits all of its options, methods, and events.
- The button can be customized with different borders, colors, and styles to match the look and feel of your application.