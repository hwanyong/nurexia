# Table

The Table widget displays data in a tabular format with rows and columns. It supports features like column alignment, padding, and row selection.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a table
const table = blessed.table({
  top: 'center',
  left: 'center',
  width: '80%',
  height: '50%',
  border: {
    type: 'line'
  },
  style: {
    header: {
      fg: 'blue',
      bold: true
    },
    cell: {
      fg: 'white'
    },
    border: {
      fg: 'green'
    },
    selected: {
      bg: 'green',
      fg: 'black'
    }
  },
  align: 'center',
  pad: 1,
  keys: true,
  mouse: true,
  data: [
    ['Header 1', 'Header 2', 'Header 3'],
    ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
    ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3'],
    ['Row 3 Col 1', 'Row 3 Col 2', 'Row 3 Col 3']
  ]
});

// Append the table to the screen
screen.append(table);

// Focus on the table
table.focus();

// Handle table selection
table.on('select', function(cell, row, column) {
  console.log('Selected cell:', cell, 'at row:', row, 'and column:', column);
});

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.table(options)`

Creates a new table element.

**Parameters:**

- `options` (Object): Configuration options for the table

## Options

The Table widget inherits all options from the Box element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `data` | Array | Array of arrays containing table data |
| `rows` | Array | Array of arrays containing table data (alias for data) |
| `pad` | Number | Padding for cells. Default: `0` |
| `noCellBorders` | Boolean | Whether to hide cell borders. Default: `false` |
| `fillCellBorders` | Boolean | Whether to fill cell borders. Default: `false` |
| `align` | String/Array | Column alignment: 'left', 'center', or 'right'. Can be a string for all columns or an array for individual columns. Default: 'left' |
| `width` | Array | Array of column widths |
| `height` | Array | Array of row heights |
| `tags` | Boolean | Whether to parse tags in table cells. Default: `false` |
| `style.header` | Object | Style for the header row |
| `style.cell` | Object | Style for table cells |
| `style.selected` | Object | Style for the selected cell |
| `mouse` | Boolean | Whether to enable mouse support for this element. Default: `false` |
| `keys` | Boolean/Array | Use pre-defined keys (i.e. up, down, left, right) to navigate the table. Default: `false` |
| `vi` | Boolean | Use vi keys with the keys option. Default: `false` |

### Inherited Options

The Table widget inherits all options from the Box element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The Table widget inherits all properties from the Box element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `data` | Array | Array of arrays containing table data |
| `rows` | Array | Array of arrays containing table data (alias for data) |
| `selected` | Array | Array containing the row and column indices of the selected cell |
| `align` | String/Array | Column alignment |
| `pad` | Number | Padding for cells |
| `noCellBorders` | Boolean | Whether cell borders are hidden |
| `fillCellBorders` | Boolean | Whether cell borders are filled |

## Methods

The Table widget inherits all methods from the Box element and adds the following:

### Data Management

#### `table.setData(data)`

Sets the table data.

**Parameters:**

- `data` (Array): Array of arrays containing table data

#### `table.setRows(rows)`

Sets the table rows (alias for setData).

**Parameters:**

- `rows` (Array): Array of arrays containing table data

#### `table.setRow(row, data)`

Sets a row in the table.

**Parameters:**

- `row` (Number): Index of the row to set
- `data` (Array): Array containing row data

#### `table.getRow(row)`

Gets a row from the table.

**Parameters:**

- `row` (Number): Index of the row to get

**Returns:**

- Array: The row data

#### `table.clearRows()`

Clears all rows from the table.

### Selection Management

#### `table.select(row, col)`

Selects a cell in the table.

**Parameters:**

- `row` (Number): Row index of the cell to select
- `col` (Number): Column index of the cell to select

#### `table.selectRow(row)`

Selects a row in the table.

**Parameters:**

- `row` (Number): Index of the row to select

#### `table.selectColumn(col)`

Selects a column in the table.

**Parameters:**

- `col` (Number): Index of the column to select

#### `table.move(offset)`

Moves the selection by the specified offset.

**Parameters:**

- `offset` (Number): The offset to move the selection by

#### `table.up(amount)`

Moves the selection up by the specified amount.

**Parameters:**

- `amount` (Number): The amount to move the selection up by. Default: `1`

#### `table.down(amount)`

Moves the selection down by the specified amount.

**Parameters:**

- `amount` (Number): The amount to move the selection down by. Default: `1`

#### `table.left(amount)`

Moves the selection left by the specified amount.

**Parameters:**

- `amount` (Number): The amount to move the selection left by. Default: `1`

#### `table.right(amount)`

Moves the selection right by the specified amount.

**Parameters:**

- `amount` (Number): The amount to move the selection right by. Default: `1`

### Focus Management

#### `table.focus()`

Focuses on the table.

## Events

The Table widget inherits all events from the Box element and adds the following:

| Event | Description |
|-------|-------------|
| `select` | Emitted when a cell is selected |
| `select cell` | Emitted when a cell is selected |
| `select row` | Emitted when a row is selected |
| `select column` | Emitted when a column is selected |
| `action` | Emitted when any action is performed on the table |
| `keypress` | Emitted when a key is pressed while the table is focused |

## Notes

- The Table widget displays data in a tabular format with rows and columns.
- It supports features like column alignment, padding, and row selection.
- The table can be navigated using the arrow keys, vi keys (if enabled), or the mouse.
- The `style.header` option can be used to customize the appearance of the header row.
- The `style.cell` option can be used to customize the appearance of table cells.
- The `style.selected` option can be used to customize the appearance of the selected cell.
- The `align` option can be a string for all columns or an array for individual columns.
- The `pad` option adds padding to cells, making the table more readable.
- The Table widget extends the Box widget, so it inherits all of its options, methods, and events.
- The table can be customized with different borders, colors, and styles to match the look and feel of your application.