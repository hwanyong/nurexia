# Screen

The Screen is the main container for all elements in a blessed application. It represents the terminal window and handles rendering, input, and other global operations.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true,
  title: 'My Terminal App'
});

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.screen(options)`

Creates a new screen object.

**Parameters:**

- `options` (Object): Configuration options for the screen

## Options

| Option | Type | Description |
|--------|------|-------------|
| `program` | Object | The blessed Program to be associated with. Will be automatically instantiated if none is provided. |
| `smartCSR` | Boolean | Attempt to perform CSR optimization on all possible elements. This is known to cause flickering with elements that are not full-width, however, it is more optimal for terminal rendering. Default: `false` |
| `fastCSR` | Boolean | Do CSR on any element within 20 cols of the screen edge on either side. Faster than smartCSR, but may cause flickering. Default: `false` |
| `useBCE` | Boolean | Attempt to perform back_color_erase optimizations for terminals that support it. Default: `false` |
| `resizeTimeout` | Number | Amount of time (in ms) to redraw the screen after the terminal is resized. Default: `300` |
| `tabSize` | Number | The width of tabs within an element's content. Default: `8` |
| `autoPadding` | Boolean | Automatically position child elements with border and padding in mind. Default: `false` |
| `cursor` | Object | Cursor options (see below) |
| `log` | String | Create a log file at the specified path |
| `dump` | String/Boolean | Dump all output and input to the specified file |
| `debug` | Boolean | Debug mode. Enables usage of the debug method and creates a debug console. Default: `false` |
| `ignoreLocked` | Array | Array of keys to ignore when keys are locked |
| `dockBorders` | Boolean | Automatically "dock" borders with other elements instead of overlapping. Default: `false` |
| `ignoreDockContrast` | Boolean | Allow dockable borders to dock regardless of their colors/attributes. Default: `false` |
| `fullUnicode` | Boolean | Allow for rendering of East Asian double-width characters, utf-16 surrogate pairs, and unicode combining characters. Default: `false` |
| `sendFocus` | Boolean | Send focus events after mouse is enabled. Default: `false` |
| `warnings` | Boolean | Display warnings in the debug console. Default: `false` |
| `forceUnicode` | Boolean | Force blessed to use unicode even if it is not detected. Default: `null` |
| `input` | Stream | Input stream. Default: `process.stdin` |
| `output` | Stream | Output stream. Default: `process.stdout` |
| `title` | String | Window title |
| `terminal` | String | Terminal name |
| `width` | Number/String | Width of the screen |
| `height` | Number/String | Height of the screen |

### Cursor Options

| Option | Type | Description |
|--------|------|-------------|
| `artificial` | Boolean | Have blessed draw a custom cursor and hide the terminal cursor |
| `shape` | String | Shape of the cursor. Can be: `block`, `underline`, or `line` |
| `blink` | Boolean | Whether the cursor blinks |
| `color` | String | Color of the cursor |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `program` | Object | The Program object associated with this screen |
| `width` | Number | Width of the screen (same as `program.cols`) |
| `height` | Number | Height of the screen (same as `program.rows`) |
| `cols` | Number | Same as `screen.width` |
| `rows` | Number | Same as `screen.height` |
| `title` | String | Window title |
| `focused` | Element | The currently focused element |
| `terminal` | String | Terminal name |
| `cursor` | Object | Cursor options |
| `grabKeys` | Boolean | Whether the focused element grabs all keypresses |
| `lockKeys` | Boolean | Prevent keypresses from being received by any element |
| `hover` | Element | The currently hovered element |

## Methods

### Event Handling

#### `screen.on(event, callback)`

Registers an event listener.

**Parameters:**

- `event` (String): Event name
- `callback` (Function): Function to call when the event occurs

#### `screen.key(keys, callback)`

Registers a key event listener.

**Parameters:**

- `keys` (Array/String): Key or array of keys to listen for
- `callback` (Function): Function to call when the key is pressed

### Element Management

#### `screen.append(element)`

Appends an element to the screen.

**Parameters:**

- `element` (Element): The element to append

#### `screen.remove(element)`

Removes an element from the screen.

**Parameters:**

- `element` (Element): The element to remove

#### `screen.insertBefore(element, other)`

Inserts an element before another element.

**Parameters:**

- `element` (Element): The element to insert
- `other` (Element): The element to insert before

#### `screen.insertAfter(element, other)`

Inserts an element after another element.

**Parameters:**

- `element` (Element): The element to insert
- `other` (Element): The element to insert after

#### `screen.append(element)`

Appends an element to the screen.

**Parameters:**

- `element` (Element): The element to append

### Rendering

#### `screen.render()`

Renders the screen and all its children.

#### `screen.clearRegion(x1, x2, y1, y2)`

Clears a region of the screen.

**Parameters:**

- `x1` (Number): Left coordinate
- `x2` (Number): Right coordinate
- `y1` (Number): Top coordinate
- `y2` (Number): Bottom coordinate

### Focus Management

#### `screen.focus([element])`

Focuses on the given element or the first focusable element if none is provided.

**Parameters:**

- `element` (Element, optional): The element to focus

#### `screen.focusNext()`

Focuses on the next focusable element.

#### `screen.focusPrevious()`

Focuses on the previous focusable element.

### Utility Methods

#### `screen.log()`

Logs data to the log file if one was created.

**Parameters:**

- `...args` (Any): Data to log

#### `screen.debug()`

Logs data to the debug console if debug mode is enabled.

**Parameters:**

- `...args` (Any): Data to log

#### `screen.destroy()`

Destroys the screen and cleans up resources.

## Events

| Event | Description |
|-------|-------------|
| `resize` | Emitted when the terminal is resized |
| `mouse` | Emitted when a mouse event occurs |
| `keypress` | Emitted when a key is pressed |
| `focus` | Emitted when the terminal window gains focus |
| `blur` | Emitted when the terminal window loses focus |
| `prerender` | Emitted before rendering |
| `render` | Emitted after rendering |
| `destroy` | Emitted when the screen is destroyed |

## Notes

- It is recommended to use either `smartCSR` or `fastCSR` as a screen option. This will enable CSR when scrolling text in elements or when manipulating lines.
- The `autoPadding` option is recommended for most applications. It may become the default in future versions.
- For best performance, avoid using `fullUnicode` unless you need to display East Asian double-width characters, utf-16 surrogate pairs, or unicode combining characters.