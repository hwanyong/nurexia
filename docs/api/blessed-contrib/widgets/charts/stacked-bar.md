# Stacked Bar Chart Widget

The Stacked Bar Chart widget displays data as vertical bars where each bar contains multiple segments stacked on top of each other. This is useful for showing the composition of each category and comparing totals across categories.

## Import

```javascript
const contrib = require('blessed-contrib');
const stackedBar = contrib.stackedBar(options);
```

## Constructor

### `contrib.stackedBar(options)`

Creates a new stacked bar chart widget.

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `label` | String | No | - | The title of the chart |
| `barWidth` | Number | No | `6` | Width of each bar in cells |
| `barSpacing` | Number | No | `9` | Spacing between bars in cells (auto-adjusted if too small) |
| `xOffset` | Number | No | `5` | Left padding before the first bar |
| `maxValue` | Number | No | - | Maximum height value (for scaling, will auto-adjust if data exceeds this) |
| `showText` | Boolean | No | `true` | Whether to show text values on each segment |
| `showLegend` | Boolean | No | `true` | Whether to show the chart legend |
| `legend` | Object | No | `{}` | Configuration for the legend |
| `barBgColor` | Array | Yes | - | Array of colors for each segment in the stacked bar |
| `barFgColor` | String | No | `'white'` | Foreground color for value text |
| `labelColor` | String | No | `'white'` | Color for category labels |

#### Legend Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `width` | Number | `15` | Width of the legend box |

## Methods

### `setData(data)`

Sets or updates the chart data.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | Object | Object containing stacked bar chart data (see Data Format below) |

#### Data Format

The data object should have the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `barCategory` | Array | Array of string labels for each bar category (x-axis labels) |
| `stackedCategory` | Array | Array of string labels for each stack segment (for the legend) |
| `data` | Array of Arrays | 2D array where each inner array represents a bar with values for each stack segment |

## Example

```javascript
const blessed = require('blessed');
const contrib = require('blessed-contrib');

// Create screen
const screen = blessed.screen();

// Create stacked bar chart
const stackedBar = contrib.stackedBar({
  label: 'Server Resources by Department',
  barWidth: 4,
  barSpacing: 8,
  xOffset: 2,
  maxValue: 100,
  barBgColor: ['red', 'blue', 'green'],
  height: '50%',
  width: '50%',
  top: 0,
  left: 0
});

// Add it to the screen
screen.append(stackedBar);

// Set data
stackedBar.setData({
  barCategory: ['Engineering', 'Marketing', 'Sales', 'Operations'],
  stackedCategory: ['CPU', 'Memory', 'Disk'],
  data: [
    [30, 20, 50],  // Engineering department resource usage
    [20, 30, 30],  // Marketing department resource usage
    [10, 10, 20],  // Sales department resource usage
    [30, 30, 60]   // Operations department resource usage
  ]
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
- The stacked bar chart automatically scales based on the sum of values in each bar.
- Each bar represents a category, and each colored segment within a bar represents a stack component.
- The width of the chart determines how many bars can fit. If there are too many bars for the available width, they will be cut off.
- The `barBgColor` array must have at least as many colors as there are stack segments in each bar.
- Each stack segment shows its value within it (if there's enough space and `showText` is true).
- The legend displays the colors and names of each stack segment category.