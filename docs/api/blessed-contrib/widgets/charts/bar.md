# Bar Chart Widget

The Bar Chart widget displays data as vertical bars, allowing you to compare discrete values across different categories.

## Import

```javascript
const contrib = require('blessed-contrib');
const bar = contrib.bar(options);
```

## Constructor

### `contrib.bar(options)`

Creates a new bar chart widget.

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `label` | String | No | - | The title of the chart |
| `barWidth` | Number | No | `6` | Width of each bar in cells |
| `barSpacing` | Number | No | `9` | Spacing between bars in cells (auto-adjusted if too small) |
| `xOffset` | Number | No | `5` | Left padding before the first bar |
| `maxHeight` | Number | No | `0` | Maximum height value (for scaling, will auto-adjust if data exceeds this) |
| `showText` | Boolean | No | `true` | Whether to show text labels and values |
| `barBgColor` | String | No | `'blue'` | Background color for bars |
| `barFgColor` | String | No | `'white'` | Foreground color for value text |
| `labelColor` | String | No | `'white'` | Color for category labels |

## Methods

### `setData(data)`

Sets or updates the chart data.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | Object | Object containing bar chart data (see Data Format below) |

#### Data Format

The data object should have the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `titles` | Array | Array of string labels for each bar category |
| `data` | Array | Array of numeric values for each bar height |

## Example

```javascript
const blessed = require('blessed');
const contrib = require('blessed-contrib');

// Create screen
const screen = blessed.screen();

// Create bar chart
const bar = contrib.bar({
  label: 'Server Resources',
  barWidth: 4,
  barSpacing: 8,
  xOffset: 2,
  maxHeight: 100,
  barBgColor: 'green',
  barFgColor: 'white',
  labelColor: 'cyan',
  height: '40%',
  width: '50%',
  top: 0,
  left: 0
});

// Add it to the screen
screen.append(bar);

// Set data
bar.setData({
  titles: ['CPU', 'Memory', 'Disk', 'Network', 'Load'],
  data: [75, 87, 32, 45, 63]
});

// Render the screen
screen.render();

// Handle exit
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});
```

## Notes

- You must call `setData()` after the chart has been added to the screen via `screen.append()`.
- The bar chart automatically scales based on the maximum value in your data.
- The width of the chart determines how many bars can fit. If there are too many bars for the available width, they will be cut off.
- The bars are drawn from the bottom up, with data values displayed above each bar.
- Category labels are displayed below each bar.
- The height of each bar is proportional to its value relative to the maximum value in the dataset or the `maxHeight` option (whichever is greater).