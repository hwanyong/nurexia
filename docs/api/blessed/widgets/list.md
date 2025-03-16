# List

The List widget displays a scrollable list of items that can be selected. It is useful for creating menus, selection lists, and other interfaces where users need to choose from multiple options.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a list
const list = blessed.list({
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: 'blue'
    },
    selected: {
      bg: 'blue',
      fg: 'white'
    }
  },
  items: [
    'Item 1',
    'Item 2',
    'Item 3',
    'Item 4',
    'Item 5'
  ],
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

// Append the list to the screen
screen.append(list);

// Focus on the list
list.focus();

// Handle list selection
list.on('select', function(item, index) {
  screen.destroy();
  console.log('Selected item:', item, 'at index:', index);
  process.exit(0);
});

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.list(options)`

Creates a new list element.

**Parameters:**

- `options` (Object): Configuration options for the list

## Options

The List widget inherits all options from the ScrollableBox element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `items` | Array | Array of items to display in the list |
| `search` | Boolean | Whether to enable item searching. Default: `false` |
| `interactive` | Boolean | Whether the list is interactive (selectable). Default: `true` |
| `invertSelection` | Boolean | Whether to invert the selection style. Default: `false` |
| `style.selected` | Object | Style for the selected item |
| `style.item` | Object | Style for list items |
| `mouse` | Boolean | Whether to enable mouse support for this element. Default: `false` |
| `keys` | Boolean/Array | Use pre-defined keys (i.e. up, down) to navigate the list. Default: `false` |
| `vi` | Boolean | Use vi keys with the keys option. Default: `false` |
| `tags` | Boolean | Whether to parse tags in list items. Default: `false` |
| `scrollbar` | Object | Object enabling a scrollbar |

### Inherited Options

The List widget inherits all options from the ScrollableBox element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |
| `alwaysScroll` | Boolean | Whether to always show the scrollbar. Default: `false` |
| `baseLimit` | Number | Limit for the number of items to display at once |

## Properties

The List widget inherits all properties from the ScrollableBox element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `items` | Array | Array of items in the list |
| `ritems` | Array | Array of raw items (without tags) |
| `selected` | Number | Index of the selected item |
| `value` | String | Value of the selected item |
| `interactive` | Boolean | Whether the list is interactive (selectable) |
| `searching` | Boolean | Whether the list is in search mode |
| `searchText` | String | Current search text |

## Methods

The List widget inherits all methods from the ScrollableBox element and adds the following:

### Item Management

#### `list.setItems(items)`

Sets the list items.

**Parameters:**

- `items` (Array): Array of items to set

#### `list.addItem(item)`

Adds an item to the list.

**Parameters:**

- `item` (String): Item to add

#### `list.addItems(items)`

Adds multiple items to the list.

**Parameters:**

- `items` (Array): Array of items to add

#### `list.removeItem(index)`

Removes an item from the list at the specified index.

**Parameters:**

- `index` (Number): Index of the item to remove

#### `list.clearItems()`

Clears all items from the list.

#### `list.getItem(index)`

Gets an item from the list at the specified index.

**Parameters:**

- `index` (Number): Index of the item to get

**Returns:**

- String: The item at the specified index

#### `list.getItemIndex(item)`

Gets the index of an item in the list.

**Parameters:**

- `item` (String): Item to find

**Returns:**

- Number: The index of the item, or -1 if not found

### Selection Management

#### `list.select(index)`

Selects an item in the list at the specified index.

**Parameters:**

- `index` (Number): Index of the item to select

#### `list.move(offset)`

Moves the selection by the specified offset.

**Parameters:**

- `offset` (Number): The offset to move the selection by

#### `list.up(amount)`

Moves the selection up by the specified amount.

**Parameters:**

- `amount` (Number): The amount to move the selection up by. Default: `1`

#### `list.down(amount)`

Moves the selection down by the specified amount.

**Parameters:**

- `amount` (Number): The amount to move the selection down by. Default: `1`

#### `list.pick(callback)`

Picks the selected item, emitting the 'select' event.

**Parameters:**

- `callback` (Function): Function to call when an item is picked

### Search Management

#### `list.enterSearch()`

Enters search mode.

#### `list.exitSearch()`

Exits search mode.

#### `list.resetSearch()`

Resets the search text.

#### `list.search(text)`

Searches for an item in the list.

**Parameters:**

- `text` (String): Text to search for

### Focus Management

#### `list.focus()`

Focuses on the list.

## Events

The List widget inherits all events from the ScrollableBox element and adds the following:

| Event | Description |
|-------|-------------|
| `select` | Emitted when an item is selected (Enter key or double-click) |
| `select item` | Emitted when an item is selected (Enter key or double-click) |
| `cancel` | Emitted when selection is cancelled (Escape key) |
| `action` | Emitted when any action is performed on the list |
| `create item` | Emitted when an item is created |
| `add item` | Emitted when an item is added |
| `remove item` | Emitted when an item is removed |
| `keypress` | Emitted when a key is pressed while the list is focused |

## Notes

- The List widget displays a scrollable list of items that can be selected.
- It is useful for creating menus, selection lists, and other interfaces where users need to choose from multiple options.
- The list can be navigated using the arrow keys, vi keys (if enabled), or the mouse.
- The `style.selected` option can be used to customize the appearance of the selected item.
- The `search` option enables searching for items in the list by typing.
- The List widget extends the ScrollableBox widget, so it inherits all of its options, methods, and events.
- The list can be customized with different borders, colors, and styles to match the look and feel of your application.
- The `scrollbar` option can be used to customize the appearance of the scrollbar.