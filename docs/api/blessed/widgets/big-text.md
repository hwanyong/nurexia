# BigText

The BigText widget displays text in a large font made up of ASCII characters. It's useful for creating headers, titles, or other text that needs to stand out in your terminal application.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a big text widget
const bigText = blessed.bigtext({
  top: 'center',
  left: 'center',
  width: '80%',
  height: '50%',
  content: 'Hello!',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'green',
    bg: 'black',
    border: {
      fg: '#f0f0f0'
    }
  },
  fch: '░', // foreground character
  bch: ' '  // background character
});

// Append the big text to the screen
screen.append(bigText);

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.bigtext(options)`

Creates a new big text element.

**Parameters:**

- `options` (Object): Configuration options for the big text

## Options

The BigText widget inherits all options from the Box element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `content` | String | The text content to display in big text |
| `fch` | String | The foreground character to use for drawing the big text. Default: `'█'` |
| `bch` | String | The background character to use for drawing the big text. Default: `' '` |
| `font` | String | The font to use. Available fonts: `'block'` (default), `'simple'`, `'grid'`, `'paging'`, `'tiny'` |

### Inherited Options

The BigText widget inherits all options from the Box element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `tags` | Boolean | Whether to parse tags in content |
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The BigText widget inherits all properties from the Box element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `fch` | String | The foreground character used for drawing the big text |
| `bch` | String | The background character used for drawing the big text |
| `font` | String | The font used for the big text |

## Methods

The BigText widget inherits all methods from the Box element and adds the following:

### Content Management

#### `bigtext.setContent(content)`

Sets the content of the big text.

**Parameters:**

- `content` (String): The content to set

#### `bigtext.getContent()`

Gets the content of the big text.

**Returns:**

- String: The content of the big text

### Font Management

#### `bigtext.setFont(font)`

Sets the font for the big text.

**Parameters:**

- `font` (String): The font to use. Available fonts: `'block'` (default), `'simple'`, `'grid'`, `'paging'`, `'tiny'`

## Events

The BigText widget inherits all events from the Box element:

| Event | Description |
|-------|-------------|
| `click` | Emitted when the big text is clicked |
| `mouseover` | Emitted when the mouse moves over the big text |
| `mouseout` | Emitted when the mouse moves out of the big text |
| `mousedown` | Emitted when a mouse button is pressed on the big text |
| `mouseup` | Emitted when a mouse button is released on the big text |
| `keypress` | Emitted when a key is pressed while the big text is focused |

## Notes

- The BigText widget uses ASCII characters to create large text displays.
- The size of the text depends on the size of the widget. If the widget is too small, the text may not be displayed correctly.
- The `fch` and `bch` options allow you to customize the appearance of the big text. For example, you can use `'█'` for a solid foreground and `' '` for an empty background, or `'░'` for a lighter foreground and `'▓'` for a darker background.
- The `font` option allows you to choose from several built-in fonts. The default font is `'block'`.
- The BigText widget is not suitable for displaying large amounts of text. It's best used for headers, titles, or other short text that needs to stand out.