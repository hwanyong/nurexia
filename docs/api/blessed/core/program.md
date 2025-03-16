# Program

The Program is a low-level terminal interface that handles terminal capabilities, cursor movement, colors, and other terminal-specific operations. It's the foundation upon which the rest of the blessed library is built.

## Example

```javascript
const blessed = require('blessed');

// Create a program object
const program = blessed.program({
  input: process.stdin,
  output: process.stdout
});

// Move cursor to position (10, 5)
program.move(10, 5);

// Write text with color
program.bg('blue');
program.fg('white');
program.write('Hello, world!');

// Reset colors
program.bg('default');
program.fg('default');

// Exit program
program.clear();
program.disableMouse();
program.showCursor();
program.normalBuffer();
```

## Constructor

### `blessed.program(options)`

Creates a new program object.

**Parameters:**

- `options` (Object): Configuration options for the program

## Options

| Option | Type | Description |
|--------|------|-------------|
| `input` | Stream | Input stream. Default: `process.stdin` |
| `output` | Stream | Output stream. Default: `process.stdout` |
| `log` | String | Path to log file |
| `dump` | Boolean | Whether to dump data to the log file |
| `zero` | Boolean | Use 0,0 as the terminal coordinates |
| `buffer` | Boolean | Whether to use a buffer |
| `terminal` | String | Terminal name |
| `term` | String | Alias for `terminal` |
| `tput` | String | Path to the terminfo database |
| `debug` | Boolean | Enable debug mode |
| `resizeTimeout` | Boolean | Whether to use a timeout when handling resize events |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `input` | Stream | Input stream |
| `output` | Stream | Output stream |
| `zero` | Boolean | Whether to use 0,0 as the terminal coordinates |
| `useBuffer` | Boolean | Whether to use a buffer |
| `x` | Number | Current cursor x position |
| `y` | Number | Current cursor y position |
| `savedX` | Number | Saved cursor x position |
| `savedY` | Number | Saved cursor y position |
| `cols` | Number | Number of columns in the terminal |
| `rows` | Number | Number of rows in the terminal |
| `scrollTop` | Number | Top of the scroll region |
| `scrollBottom` | Number | Bottom of the scroll region |
| `isOSXTerm` | Boolean | Whether the terminal is an OSX Terminal |
| `isiTerm2` | Boolean | Whether the terminal is iTerm2 |
| `isXFCE` | Boolean | Whether the terminal is XFCE |
| `isTerminator` | Boolean | Whether the terminal is Terminator |
| `isLXDE` | Boolean | Whether the terminal is LXDE |
| `isVTE` | Boolean | Whether the terminal is VTE |
| `isRxvt` | Boolean | Whether the terminal is Rxvt |
| `isXterm` | Boolean | Whether the terminal is Xterm |
| `tmux` | Boolean | Whether the terminal is running in tmux |
| `tmuxVersion` | Number | tmux version if running in tmux |

## Methods

### Terminal Control

#### `program.clear()`

Clears the terminal screen.

#### `program.clearLine(n)`

Clears a line.

**Parameters:**

- `n` (Number): Line number (default: current line)

#### `program.clearLineRight(n)`

Clears a line from the cursor to the right.

**Parameters:**

- `n` (Number): Line number (default: current line)

#### `program.clearLineLeft(n)`

Clears a line from the cursor to the left.

**Parameters:**

- `n` (Number): Line number (default: current line)

#### `program.clearScreen()`

Clears the entire screen.

#### `program.clearScrollback()`

Clears the scrollback buffer.

### Cursor Control

#### `program.move(x, y)`

Moves the cursor to the specified position.

**Parameters:**

- `x` (Number): Column
- `y` (Number): Row

#### `program.omove(x, y)`

Moves the cursor to the specified position (relative to the origin).

**Parameters:**

- `x` (Number): Column
- `y` (Number): Row

#### `program.rposition()`

Returns the cursor position.

**Returns:**

- Object with `x` and `y` properties

#### `program.cursorUp(n)`

Moves the cursor up.

**Parameters:**

- `n` (Number): Number of lines (default: 1)

#### `program.cursorDown(n)`

Moves the cursor down.

**Parameters:**

- `n` (Number): Number of lines (default: 1)

#### `program.cursorForward(n)`

Moves the cursor forward.

**Parameters:**

