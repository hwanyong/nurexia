# Line

The Line widget is used to draw horizontal or vertical lines in the terminal. It's useful for creating visual separators between different sections of your interface.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a horizontal line
const horizontalLine = blessed.line({
  top: 'center',
  left: 0,
  right: 0,
  orientation: 'horizontal',
  style: {
    fg: 'blue'
  }
});

// Create a vertical line
const verticalLine = blessed.line({
  top: 0,
  bottom: 0,
  left: 'center',
  orientation: 'vertical',
  style: {
    fg: 'red'
  }
});

// Append the lines to the screen
screen.append(horizontalLine);
screen.append(verticalLine);

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.line(options)`

Creates a new line element.

**Parameters:**

- `options` (Object): Configuration options for the line

## Options

The Line widget inherits all options from the Box element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `orientation` | String | The orientation of the line: 'horizontal' or 'vertical'. Default: 'horizontal' |
| `type` | String | Type of line: 'line' or 'bg'. Default: 'line' |
| `ch` | String | Character to use for the line. Default: '─' for horizontal, '│' for vertical |

### Inherited Options

The Line widget inherits all options from the Box element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `right` | Number/String | Right offset |
| `bottom` | Number/String | Bottom offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |
| `style` | Object | Style object |
| `fg` | String | Foreground color |
| `bg` | String | Background color |

## Properties

The Line widget inherits all properties from the Box element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `orientation` | String | The orientation of the line: 'horizontal' or 'vertical' |
| `type` | String | Type of line: 'line' or 'bg' |

## Methods

The Line widget inherits all methods from the Box element.

## Events

The Line widget inherits all events from the Box element:

| Event | Description |
|-------|-------------|
| `click` | Emitted when the line is clicked |
| `mouseover` | Emitted when the mouse moves over the line |
| `mouseout` | Emitted when the mouse moves out of the line |
| `mousedown` | Emitted when a mouse button is pressed on the line |
| `mouseup` | Emitted when a mouse button is released on the line |

## Notes

- The Line widget is useful for creating visual separators in your interface.
- For horizontal lines, you typically want to set `left: 0` and `right: 0` to make the line span the entire width.
- For vertical lines, you typically want to set `top: 0` and `bottom: 0` to make the line span the entire height.
- The `ch` option allows you to customize the character used for the line. By default, it uses '─' for horizontal lines and '│' for vertical lines.
- The `type` option can be set to 'bg' to use the background color for the line instead of the foreground color.
- The Line widget extends the Box widget, so it inherits all of its options, methods, and events.