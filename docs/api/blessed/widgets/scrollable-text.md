# ScrollableText

The ScrollableText widget is a specialized version of the ScrollableBox widget that is optimized for displaying large amounts of text content with scrolling capabilities.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a scrollable text box
const scrollableText = blessed.scrollabletext({
  top: 'center',
  left: 'center',
  width: '80%',
  height: '70%',
  content: 'This is a scrollable text box. You can use the arrow keys or mouse wheel to scroll.\n\n' +
           'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(100),
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
  mouse: true,
  alwaysScroll: true
});

// Append the scrollable text to the screen
screen.append(scrollableText);

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Focus on the scrollable text
scrollableText.focus();

// Render the screen
screen.render();
```

## Constructor

### `blessed.scrollabletext(options)`

Creates a new scrollable text element.

**Parameters:**

- `options` (Object): Configuration options for the scrollable text

## Options

The ScrollableText widget inherits all options from the ScrollableBox element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `mouse` | Boolean/Function | Whether to enable automatic mouse support for this element. Default: `false` |
| `keys` | Boolean/Array | Use pre-defined keys (i.e. up, down) to navigate the scrollable content. Default: `false` |
| `vi` | Boolean | Use vi keys with the keys option. Default: `false` |

### Inherited Options

The ScrollableText widget inherits all options from the ScrollableBox element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `content` | String | Element's text content |
| `tags` | Boolean | Whether to parse tags in content |
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `scrollbar` | Object | Object enabling a scrollbar |
| `alwaysScroll` | Boolean | Whether to always scroll regardless of childOffset |
| `baseLimit` | Number | A limit to the childBase |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The ScrollableText widget inherits all properties from the ScrollableBox element.

## Methods

The ScrollableText widget inherits all methods from the ScrollableBox element.

### Content Management

#### `scrollabletext.setContent(content)`

Sets the content of the scrollable text.

**Parameters:**

- `content` (String): The content to set

#### `scrollabletext.getContent()`

Gets the content of the scrollable text.

**Returns:**

- String: The content of the scrollable text

### Scrolling

#### `scrollabletext.scroll(offset, always)`

Scrolls the content by the given offset.

**Parameters:**

- `offset` (Number): The number of lines to scroll by (positive for down, negative for up)
- `always` (Boolean): Whether to scroll even if the offset is out of bounds

#### `scrollabletext.scrollTo(index)`

Scrolls the content to the given index.

**Parameters:**

- `index` (Number): The line index to scroll to

#### `scrollabletext.setScroll(index)`

Sets the scroll index.

**Parameters:**

- `index` (Number): The line index to set

#### `scrollabletext.resetScroll()`

Resets the scroll index to 0.

## Events

The ScrollableText widget inherits all events from the ScrollableBox element:

| Event | Description |
|-------|-------------|
| `scroll` | Emitted when the element is scrolled |
| `click` | Emitted when the element is clicked |
| `mouseover` | Emitted when the mouse moves over the element |
| `mouseout` | Emitted when the mouse moves out of the element |
| `mousedown` | Emitted when a mouse button is pressed on the element |
| `mouseup` | Emitted when a mouse button is released on the element |
| `keypress` | Emitted when a key is pressed while the element is focused |

## Notes

- The ScrollableText widget is optimized for displaying large amounts of text content.
- It's similar to the ScrollableBox widget but is specifically designed for text content.
- You can use the arrow keys, vi keys (if enabled), or mouse wheel to scroll the content.
- The scrollbar can be customized using the `scrollbar` option.
- The `alwaysScroll` option is useful when you want the element to always scroll to the bottom when new content is added.
- If you need to display text with more complex formatting or layout, consider using a ScrollableBox with custom content instead.