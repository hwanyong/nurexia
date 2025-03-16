# ListBar

The ListBar widget creates a horizontal bar with selectable items, similar to a menu bar. Each item can have an associated command or function that is executed when the item is selected.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a list bar
const listbar = blessed.listbar({
  top: 0,
  left: 0,
  width: '100%',
  height: 3,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'blue',
    border: {
      fg: 'white'
    },
    selected: {
      bg: 'green',
      fg: 'white'
    },
    item: {
      bg: 'blue',
      fg: 'white'
    }
  },
  commands: {
    'File': {
      keys: ['f'],
      callback: function() {
        console.log('File selected');
      }
    },
    'Edit': {
      keys: ['e'],
      callback: function() {
        console.log('Edit selected');
      }
    },
    'View': {
      keys: ['v'],
      callback: function() {
        console.log('View selected');
      }
    },
    'Help': {
      keys: ['h'],
      callback: function() {
        console.log('Help selected');
      }
    },
    'Quit': {
      keys: ['q'],
      callback: function() {
        screen.destroy();
        process.exit(0);
      }
    }
  },
  mouse: true,
  keys: true,
  autoCommandKeys: true
});

// Append the list bar to the screen
screen.append(listbar);

// Focus on the list bar
listbar.focus();

// Add a way to quit the program
screen.key(['escape', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.listbar(options)`

Creates a new list bar element.

**Parameters:**

- `options` (Object): Configuration options for the list bar

## Options

The ListBar widget inherits all options from the Box element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `commands` | Object | Object containing commands for the list bar |
| `items` | Array | Array of items for the list bar (alternative to commands) |
| `autoCommandKeys` | Boolean | Whether to automatically assign keys to commands. Default: `false` |
| `prefix` | String | Prefix for command keys. Default: `''` |
| `style.selected` | Object | Style for the selected item |
| `style.item` | Object | Style for list bar items |
| `mouse` | Boolean | Whether to enable mouse support for this element. Default: `false` |
| `keys` | Boolean/Array | Use pre-defined keys (i.e. left, right) to navigate the list bar. Default: `false` |
| `vi` | Boolean | Use vi keys with the keys option. Default: `false` |

### Inherited Options

The ListBar widget inherits all options from the Box element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The ListBar widget inherits all properties from the Box element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `items` | Array | Array of items in the list bar |
| `commands` | Object | Object containing commands for the list bar |
| `selected` | Number | Index of the selected item |
| `value` | String | Value of the selected item |

## Methods

The ListBar widget inherits all methods from the Box element and adds the following:

### Item Management

#### `listbar.setItems(items)`

Sets the list bar items.

**Parameters:**

- `items` (Array/Object): Array or object of items to set

#### `listbar.addItem(item)`

Adds an item to the list bar.

**Parameters:**

- `item` (Object): Item to add

#### `listbar.addCommand(item)`

Adds a command to the list bar.

**Parameters:**

- `item` (Object): Command to add

#### `listbar.removeItem(index)`

Removes an item from the list bar at the specified index.

**Parameters:**

- `index` (Number): Index of the item to remove

#### `listbar.clearItems()`

Clears all items from the list bar.

#### `listbar.getItem(index)`

Gets an item from the list bar at the specified index.

**Parameters:**

- `index` (Number): Index of the item to get

**Returns:**

- Object: The item at the specified index

### Selection Management

#### `listbar.select(index)`

Selects an item in the list bar at the specified index.

**Parameters:**

- `index` (Number): Index of the item to select

#### `listbar.move(offset)`

Moves the selection by the specified offset.

**Parameters:**

- `offset` (Number): The offset to move the selection by

#### `listbar.moveLeft(amount)`

Moves the selection left by the specified amount.

**Parameters:**

- `amount` (Number): The amount to move the selection left by. Default: `1`

#### `listbar.moveRight(amount)`

Moves the selection right by the specified amount.

**Parameters:**

- `amount` (Number): The amount to move the selection right by. Default: `1`

#### `listbar.selectTab(index)`

Selects a tab in the list bar at the specified index.

**Parameters:**

- `index` (Number): Index of the tab to select

### Focus Management

#### `listbar.focus()`

Focuses on the list bar.

## Events

The ListBar widget inherits all events from the Box element and adds the following:

| Event | Description |
|-------|-------------|
| `select` | Emitted when an item is selected |
| `action` | Emitted when any action is performed on the list bar |
| `cancel` | Emitted when selection is cancelled (Escape key) |
| `keypress` | Emitted when a key is pressed while the list bar is focused |

## Notes

- The ListBar widget creates a horizontal bar with selectable items, similar to a menu bar.
- Each item can have an associated command or function that is executed when the item is selected.
- The list bar can be navigated using the left and right arrow keys, vi keys (if enabled), or the mouse.
- The `style.selected` option can be used to customize the appearance of the selected item.
- The `autoCommandKeys` option automatically assigns keys to commands based on the first letter of the command name.
- The ListBar widget extends the Box widget, so it inherits all of its options, methods, and events.
- The list bar can be customized with different borders, colors, and styles to match the look and feel of your application.
- The `commands` option is an object where each key is the name of a command and each value is an object with `keys` and `callback` properties.