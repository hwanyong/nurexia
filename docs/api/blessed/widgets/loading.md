# Loading

The Loading widget displays a loading indicator with a message. It is useful for showing progress or indicating that an operation is in progress.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a box for the main content
const box = blessed.box({
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  content: 'Press the button to show a loading indicator.',
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: 'blue'
    }
  }
});

// Create a button to trigger the loading
const button = blessed.button({
  parent: box,
  top: 'center',
  left: 'center',
  width: 'shrink',
  height: 'shrink',
  content: 'Show Loading',
  padding: {
    left: 1,
    right: 1
  },
  style: {
    fg: 'white',
    bg: 'green',
    focus: {
      bg: 'red'
    }
  }
});

// Append the box to the screen
screen.append(box);

// Focus on the button
button.focus();

// Handle button press
button.on('press', function() {
  // Create a loading indicator
  const loading = blessed.loading({
    top: 'center',
    left: 'center',
    width: '50%',
    height: 5,
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
    keys: true,
    mouse: true,
    title: 'Loading'
  });

  // Append the loading to the screen
  screen.append(loading);

  // Start the loading indicator
  loading.load('Loading, please wait...');

  // Simulate a long operation
  setTimeout(function() {
    // Stop the loading indicator
    loading.stop();

    // Remove the loading indicator
    loading.detach();

    // Update the box content
    box.content = 'Loading complete!';

    // Focus on the box
    box.focus();

    // Render the screen
    screen.render();
  }, 3000);

  // Render the screen
  screen.render();
});

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.loading(options)`

Creates a new loading element.

**Parameters:**

- `options` (Object): Configuration options for the loading

## Options

The Loading widget inherits all options from the Box element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `title` | String | Title for the loading dialog |
| `pch` | String | Character to use for the loading indicator. Default: `'█'` |
| `text` | String | Initial text to display |
| `keys` | Boolean/Array | Use pre-defined keys to control the loading. Default: `false` |
| `mouse` | Boolean | Whether to enable mouse support for this element. Default: `false` |
| `interval` | Number | Interval for the loading animation in milliseconds. Default: `200` |

### Inherited Options

The Loading widget inherits all options from the Box element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The Loading widget inherits all properties from the Box element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `text` | String | The loading text |
| `title` | String | Title for the loading dialog |
| `pch` | String | Character used for the loading indicator |
| `interval` | Number | Interval for the loading animation in milliseconds |
| `running` | Boolean | Whether the loading indicator is running |

## Methods

The Loading widget inherits all methods from the Box element and adds the following:

### Loading Management

#### `loading.load(text)`

Starts the loading indicator with the specified text.

**Parameters:**

- `text` (String): The loading text

#### `loading.stop()`

Stops the loading indicator.

#### `loading.setProgress(percent)`

Sets the progress of the loading indicator.

**Parameters:**

- `percent` (Number): The progress percentage (0-100)

#### `loading.setText(text)`

Sets the loading text.

**Parameters:**

- `text` (String): The loading text

#### `loading.reset()`

Resets the loading indicator.

### Focus Management

#### `loading.focus()`

Focuses on the loading.

## Events

The Loading widget inherits all events from the Box element and adds the following:

| Event | Description |
|-------|-------------|
| `start` | Emitted when the loading indicator starts |
| `stop` | Emitted when the loading indicator stops |
| `progress` | Emitted when the progress changes |
| `keypress` | Emitted when a key is pressed while the loading is focused |

## Notes

- The Loading widget displays a loading indicator with a message.
- It is useful for showing progress or indicating that an operation is in progress.
- The loading indicator can be started with the `load` method and stopped with the `stop` method.
- The `text` option sets the initial text to display.
- The `title` option sets the title of the loading dialog.
- The `pch` option allows you to customize the character used for the loading indicator.
- The `interval` option sets the interval for the loading animation in milliseconds.
- The Loading widget extends the Box widget, so it inherits all of its options, methods, and events.
- The loading dialog can be customized with different borders, colors, and styles to match the look and feel of your application.