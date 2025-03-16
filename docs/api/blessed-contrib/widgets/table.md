# Table Widget

The Table widget displays data in a tabular format with rows and columns. It supports interactivity for selecting rows and displays headers at the top.

## Import

```javascript
const contrib = require('blessed-contrib');
const table = contrib.table(options);
```

## Constructor

### `contrib.table(options)`

Creates a new table widget.

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `label` | String | No | - | The title of the table |
| `columnWidth` | Array | Yes | - | Array of column widths (character count for each column) |
| `columnSpacing` | Number | No | `10` | Space between columns (in addition to columnWidth) |
| `fg` | String | No | `'green'` | Foreground color for table content |
| `bg` | String | No | `''` | Background color for table content |
| `selectedFg` | String | No | `'white'` | Text color for selected row |
| `selectedBg` | String | No | `'blue'` | Background color for selected row |
| `interactive` | Boolean | No | `true` | Whether the table can be interacted with (rows selected) |
| `keys` | Boolean | No | - | Enable keyboard navigation |
| `vi` | Boolean | No | - | Enable vi-like navigation |
| `mouse` | Boolean | No | - | Enable mouse support |
| `data` | Object | No | - | Initial table data (see Data Format below) |

## Methods

### `setData(data)`

Sets or updates the table data.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | Object | Table data object (see Data Format below) |

### `focus()`

Focuses the table so it can receive keyboard input.

#### Data Format

The data object should have the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `headers` | Array | Array of string column headers |
| `data` | Array of Arrays | 2D array where each inner array represents a row of data |

## Example

```javascript
const blessed = require('blessed');
const contrib = require('blessed-contrib');

// Create screen
const screen = blessed.screen();

// Create table
const table = contrib.table({
  keys: true,
  fg: 'white',
  selectedFg: 'white',
  selectedBg: 'blue',
  interactive: true,
  label: 'Server Status',
  columnWidth: [16, 12, 12, 12],  // Width for each column
  columnSpacing: 3,               // Space between columns
  height: '50%',
  width: '80%',
  top: 0,
  left: 0,
  border: {type: 'line', fg: 'cyan'}
});

// Add it to the screen
screen.append(table);

// Set data
table.setData({
  headers: ['Server Name', 'Status', 'CPU', 'Memory'],
  data: [
    ['web-01', 'online', '23%', '156MB/512MB'],
    ['web-02', 'online', '17%', '128MB/512MB'],
    ['db-01', 'online', '82%', '896MB/1024MB'],
    ['cache-01', 'offline', '0%', '0MB/512MB'],
    ['worker-01', 'online', '28%', '256MB/512MB']
  ]
});

// Handle row selection events
table.rows.on('select', function(item, index) {
  // index is the row index
  console.log('Selected row:', index);
  
  // item is the string displayed in the row (all columns concatenated)
  console.log('Row content:', item.content);
});

// Focus on the table
table.focus();

// Render the screen
screen.render();

// Handle exit
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});
```

## Notes

- The `columnWidth` property is required and must be an array specifying the maximum width of each column.
- If text in a cell is longer than the specified column width, it will be truncated.
- The table is interactive by default, allowing row selection with arrow keys or mouse (if enabled).
- ANSI color codes in cell data are handled correctly when calculating column widths.
- You can access the selected row using the `select` event on the `rows` property of the table.
- Setting `keys: true` enables keyboard navigation.
- The table is built on top of the blessed List widget, so many List methods and events are available through the `rows` property.