# Line Chart Widget

The Line Chart widget displays data as lines in a Cartesian coordinate system, allowing you to visualize trends and relationships between data points over time or another continuous variable.

## Import

```javascript
const contrib = require('blessed-contrib');
const line = contrib.line(options);
```

## Constructor

### `contrib.line(options)`

Creates a new line chart widget.

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `label` | String | No | 'Title' | The title of the chart |
| `showLegend` | Boolean | No | `true` | Whether to show the chart legend |
| `legend` | Object | No | `{width: 12}` | Configuration for the legend |
| `xLabelPadding` | Number | No | `5` | Spacing between the x-axis and its labels |
| `xPadding` | Number | No | `10` | Padding from the left edge of the chart |
| `numYLabels` | Number | No | `5` | Number of labels to display on the y-axis |
| `wholeNumbersOnly` | Boolean | No | `false` | Whether to display only whole numbers on the y-axis |
| `minY` | Number | No | `0` | Minimum value for the y-axis |
| `maxY` | Number | No | *auto* | Maximum value for the y-axis (calculated from data if not provided) |
| `showNthLabel` | Number | No | `1` | Display every nth x-axis label |
| `abbreviate` | Boolean | No | `false` | Abbreviate large numbers (K for thousands, M for millions, etc.) |
| `style` | Object | No | *see below* | Style configuration for the chart |

#### Style Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `line` | String | 'yellow' | Default color for lines |
| `text` | String | 'green' | Color for text labels |
| `baseline` | String | 'black' | Color for the chart axes |

## Methods

### `setData(data)`

Sets or updates the chart data.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | Array | Array of data series objects (see Data Format below) |

#### Data Format

Each item in the data array should be an object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `title` | String | Title for the data series (displayed in legend) |
| `x` | Array | Array of string labels for the x-axis |
| `y` | Array | Array of numeric values for the y-axis |
| `style` | Object | (Optional) Style for this specific series |

The `style` object can have the following property:

| Property | Type | Description |
|----------|------|-------------|
| `line` | String | Color for this specific line |

## Example

```javascript
const blessed = require('blessed');
const contrib = require('blessed-contrib');

// Create screen
const screen = blessed.screen();

// Create line chart
const line = contrib.line({
  label: 'Network Latency (ms)',
  style: { 
    line: 'yellow', 
    text: 'green', 
    baseline: 'black' 
  },
  xLabelPadding: 3,
  xPadding: 5,
  showLegend: true,
  wholeNumbersOnly: false,
  legend: { width: 20 }
});

// Add it to the screen
screen.append(line);

// Set data
line.setData([
  {
    title: 'Server A',
    x: ['t1', 't2', 't3', 't4', 't5'],
    y: [5, 1, 7, 5, 3],
    style: { line: 'red' }
  },
  {
    title: 'Server B',
    x: ['t1', 't2', 't3', 't4', 't5'],
    y: [2, 4, 9, 8, 5],
    style: { line: 'yellow' }
  },
  {
    title: 'Server C',
    x: ['t1', 't2', 't3', 't4', 't5'],
    y: [22, 7, 12, 1, 5],
    style: { line: 'blue' }
  }
]);

// Render the screen
screen.render();

// Handle exit
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});
```

## Notes

- You must call `setData()` after the chart has been added to the screen via `screen.append()`.
- The chart automatically scales the y-axis based on the maximum values in your data.
- The x-axis labels are evenly spaced regardless of the actual values.
- The `setData()` method redraws the entire chart, so it can be used for animation by repeatedly calling it with updated data.
- When using multiple data series, each series needs the same number of x-labels and y-values.