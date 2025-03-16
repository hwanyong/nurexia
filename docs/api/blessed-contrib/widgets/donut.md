# Donut Chart Widget

The Donut Chart widget displays data as circular charts with a hole in the middle, showing proportional values as arcs around a circle. It's useful for visualizing percentages or proportions of a whole.

## Import

```javascript
const contrib = require('blessed-contrib');
const donut = contrib.donut(options);
```

## Constructor

### `contrib.donut(options)`

Creates a new donut chart widget.

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `label` | String | No | - | The title of the chart |
| `radius` | Number | No | `14` | Radius of each donut chart |
| `arcWidth` | Number | No | `4` | Width of the arc/ring of each donut |
| `spacing` | Number | No | `2` | Spacing between multiple donut charts |
| `yPadding` | Number | No | `2` | Padding from the top |
| `stroke` | String | No | `'magenta'` | Default stroke color |
| `fill` | String | No | `'white'` | Text fill color |
| `remainColor` | String | No | `'black'` | Color for the unfilled portion of the donut |
| `data` | Array | No | `[]` | Array of donut data objects (see Data Format below) |

## Methods

### `setData(data)` or `update(data)`

Sets or updates the chart data.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | Array | Array of donut data objects (see Data Format below) |

#### Data Format

Each item in the data array should be an object with the following properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `percent` | Number/String | Yes | Percentage value (0-1 or 0-100) |
| `label` | String | Yes | Label text displayed below the donut |
| `color` | String | No | Color of the donut arc (default: 'green') |
| `percentAltNumber` | Number | No | Alternative number to display instead of a percentage |

## Example

```javascript
const blessed = require('blessed');
const contrib = require('blessed-contrib');

// Create screen
const screen = blessed.screen();

// Create donut chart
const donut = contrib.donut({
  label: 'Storage Usage',
  radius: 16,
  arcWidth: 4,
  spacing: 2,
  yPadding: 2,
  data: [
    {percent: 80, label: 'System', color: 'red'},
    {percent: 20, label: 'User', color: 'blue'},
    {percent: 40, label: 'Free', color: 'green'}
  ],
  height: '50%',
  width: '50%',
  top: 0,
  left: 0
});

// Add it to the screen
screen.append(donut);

// Render the screen
screen.render();

// Update data later
setTimeout(() => {
  donut.setData([
    {percent: 70, label: 'System', color: 'red'},
    {percent: 30, label: 'User', color: 'blue'},
    {percent: 50, label: 'Free', color: 'green'}
  ]);
  screen.render();
}, 3000);

// Handle exit
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});
```

## Notes

- You must call `setData()` after the chart has been added to the screen via `screen.append()`.
- Multiple donuts are automatically arranged horizontally with proper spacing.
- Each donut displays a percentage value in the center and a label below it.
- The `percent` value can be supplied as a decimal (0-1) or as a percentage (0-100), the widget will automatically detect which format you're using.
- The unfilled portion of each donut is drawn using the `remainColor` option.
- The `percentAltNumber` property allows you to display an alternative number instead of the percentage, which can be useful for showing actual values instead of percentages.
- When updating data, be sure to call `screen.render()` afterwards to refresh the display.