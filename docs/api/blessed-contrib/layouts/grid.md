# Grid Layout

The Grid layout allows you to organize widgets in a responsive grid system, making it easy to create complex terminal dashboards.

## Import

```javascript
const contrib = require('blessed-contrib');
const grid = new contrib.grid(options);
```

## Constructor

### `new contrib.grid(options)`

Creates a new grid layout.

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `screen` | Object | Yes | - | The blessed screen object to which the grid belongs |
| `rows` | Number | Yes | - | Number of rows in the grid |
| `cols` | Number | Yes | - | Number of columns in the grid |
| `hideBorder` | Boolean | No | `false` | If true, hides the border around widgets |
| `color` | String | No | `'cyan'` | Border color for the widgets |
| `dashboardMargin` | Number | No | `0` | Margin around the entire dashboard in percentage |

## Methods

### `set(row, col, rowSpan, colSpan, obj, opts)`

Places a widget at the specified position in the grid.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `row` | Number | Starting row (0-indexed) |
| `col` | Number | Starting column (0-indexed) |
| `rowSpan` | Number | Number of rows the widget should span |
| `colSpan` | Number | Number of columns the widget should span |
| `obj` | Function | Widget constructor function |
| `opts` | Object | Options for the widget |

#### Returns

The created widget instance.

## Example

```javascript
const blessed = require('blessed');
const contrib = require('blessed-contrib');

const screen = blessed.screen();

// Create a 12x12 grid
const grid = new contrib.grid({
  screen: screen,
  rows: 12,
  cols: 12,
  hideBorder: false,
  color: 'green',
  dashboardMargin: 2
});

// Add a line chart that spans 6x6 cells starting at position (0,0)
const line = grid.set(0, 0, 6, 6, contrib.line, {
  label: 'Network Latency (ms)',
  showLegend: true
});

// Add a bar chart that spans 6x6 cells starting at position (6,0)
const bar = grid.set(6, 0, 6, 6, contrib.bar, {
  label: 'Server Resources'
});

// Add a map that spans 6x6 cells starting at position (0,6)
const map = grid.set(0, 6, 6, 6, contrib.map, {
  label: 'World Map'
});

// Add a log widget that spans 6x6 cells starting at position (6,6)
const log = grid.set(6, 6, 6, 6, contrib.log, {
  label: 'System Log'
});

screen.render();
```

## Notes

- The Grid layout uses percentage-based calculations to determine widget position and size.
- Grids cannot be nested directly inside other grids.
- Each cell in the grid is calculated as a percentage of the total screen size.
- The `dashboardMargin` parameter adds space around the entire dashboard.