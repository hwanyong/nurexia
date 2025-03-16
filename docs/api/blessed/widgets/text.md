# Text

The Text widget is a simple element for displaying text in the terminal. Unlike the Box widget, it doesn't have borders or scrolling capabilities by default, making it more lightweight and suitable for displaying plain text content.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a text element
const text = blessed.text({
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  content: 'Hello world!',
  tags: true,
  style: {
    fg: 'white',
    bg: 'black',
  }
});

// Append the text to the screen
screen.append(text);

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.text(options)`

Creates a new text element.

**Parameters:**

- `options` (Object): Configuration options for the text element

## Options

The Text widget inherits all options from the Element class:

| Option | Type | Description |
|--------|------|-------------|
| `content` | String | Text content to display |
| `tags` | Boolean | Whether to parse tags in content |
| `wrap` | Boolean | Whether to wrap text content |
| `shrink` | Boolean | Shrink/flex/grow to content |

### Inherited Options

#### From Element

| Option | Type | Description |
|--------|------|-------------|
| `fg` | String | Foreground color |
| `bg` | String | Background color |
| `bold` | Boolean | Whether text is bold |
| `underline` | Boolean | Whether text is underlined |
| `style` | Object | Style object |
| `border` | Object/String | Border object or border type |
| `clickable` | Boolean | Whether the element is clickable |
| `input` | Boolean | Whether the element can receive input |
| `keyable` | Boolean | Whether the element is focusable and can receive key input |
| `focused` | Element | Element is focused |
| `hidden` | Boolean | Whether the element is hidden |
| `label` | String | A simple text label for the element |
| `hoverText` | String | A floating text label for the element which appears on mouseover |
| `align` | String | Text alignment: left, center, or right |
| `valign` | String | Vertical text alignment: top, middle, or bottom |
| `padding` | Number/Object | Amount of padding on the inside of the element |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `right` | Number/String | Right offset |
| `bottom` | Number/String | Bottom offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |
| `position` | Object | Can contain the above options |
| `ch` | String | Background character (default is whitespace) |
| `draggable` | Boolean | Allow the element to be dragged with the mouse |
| `shadow` | Boolean | Draw a translucent offset shadow behind the element |

#### From Node

| Option | Type | Description |
|--------|------|-------------|
| `name` | String | Name of the node |
| `screen` | Screen | Screen to which this node belongs |
| `parent` | Node | Parent node |
| `children` | Array | Array of child nodes |
| `focusable` | Boolean | Whether the node can be focused |

## Properties

The Text widget inherits all properties from the Element class.

## Methods

The Text widget inherits all methods from the Element class.

### Content Management

#### `text.setContent(content)`

Sets the content of the text element.

**Parameters:**

- `content` (String): The content to set

#### `text.getContent()`

Gets the content of the text element.

**Returns:**

- String: The content of the text element

### Rendering

#### `text.render()`

Renders the text element.

## Events

The Text widget inherits all events from the Element class:

| Event | Description |
|-------|-------------|
| `click` | Emitted when the text element is clicked |
| `mouseover` | Emitted when the mouse moves over the text element |
| `mouseout` | Emitted when the mouse moves out of the text element |
| `mousedown` | Emitted when a mouse button is pressed on the text element |
| `mouseup` | Emitted when a mouse button is released on the text element |
| `keypress` | Emitted when a key is pressed while the text element is focused |

## Notes

- The Text widget is one of the simplest elements in blessed and is primarily used for displaying text content.
- Unlike the Box widget, it doesn't have borders or scrolling capabilities by default.
- If you need to display text with scrolling capabilities, consider using the ScrollableText widget instead.
- For displaying large blocks of text, the Text widget may not be the best choice as it doesn't handle overflow well. Consider using a Box or ScrollableText widget instead.