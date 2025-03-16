# Box

The Box widget is the most basic container element in blessed. It serves as a building block for creating more complex interfaces and is the base class for many other widgets.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
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
      fg: 'blue'
    },
    hover: {
      bg: 'green'
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

## Constructor

### `blessed.box(options)`

Creates a new box element.

**Parameters:**

- `options` (Object): Configuration options for the box

## Options

The Box widget inherits all options from the Element class and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `content` | String | Text content to display in the box |
| `tags` | Boolean | Whether to parse tags in content. Default: `false` |
| `wrap` | Boolean | Whether to wrap text content. Default: `true` |
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `padding` | Number/Object | Amount of padding on the inside of the box |
| `shadow` | Boolean | Whether to draw a shadow behind the box. Default: `false` |
| `fill` | Boolean | Whether to fill the entire box with the background color. Default: `false` |
| `align` | String | Text alignment: 'left', 'center', or 'right'. Default: 'left' |
| `valign` | String | Vertical text alignment: 'top', 'middle', or 'bottom'. Default: 'top' |
| `scrollable` | Boolean | Whether the box is scrollable. Default: `false` |
| `scrollbar` | Object | Object enabling a scrollbar |
| `ch` | String | Background character (default is whitespace) |

### Inherited Options

#### From Element

| Option | Type | Description |
|--------|------|-------------|
| `fg` | String | Foreground color |
| `bg` | String | Background color |
| `bold` | Boolean | Whether text is bold |
| `underline` | Boolean | Whether text is underlined |
| `clickable` | Boolean | Whether the element is clickable |
| `input` | Boolean | Whether the element can receive input |
| `keyable` | Boolean | Whether the element is focusable and can receive key input |
| `focused` | Element | Element is focused |
| `hidden` | Boolean | Whether the element is hidden |
| `label` | String | A simple text label for the element |
| `hoverText` | String | A floating text label for the element which appears on mouseover |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `right` | Number/String | Right offset |
| `bottom` | Number/String | Bottom offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |
| `position` | Object | Can contain the above options |
| `draggable` | Boolean | Allow the element to be dragged with the mouse |

#### From Node

| Option | Type | Description |
|--------|------|-------------|
| `name` | String | Name of the node |
| `screen` | Screen | Screen to which this node belongs |
| `parent` | Node | Parent node |
| `children` | Array | Array of child nodes |
| `focusable` | Boolean | Whether the node can be focused |

## Properties

The Box widget inherits all properties from the ScrollableText element.

## Methods

The Box widget inherits all methods from the ScrollableText element.

### Content Management

#### `box.setContent(content)`

Sets the content of the box.

**Parameters:**

- `content` (String): The content to set

#### `box.getContent()`

Gets the content of the box.

**Returns:**

- String: The content of the box

#### `box.setLine(y, line)`

Sets a line of content at the specified y coordinate.

**Parameters:**

- `y` (Number): The y coordinate
- `line` (String): The line content

#### `box.getLine(y)`

Gets a line of content at the specified y coordinate.

**Parameters:**

- `y` (Number): The y coordinate

**Returns:**

- String: The line content

#### `box.getBaseLine(y)`

Gets a line of content relative to the base scroll index.

**Parameters:**

- `y` (Number): The y coordinate

**Returns:**

- String: The line content

#### `box.getScreenLine(y)`

Gets a line of content relative to the visible screen.

**Parameters:**

- `y` (Number): The y coordinate

**Returns:**

- String: The line content

#### `box.insertLine(y, line)`

Inserts a line at the specified y coordinate.

**Parameters:**

- `y` (Number): The y coordinate
- `line` (String): The line content

#### `box.deleteLine(y)`

Deletes a line at the specified y coordinate.

**Parameters:**

- `y` (Number): The y coordinate

#### `box.getLines()`

Gets all lines of content.

**Returns:**

- Array: The lines of content

#### `box.getScreenLines()`

Gets all visible lines of content.

**Returns:**

- Array: The visible lines of content

### Scrolling

#### `box.scroll(offset, always)`

Scrolls the box by the specified offset.

**Parameters:**

- `offset` (Number): The offset to scroll by
- `always` (Boolean): Whether to scroll even if the offset is out of bounds

#### `box.scrollTo(index)`

Scrolls the box to the specified index.

**Parameters:**

- `index` (Number): The index to scroll to

#### `box.setScroll(index)`

Sets the scroll index.

**Parameters:**

- `index` (Number): The index to set

#### `box.resetScroll()`

Resets the scroll index to 0.

### Focus Management

#### `box.focus()`

Focuses the box.

#### `box.blur()`

Removes focus from the box.

### Rendering

#### `box.render()`

Renders the box.

## Events

The Box widget inherits all events from the ScrollableText element and adds the following:

| Event | Description |
|-------|-------------|
| `click` | Emitted when the box is clicked |
| `mouseover` | Emitted when the mouse moves over the box |
| `mouseout` | Emitted when the mouse moves out of the box |
| `mousedown` | Emitted when a mouse button is pressed on the box |
| `mouseup` | Emitted when a mouse button is released on the box |
| `mousewheel` | Emitted when the mouse wheel is moved on the box |
| `keypress` | Emitted when a key is pressed while the box is focused |

## Notes

- The Box widget is the most basic container element in blessed and serves as a building block for more complex widgets.
- It can be used to create panels, frames, and other container-like elements.
- The Box widget supports scrolling, borders, padding, and other common features.
- It can contain text content or other widgets as children.