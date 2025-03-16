# Log

The Log widget is a scrollable text area that automatically scrolls to the bottom when new content is added. It is useful for displaying log messages, output, or any continuously updating text content.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a log
const log = blessed.log({
  top: 'center',
  left: 'center',
  width: '80%',
  height: '80%',
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: 'blue'
    }
  },
  scrollback: 100,
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
  tags: true
});

// Append the log to the screen
screen.append(log);

// Focus on the log
log.focus();

// Add some initial content
log.log('Log started.');
log.log('You can use {bold}tags{/bold} in log messages.');
log.log('Press any key to add more log entries.');
log.log('Press Escape or Ctrl+C to exit.');

// Add log entries on keypress
screen.key(['space'], function() {
  log.log(`New log entry at ${new Date().toLocaleTimeString()}`);
});

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Simulate log entries
let count = 0;
const interval = setInterval(function() {
  log.log(`Automatic log entry #${++count}`);
  if (count >= 20) {
    clearInterval(interval);
    log.log('Automatic logging complete.');
  }
}, 1000);

// Render the screen
screen.render();
```

## Constructor

### `blessed.log(options)`

Creates a new log element.

**Parameters:**

- `options` (Object): Configuration options for the log

## Options

The Log widget inherits all options from the ScrollableText element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `scrollback` | Number | Maximum number of lines to keep in the log. Default: `Infinity` |
| `scrollOnInput` | Boolean | Whether to scroll to the bottom on input. Default: `true` |
| `tags` | Boolean | Whether to parse tags in log messages. Default: `false` |
| `keys` | Boolean/Array | Use pre-defined keys (i.e. up, down, page up, page down) to navigate the log. Default: `false` |
| `vi` | Boolean | Use vi keys with the keys option. Default: `false` |
| `mouse` | Boolean | Whether to enable mouse support for this element. Default: `false` |
| `scrollbar` | Object | Object enabling a scrollbar |

### Inherited Options

The Log widget inherits all options from the ScrollableText element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |
| `alwaysScroll` | Boolean | Whether to always show the scrollbar. Default: `false` |

## Properties

The Log widget inherits all properties from the ScrollableText element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `scrollback` | Number | Maximum number of lines to keep in the log |
| `scrollOnInput` | Boolean | Whether to scroll to the bottom on input |
| `lines` | Array | Array of lines in the log |

## Methods

The Log widget inherits all methods from the ScrollableText element and adds the following:

### Log Management

#### `log.log(text)`

Adds a line of text to the log.

**Parameters:**

- `text` (String): The text to add

#### `log.add(text)`

Adds a line of text to the log (alias for log).

**Parameters:**

- `text` (String): The text to add

#### `log.clear()`

Clears the log.

#### `log.resetScroll()`

Resets the scroll position to the bottom.

### Scrolling

#### `log.scroll(offset)`

Scrolls the log by the specified offset.

**Parameters:**

- `offset` (Number): The offset to scroll by

#### `log.scrollTo(index)`

Scrolls the log to the specified index.

**Parameters:**

- `index` (Number): The index to scroll to

#### `log.setScrollPerc(percentage)`

Sets the scroll position to the specified percentage.

**Parameters:**

- `percentage` (Number): The percentage to scroll to (0-100)

#### `log.getScrollPerc()`

Gets the current scroll percentage.

**Returns:**

- Number: The current scroll percentage (0-100)

### Focus Management

#### `log.focus()`

Focuses on the log.

## Events

The Log widget inherits all events from the ScrollableText element and adds the following:

| Event | Description |
|-------|-------------|
| `log` | Emitted when a line is added to the log |
| `clear` | Emitted when the log is cleared |
| `scroll` | Emitted when the log is scrolled |
| `keypress` | Emitted when a key is pressed while the log is focused |

## Notes

- The Log widget is a scrollable text area that automatically scrolls to the bottom when new content is added.
- It is useful for displaying log messages, output, or any continuously updating text content.
- The log can be navigated using the arrow keys, vi keys (if enabled), or the mouse.
- The `scrollback` option limits the number of lines kept in the log, which can be useful for memory management.
- The `scrollOnInput` option controls whether the log automatically scrolls to the bottom when new content is added.
- The `tags` option enables the parsing of tags in log messages, allowing for styled text.
- The Log widget extends the ScrollableText widget, so it inherits all of its options, methods, and events.
- The log can be customized with different borders, colors, and styles to match the look and feel of your application.