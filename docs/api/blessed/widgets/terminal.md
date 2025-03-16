# Terminal

The Terminal widget provides a terminal emulator within your blessed application. It allows you to spawn and interact with shell processes, run commands, and display their output.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a terminal
const terminal = blessed.terminal({
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
      fg: 'green'
    }
  },
  shell: process.env.SHELL || 'bash',
  args: [],
  env: process.env,
  cwd: process.cwd(),
  cursorBlink: true,
  scrollback: 1000,
  label: ' Terminal ',
  keys: true,
  mouse: true
});

// Append the terminal to the screen
screen.append(terminal);

// Focus on the terminal
terminal.focus();

// Handle terminal exit
terminal.on('exit', function() {
  screen.destroy();
  process.exit(0);
});

// Add a way to quit the program
screen.key(['escape', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.terminal(options)`

Creates a new terminal element.

**Parameters:**

- `options` (Object): Configuration options for the terminal

## Options

The Terminal widget inherits all options from the ScrollableBox element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `shell` | String | Shell to spawn. Default: `process.env.SHELL` or `'sh'` |
| `args` | Array | Arguments to pass to the shell. Default: `[]` |
| `env` | Object | Environment variables for the shell. Default: `process.env` |
| `cwd` | String | Current working directory for the shell. Default: `process.cwd()` |
| `cursorType` | String | Type of cursor: 'block', 'underline', or 'line'. Default: `'block'` |
| `cursorBlink` | Boolean | Whether the cursor blinks. Default: `false` |
| `scrollback` | Number | Number of lines to keep in the scrollback buffer. Default: `1000` |
| `controlKey` | Boolean | Whether to enable control key combinations. Default: `true` |
| `ignoreKeys` | Array | Array of keys to ignore |
| `label` | String | Label for the terminal |
| `keys` | Boolean/Array | Use pre-defined keys to navigate the terminal. Default: `false` |
| `mouse` | Boolean | Whether to enable mouse support for this element. Default: `false` |

### Inherited Options

The Terminal widget inherits all options from the ScrollableBox element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |
| `scrollbar` | Object | Object enabling a scrollbar |

## Properties

The Terminal widget inherits all properties from the ScrollableBox element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `shell` | String | Shell being used |
| `args` | Array | Arguments passed to the shell |
| `env` | Object | Environment variables for the shell |
| `cwd` | String | Current working directory for the shell |
| `pty` | Object | Pseudo-terminal instance |
| `cursor` | Object | Cursor object |
| `cursorType` | String | Type of cursor |
| `cursorBlink` | Boolean | Whether the cursor blinks |
| `scrollback` | Number | Number of lines in the scrollback buffer |
| `controlKey` | Boolean | Whether control key combinations are enabled |
| `ignoreKeys` | Array | Array of keys being ignored |

## Methods

The Terminal widget inherits all methods from the ScrollableBox element and adds the following:

### Terminal Management

#### `terminal.write(data)`

Writes data to the terminal.

**Parameters:**

- `data` (String): Data to write

#### `terminal.writeln(data)`

Writes data to the terminal followed by a newline.

**Parameters:**

- `data` (String): Data to write

#### `terminal.spawn(shell, args, options)`

Spawns a shell process.

**Parameters:**

- `shell` (String): Shell to spawn
- `args` (Array): Arguments to pass to the shell
- `options` (Object): Options for the shell

#### `terminal.kill()`

Kills the shell process.

#### `terminal.destroy()`

Destroys the terminal.

### Cursor Management

#### `terminal.cursorReset()`

Resets the cursor.

#### `terminal.cursorHome()`

Moves the cursor to the home position (0, 0).

#### `terminal.cursorPos(x, y)`

Moves the cursor to the specified position.

**Parameters:**

- `x` (Number): X coordinate
- `y` (Number): Y coordinate

#### `terminal.cursorForward(x)`

Moves the cursor forward by the specified amount.

**Parameters:**

- `x` (Number): Amount to move forward

#### `terminal.cursorBackward(x)`

Moves the cursor backward by the specified amount.

**Parameters:**

- `x` (Number): Amount to move backward

#### `terminal.cursorUp(y)`

Moves the cursor up by the specified amount.

**Parameters:**

- `y` (Number): Amount to move up

#### `terminal.cursorDown(y)`

Moves the cursor down by the specified amount.

**Parameters:**

- `y` (Number): Amount to move down

#### `terminal.cursorNextLine(y)`

Moves the cursor to the next line.

**Parameters:**

- `y` (Number): Number of lines to move down

#### `terminal.cursorPrevLine(y)`

Moves the cursor to the previous line.

**Parameters:**

- `y` (Number): Number of lines to move up

#### `terminal.cursorShow()`

Shows the cursor.

#### `terminal.cursorHide()`

Hides the cursor.

### Screen Management

#### `terminal.eraseInDisplay(n)`

Erases the display.

**Parameters:**

- `n` (Number): Type of erase operation

#### `terminal.eraseInLine(n)`

Erases the line.

**Parameters:**

- `n` (Number): Type of erase operation

#### `terminal.scrollUp(n)`

Scrolls up by the specified amount.

**Parameters:**

- `n` (Number): Amount to scroll up

#### `terminal.scrollDown(n)`

Scrolls down by the specified amount.

**Parameters:**

- `n` (Number): Amount to scroll down

#### `terminal.resetScroll()`

Resets the scroll position.

### Focus Management

#### `terminal.focus()`

Focuses on the terminal.

## Events

The Terminal widget inherits all events from the ScrollableBox element and adds the following:

| Event | Description |
|-------|-------------|
| `data` | Emitted when data is received from the shell |
| `title` | Emitted when the terminal title changes |
| `exit` | Emitted when the shell process exits |
| `error` | Emitted when an error occurs |
| `keypress` | Emitted when a key is pressed while the terminal is focused |
| `mouse` | Emitted when a mouse event occurs |
| `scroll` | Emitted when the terminal is scrolled |

## Notes

- The Terminal widget provides a terminal emulator within your blessed application.
- It allows you to spawn and interact with shell processes, run commands, and display their output.
- The terminal can be navigated using the keyboard and mouse.
- The `shell` option specifies the shell to spawn, defaulting to the user's shell or 'sh'.
- The `args` option allows you to pass arguments to the shell.
- The `env` option sets the environment variables for the shell.
- The `cwd` option sets the current working directory for the shell.
- The `cursorType` and `cursorBlink` options control the appearance of the cursor.
- The `scrollback` option sets the number of lines to keep in the scrollback buffer.
- The Terminal widget extends the ScrollableBox widget, so it inherits all of its options, methods, and events.
- The terminal can be customized with different borders, colors, and styles to match the look and feel of your application.