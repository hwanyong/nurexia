# ScrollableBox

The ScrollableBox widget is an extension of the Box widget that adds scrolling capabilities. It's useful for displaying content that doesn't fit within the visible area of the element.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a scrollable box
const scrollableBox = blessed.scrollablebox({
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  content: 'This is a scrollable box. You can use the arrow keys or mouse wheel to scroll.\n\n' +
           'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(20),
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  },
  scrollbar: {
    ch: ' ',
    track: {
      bg: 'gray'
    },
    style: {
      inverse: true
    }
  },
  keys: true,
  vi: true,
  alwaysScroll: true,
  mouse: true
});

// Append the scrollable box to the screen
screen.append(scrollableBox);

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Focus on the scrollable box
scrollableBox.focus();

// Render the screen
screen.render();
```

## Constructor

### `blessed.scrollablebox(options)`

Creates a new scrollable box element.

**Parameters:**

- `options` (Object): Configuration options for the scrollable box

## Options

The ScrollableBox widget inherits all options from the Box element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `baseLimit` | Number | A limit to the childBase. Default is Infinity |
| `alwaysScroll` | Boolean | A option which causes the ignoring of childOffset. This in turn causes the calculation of childBase to change (if scrolled at the bottom, it will try to scroll the element as far as possible). Default: `false` |
| `scrollbar` | Object | Object enabling a scrollbar |
| `scrollbar.style` | Object | Style of the scrollbar |
| `scrollbar.track` | Object | Style of the scrollbar track |
| `scrollbar.ch` | String | Character to use for the scrollbar. Default: ' ' |
| `keys` | Boolean/Array | Use pre-defined keys (i.e. up, down) to navigate the scrollable content. Default: `false` |
| `vi` | Boolean | Use vi keys with the keys option. Default: `false` |
| `mouse` | Boolean | Whether to enable automatic mouse support for this element. Default: `false` |

### Inherited Options

The ScrollableBox widget inherits all options from the Box element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `content` | String | Element's text content |
| `tags` | Boolean | Whether to parse tags in content |
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The ScrollableBox widget inherits all properties from the Box element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `childBase` | Number | The current scroll index in lines |
| `childOffset` | Number | The current scroll index in lines (same as childBase) |
| `baseLimit` | Number | The maximum childBase allowed |
| `alwaysScroll` | Boolean | Whether to always scroll regardless of childOffset |

## Methods

The ScrollableBox widget inherits all methods from the Box element and adds the following:

### Scrolling

#### `scrollablebox.scroll(offset, always)`

Scrolls the content by the given offset.

**Parameters:**

- `offset` (Number): The number of lines to scroll by (positive for down, negative for up)
- `always` (Boolean): Whether to scroll even if the offset is out of bounds

#### `scrollablebox.scrollTo(index)`

Scrolls the content to the given index.

**Parameters:**

- `index` (Number): The line index to scroll to

#### `scrollablebox.setScroll(index)`

Sets the scroll index.

**Parameters:**

- `index` (Number): The line index to set

#### `scrollablebox.resetScroll()`

Resets the scroll index to 0.

#### `scrollablebox.getScroll()`

Gets the current scroll index.

**Returns:**

- Number: The current scroll index

#### `scrollablebox.getScrollHeight()`

Gets the total height of the scrollable content.

**Returns:**

- Number: The total height of the scrollable content

#### `scrollablebox.getScrollPerc()`

Gets the current scroll percentage.

**Returns:**

- Number: The current scroll percentage (0-100)

#### `scrollablebox.setScrollPerc(percentage)`

Sets the scroll percentage.

**Parameters:**

- `percentage` (Number): The scroll percentage to set (0-100)

### Content Management

#### `scrollablebox.setContent(content)`

Sets the content of the scrollable box.

**Parameters:**

- `content` (String): The content to set

#### `scrollablebox.getContent()`

Gets the content of the scrollable box.

**Returns:**

- String: The content of the scrollable box

#### `scrollablebox.setLine(y, line)`

Sets a line of content at the specified y coordinate.

**Parameters:**

- `y` (Number): The y coordinate
- `line` (String): The line content

#### `scrollablebox.getLine(y)`

Gets a line of content at the specified y coordinate.

**Parameters:**

- `y` (Number): The y coordinate

**Returns:**

- String: The line content

#### `scrollablebox.getBaseLine(y)`

Gets a line of content relative to the base scroll index.

**Parameters:**

- `y` (Number): The y coordinate

**Returns:**

- String: The line content

#### `scrollablebox.getScreenLine(y)`

Gets a line of content relative to the visible screen.

**Parameters:**

- `y` (Number): The y coordinate

**Returns:**

- String: The line content

#### `scrollablebox.insertLine(y, line)`

Inserts a line at the specified y coordinate.

**Parameters:**

- `y` (Number): The y coordinate
- `line` (String): The line content

#### `scrollablebox.deleteLine(y)`

Deletes a line at the specified y coordinate.

**Parameters:**

- `y` (Number): The y coordinate

#### `scrollablebox.getLines()`

Gets all lines of content.

**Returns:**

- Array: The lines of content

#### `scrollablebox.getScreenLines()`

Gets all visible lines of content.

**Returns:**

- Array: The visible lines of content

## Events

The ScrollableBox widget inherits all events from the Box element and adds the following:

| Event | Description |
|-------|-------------|
| `scroll` | Emitted when the element is scrolled |

## Notes

- The ScrollableBox widget is the base class for many other scrollable widgets like ScrollableText, List, and Form.
- It provides scrolling capabilities for content that doesn't fit within the visible area of the element.
- You can use the arrow keys, vi keys (if enabled), or mouse wheel to scroll the content.
- The scrollbar can be customized using the `scrollbar` option.
- The `alwaysScroll` option is useful when you want the element to always scroll to the bottom when new content is added.