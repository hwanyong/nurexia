# FileManager

The FileManager widget provides a file browser interface that allows users to navigate through directories and select files. It displays a list of files and directories, and supports operations like changing directories, selecting files, and executing custom commands.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a file manager
const fileManager = blessed.filemanager({
  top: 'center',
  left: 'center',
  width: '80%',
  height: '80%',
  border: {
    type: 'line'
  },
  style: {
    selected: {
      bg: 'blue',
      fg: 'white'
    },
    item: {
      fg: 'white'
    },
    border: {
      fg: 'green'
    }
  },
  label: ' File Manager ',
  cwd: process.cwd(),
  keys: true,
  vi: true,
  mouse: true,
  scrollbar: {
    ch: ' ',
    track: {
      bg: 'gray'
    },
    style: {
      inverse: true
    }
  }
});

// Append the file manager to the screen
screen.append(fileManager);

// Focus on the file manager
fileManager.focus();

// Handle file selection
fileManager.on('file', function(file) {
  console.log('Selected file:', file);
});

// Handle directory selection
fileManager.on('directory', function(dir) {
  console.log('Selected directory:', dir);
});

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.filemanager(options)`

Creates a new file manager element.

**Parameters:**

- `options` (Object): Configuration options for the file manager

## Options

The FileManager widget inherits all options from the List element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `cwd` | String | Current working directory. Default: `process.cwd()` |
| `root` | String | Root directory. Default: `/` |
| `hidden` | Boolean | Whether to show hidden files. Default: `false` |
| `showDotFiles` | Boolean | Whether to show dot files. Default: `false` |
| `showParent` | Boolean | Whether to show the parent directory (..). Default: `true` |
| `label` | String | Label for the file manager |
| `keys` | Boolean/Array | Use pre-defined keys (i.e. up, down, enter) to navigate the file manager. Default: `false` |
| `vi` | Boolean | Use vi keys with the keys option. Default: `false` |
| `mouse` | Boolean | Whether to enable mouse support for this element. Default: `false` |
| `scrollbar` | Object | Object enabling a scrollbar |

### Inherited Options

The FileManager widget inherits all options from the List element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `style.selected` | Object | Style for the selected item |
| `style.item` | Object | Style for list items |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The FileManager widget inherits all properties from the List element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `cwd` | String | Current working directory |
| `root` | String | Root directory |
| `hidden` | Boolean | Whether hidden files are shown |
| `showDotFiles` | Boolean | Whether dot files are shown |
| `showParent` | Boolean | Whether the parent directory (..) is shown |
| `files` | Array | Array of files in the current directory |
| `selected` | Number | Index of the selected file |
| `value` | String | Path of the selected file |

## Methods

The FileManager widget inherits all methods from the List element and adds the following:

### Directory Navigation

#### `fileManager.refresh(cwd, callback)`

Refreshes the file list for the specified directory.

**Parameters:**

- `cwd` (String): Directory to refresh. Default: current working directory
- `callback` (Function): Function to call when refresh is complete

#### `fileManager.pick(cwd, callback)`

Picks a file or directory.

**Parameters:**

- `cwd` (String): Directory to pick from. Default: current working directory
- `callback` (Function): Function to call when a file or directory is picked

#### `fileManager.reset(cwd, callback)`

Resets the file manager to the specified directory.

**Parameters:**

- `cwd` (String): Directory to reset to. Default: current working directory
- `callback` (Function): Function to call when reset is complete

#### `fileManager.setPath(path)`

Sets the current path.

**Parameters:**

- `path` (String): Path to set

#### `fileManager.up()`

Navigates to the parent directory.

#### `fileManager.cd(path)`

Changes the current directory.

**Parameters:**

- `path` (String): Directory to change to

### File Operations

#### `fileManager.hide(file)`

Hides a file from the list.

**Parameters:**

- `file` (String): File to hide

#### `fileManager.show(file)`

Shows a file in the list.

**Parameters:**

- `file` (String): File to show

#### `fileManager.isDirectory(file)`

Checks if a file is a directory.

**Parameters:**

- `file` (String): File to check

**Returns:**

- Boolean: Whether the file is a directory

#### `fileManager.isFile(file)`

Checks if a file is a regular file.

**Parameters:**

- `file` (String): File to check

**Returns:**

- Boolean: Whether the file is a regular file

### Selection Management

#### `fileManager.select(index)`

Selects a file at the specified index.

**Parameters:**

- `index` (Number): Index of the file to select

#### `fileManager.move(offset)`

Moves the selection by the specified offset.

**Parameters:**

- `offset` (Number): The offset to move the selection by

#### `fileManager.up(amount)`

Moves the selection up by the specified amount.

**Parameters:**

- `amount` (Number): The amount to move the selection up by. Default: `1`

#### `fileManager.down(amount)`

Moves the selection down by the specified amount.

**Parameters:**

- `amount` (Number): The amount to move the selection down by. Default: `1`

### Focus Management

#### `fileManager.focus()`

Focuses on the file manager.

## Events

The FileManager widget inherits all events from the List element and adds the following:

| Event | Description |
|-------|-------------|
| `cd` | Emitted when the current directory is changed |
| `file` | Emitted when a file is selected |
| `directory` | Emitted when a directory is selected |
| `error` | Emitted when an error occurs |
| `refresh` | Emitted when the file list is refreshed |
| `action` | Emitted when any action is performed on the file manager |
| `keypress` | Emitted when a key is pressed while the file manager is focused |

## Notes

- The FileManager widget provides a file browser interface that allows users to navigate through directories and select files.
- It displays a list of files and directories, and supports operations like changing directories, selecting files, and executing custom commands.
- The file manager can be navigated using the arrow keys, vi keys (if enabled), or the mouse.
- The `style.selected` option can be used to customize the appearance of the selected file.
- The `cwd` option sets the initial directory to display.
- The `root` option sets the root directory, which the file manager cannot navigate above.
- The `hidden` and `showDotFiles` options control whether hidden files and dot files are displayed.
- The `showParent` option controls whether the parent directory (..) is displayed.
- The FileManager widget extends the List widget, so it inherits all of its options, methods, and events.
- The file manager can be customized with different borders, colors, and styles to match the look and feel of your application.