- `n` (Number): Number of columns (default: 1)

#### `program.cursorBackward(n)`

Moves the cursor backward.

**Parameters:**

- `n` (Number): Number of columns (default: 1)

#### `program.cursorNextLine(n)`

Moves the cursor to the beginning of the next line.

**Parameters:**

- `n` (Number): Number of lines (default: 1)

#### `program.cursorPrecedingLine(n)`

Moves the cursor to the beginning of the previous line.

**Parameters:**

- `n` (Number): Number of lines (default: 1)

#### `program.cursorPosition(x, y)`

Moves the cursor to the specified position.

**Parameters:**

- `x` (Number): Column
- `y` (Number): Row

#### `program.cursorHidden()`

Hides the cursor.

#### `program.cursorVisible()`

Shows the cursor.

#### `program.hideCursor()`

Hides the cursor.

#### `program.showCursor()`

Shows the cursor.

#### `program.saveCursor()`

Saves the cursor position.

#### `program.restoreCursor()`

Restores the cursor position.

### Text Attributes

#### `program.text(attr, text)`

Writes text with the specified attributes.

**Parameters:**

- `attr` (String): Attributes (e.g., 'bold', 'underline')
- `text` (String): Text to write

#### `program.attr(attr)`

Sets the current text attributes.

**Parameters:**

- `attr` (String): Attributes (e.g., 'bold', 'underline')

#### `program.bold()`

Sets the text to bold.

#### `program.dim()`

Sets the text to dim.

#### `program.italic()`

Sets the text to italic.

#### `program.underline()`

Sets the text to underlined.

#### `program.blink()`

Sets the text to blinking.

#### `program.inverse()`

Sets the text to inverse (swaps foreground and background colors).

#### `program.hidden()`

Sets the text to hidden.

#### `program.strike()`

Sets the text to strikethrough.

#### `program.normal()`

Resets all text attributes.

### Colors

#### `program.fg(color)`

Sets the foreground color.

**Parameters:**

- `color` (String/Number): Color name or number

#### `program.bg(color)`

Sets the background color.

**Parameters:**

- `color` (String/Number): Color name or number

#### `program.foreground(color)`

Sets the foreground color.

**Parameters:**

- `color` (String/Number): Color name or number

#### `program.background(color)`

Sets the background color.

**Parameters:**

- `color` (String/Number): Color name or number

### Mouse Support

#### `program.enableMouse()`

Enables mouse events.

#### `program.disableMouse()`

Disables mouse events.

### Input/Output

#### `program.write(text)`

Writes text to the terminal.

**Parameters:**

- `text` (String): Text to write

#### `program.output(text)`

Writes text to the terminal.

**Parameters:**

- `text` (String): Text to write

#### `program.print(text)`

Writes text to the terminal followed by a newline.

**Parameters:**

- `text` (String): Text to write

#### `program.echo(text)`

Writes text to the terminal followed by a newline.

**Parameters:**

- `text` (String): Text to write

#### `program.inputHandler()`

Returns a function that handles input events.

**Returns:**

- Function that handles input events

### Terminal Modes

#### `program.alternateBuffer()`

Switches to the alternate buffer.

#### `program.normalBuffer()`

Switches to the normal buffer.

#### `program.applicationKeypad()`

Enables application keypad mode.

#### `program.numericKeypad()`

Enables numeric keypad mode.

#### `program.bracketedPaste()`

Enables bracketed paste mode.

#### `program.cursorShape(shape, blink)`

Sets the cursor shape.

**Parameters:**

- `shape` (String): Cursor shape ('block', 'underline', 'line')
- `blink` (Boolean): Whether the cursor should blink

### Events

| Event | Description |
|-------|-------------|
| `resize` | Emitted when the terminal is resized |
| `mouse` | Emitted when a mouse event occurs |
| `keypress` | Emitted when a key is pressed |
| `focus` | Emitted when the terminal window gains focus |
| `blur` | Emitted when the terminal window loses focus |

## Notes

- The Program object is usually created automatically by the Screen object, but it can be created manually for more low-level control.
- The Program object is responsible for handling terminal capabilities, which it does by parsing terminfo and termcap databases.
- When using the Program object directly, it's important to clean up properly by calling methods like `disableMouse()`, `showCursor()`, and `normalBuffer()` before exiting.