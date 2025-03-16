# ProgressBar

The ProgressBar widget displays a progress bar that can be updated to show the completion status of an operation. It is useful for indicating the progress of long-running tasks.

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
  width: '80%',
  height: '50%',
  content: 'Press the button to start the progress bar.',
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

// Create a button to trigger the progress bar
const button = blessed.button({
  parent: box,
  top: 'center',
  left: 'center',
  width: 'shrink',
  height: 'shrink',
  content: 'Start Progress',
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

// Create a progress bar
const progressBar = blessed.progressbar({
  parent: box,
  top: 'center',
  left: 'center',
  width: '80%',
  height: 3,
  border: {
    type: 'line'
  },
  style: {
    fg: 'blue',
    bg: 'black',
    border: {
      fg: 'green'
    },
    bar: {
      bg: 'green'
    }
  },
  orientation: 'horizontal',
  pch: '█',
  filled: 0,
  hidden: true
});

// Append the box to the screen
screen.append(box);

// Focus on the button
button.focus();

// Handle button press
button.on('press', function() {
  // Show the progress bar
  progressBar.hidden = false;
  box.content = 'Progress: 0%';
  screen.render();

  // Simulate progress
  let progress = 0;
  const interval = setInterval(function() {
    progress += 5;
    progressBar.setProgress(progress);
    box.content = `Progress: ${progress}%`;
    screen.render();

    if (progress >= 100) {
      clearInterval(interval);
      box.content = 'Progress complete!';
      setTimeout(function() {
        progressBar.hidden = true;
        box.content = 'Press the button to start the progress bar.';
        screen.render();
      }, 1000);
    }
  }, 200);
});

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.progressbar(options)`

Creates a new progress bar element.

**Parameters:**

- `options` (Object): Configuration options for the progress bar

## Options

The ProgressBar widget inherits all options from the Box element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `orientation` | String | Orientation of the progress bar: 'horizontal' or 'vertical'. Default: `'horizontal'` |
| `pch` | String | Character to use for the progress bar. Default: `'█'` |
| `filled` | Number | Initial filled percentage. Default: `0` |
| `value` | Number | Initial value (same as filled). Default: `0` |
| `style.bar` | Object | Style for the progress bar |
| `keys` | Boolean/Array | Use pre-defined keys to control the progress bar. Default: `false` |
| `mouse` | Boolean | Whether to enable mouse support for this element. Default: `false` |

### Inherited Options

The ProgressBar widget inherits all options from the Box element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The ProgressBar widget inherits all properties from the Box element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `orientation` | String | Orientation of the progress bar |
| `pch` | String | Character used for the progress bar |
| `filled` | Number | Filled percentage |
| `value` | Number | Current value (same as filled) |

## Methods

The ProgressBar widget inherits all methods from the Box element and adds the following:

### Progress Management

#### `progressBar.setProgress(percent)`

Sets the progress of the progress bar.

**Parameters:**

- `percent` (Number): The progress percentage (0-100)

#### `progressBar.setProgress(percent, text)`

Sets the progress of the progress bar and updates the text.

**Parameters:**

- `percent` (Number): The progress percentage (0-100)
- `text` (String): The text to display

#### `progressBar.progress(percent)`

Sets the progress of the progress bar (alias for setProgress).

**Parameters:**

- `percent` (Number): The progress percentage (0-100)

#### `progressBar.reset()`

Resets the progress bar to 0%.

### Focus Management

#### `progressBar.focus()`

Focuses on the progress bar.

## Events

The ProgressBar widget inherits all events from the Box element and adds the following:

| Event | Description |
|-------|-------------|
| `progress` | Emitted when the progress changes |
| `complete` | Emitted when the progress reaches 100% |
| `keypress` | Emitted when a key is pressed while the progress bar is focused |

## Notes

- The ProgressBar widget displays a progress bar that can be updated to show the completion status of an operation.
- It is useful for indicating the progress of long-running tasks.
- The progress bar can be updated with the `setProgress` method.
- The `orientation` option sets the orientation of the progress bar, which can be 'horizontal' or 'vertical'.
- The `pch` option allows you to customize the character used for the progress bar.
- The `filled` option sets the initial filled percentage.
- The `style.bar` option allows you to customize the appearance of the progress bar.
- The ProgressBar widget extends the Box widget, so it inherits all of its options, methods, and events.
- The progress bar can be customized with different borders, colors, and styles to match the look and feel of your application.