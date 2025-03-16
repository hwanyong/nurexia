# ListTable

The ListTable widget is an extension of the List widget that displays tabular data with rows and columns. It provides a convenient way to display structured data in a table format with selectable rows.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a list table
const listTable = blessed.listtable({
  top: 'center',
  left: 'center',
  width: '80%',
  height: '70%',
  border: {
    type: 'line'
  },
  align: 'center',
  tags: true,
  keys: true,
  vi: true,
  mouse: true,
  style: {
    header: {
      fg: 'blue',
      bold: true
    },
    cell: {
      fg: 'white',
      selected: {
        bg: 'blue'
      }
    },
    border: {
      fg: 'white'
    }
  },
  // Column width as percentage or number of characters
  columnWidth: [20, 20, 20, 20],
  // Table data
  data: [
    ['Header 1', 'Header 2', 'Header 3', 'Header 4'],
    ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3', 'Row 1 Col 4'],
    ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3', 'Row 2 Col 4'],
    ['Row 3 Col 1', 'Row 3 Col 2', 'Row 3 Col 3', 'Row 3 Col 4']
  ]
});

// Append the list table to the screen
screen.append(listTable);

// Focus on the list table
listTable.focus();

// Handle row selection
listTable.on('select', function(item, index) {
  console.log('Selected row:', index);
  console.log('Selected item:', item);
});

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.listtable(options)`

Creates a new list table element.

**Parameters:**

- `options` (Object): Configuration options for the list table

## Options

The ListTable widget inherits all options from the List element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `data` | Array | Array of arrays containing table data. The first row is treated as the header. |
| `rows` | Array | Alias for `data` |
| `columnWidth` | Array | Array of column widths (percentage or fixed width) |
| `columnSpacing` | Number | Spacing between columns. Default: `3` |
| `pad` | Number | Padding for cells. Default: `2` |
| `noCellBorders` | Boolean | Whether to disable cell borders. Default: `false` |
| `fillCellBorders` | Boolean | Whether to fill cell borders. Default: `false` |
| `style.header` | Object | Style for the header row |
| `style.cell` | Object | Style for the cells |

### Inherited Options

The ListTable widget inherits all options from the List element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `align` | String | Text alignment: 'left', 'center', or 'right'. Default: 'left' |
| `mouse` | Boolean | Whether to enable mouse support. Default: `false` |
| `keys` | Boolean/Array | Use pre-defined keys (i.e. up, down) to navigate the list. Default: `false` |
| `vi` | Boolean | Use vi keys with the keys option. Default: `false` |
| `tags` | Boolean | Whether to parse tags in content. Default: `false` |
| `interactive` | Boolean | Whether the list is interactive. Default: `true` |
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `scrollbar` | Object | Object enabling a scrollbar |

## Properties

The ListTable widget inherits all properties from the List element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `data` | Array | Array of arrays containing table data |
| `rows` | Array | Alias for `data` |
| `columnWidth` | Array | Array of column widths |
| `columnSpacing` | Number | Spacing between columns |
| `pad` | Number | Padding for cells |
| `noCellBorders` | Boolean | Whether cell borders are disabled |
| `fillCellBorders` | Boolean | Whether cell borders are filled |

## Methods

The ListTable widget inherits all methods from the List element and adds the following:

### Data Management

#### `listtable.setData(data)`

Sets the table data.

**Parameters:**

- `data` (Array): Array of arrays containing table data

#### `listtable.setRows(rows)`

Alias for `setData`.

**Parameters:**

- `rows` (Array): Array of arrays containing table data

#### `listtable.addRow(row)`

Adds a row to the table.

**Parameters:**

- `row` (Array): Array containing row data

#### `listtable.addItem(item)`

Alias for `addRow`.

**Parameters:**

- `item` (Array): Array containing row data

#### `listtable.removeRow(index)`

Removes a row from the table.

**Parameters:**

- `index` (Number): Index of the row to remove

#### `listtable.removeItem(index)`

Alias for `removeRow`.

**Parameters:**

- `index` (Number): Index of the row to remove

#### `listtable.getRow(index)`

Gets a row from the table.

**Parameters:**

- `index` (Number): Index of the row to get

**Returns:**

- Array: The row data

#### `listtable.getItem(index)`

Alias for `getRow`.

**Parameters:**

- `index` (Number): Index of the row to get

**Returns:**

- Array: The row data

### Selection Management

#### `listtable.select(index)`

Selects a row.

**Parameters:**

- `index` (Number): Index of the row to select

#### `listtable.clearSelection()`

Clears the current selection.

#### `listtable.getSelected()`

Gets the currently selected row.

**Returns:**

- Array: The selected row data

#### `listtable.getSelectedIndex()`

Gets the index of the currently selected row.

**Returns:**

- Number: The index of the selected row

### Rendering

#### `listtable.render()`

Renders the list table.

## Events

The ListTable widget inherits all events from the List element:

| Event | Description |
|-------|-------------|
| `select` | Emitted when a row is selected |
| `select item` | Emitted when a row is selected (alias for `select`) |
| `cancel` | Emitted when selection is cancelled (Escape key) |
| `action` | Emitted when any action is performed on the list table |
| `keypress` | Emitted when a key is pressed while the list table is focused |
| `click` | Emitted when the list table is clicked |
| `mouseover` | Emitted when the mouse moves over the list table |
| `mouseout` | Emitted when the mouse moves out of the list table |
| `mousedown` | Emitted when a mouse button is pressed on the list table |
| `mouseup` | Emitted when a mouse button is released on the list table |

## Notes

- The ListTable widget is an extension of the List widget that displays tabular data with rows and columns.
- It provides a convenient way to display structured data in a table format with selectable rows.
- The first row of the `data` array is treated as the header row.
- The `columnWidth` option can be used to specify the width of each column. Values can be percentages (e.g., `20%`) or fixed widths (e.g., `10`).
- The `style.header` option can be used to customize the appearance of the header row.
- The `style.cell` option can be used to customize the appearance of the cells.
- The ListTable widget extends the List widget, so it inherits all of its options, methods, and events.
- You can navigate the list table using the arrow keys (if the `keys` option is enabled) or the mouse (if the `mouse` option is enabled).
- The `vi` option enables vi-style navigation (h, j, k, l) in addition to the arrow keys.
- The `tags` option allows you to use tags in the content to style parts of the text. For example, `{bold}Hello{/bold}` will display "Hello" in bold.