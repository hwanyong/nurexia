# Gauge Widget

The Gauge widget displays horizontal progress bars that show percentages or progress indicators. It can display either a single value as a percentage or multiple stacked values.

## Import

```javascript
const contrib = require('blessed-contrib');
const gauge = contrib.gauge(options);
```

## Constructor

### `contrib.gauge(options)`

Creates a new gauge widget.

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `label` | String | No | - | The title of the gauge |
| `percent` | Number | No | `0` | Initial percentage (0-100 or 0-1) |
| `stack` | Array | No | - | Array of percentages for a stacked gauge |
| `stroke` | String | No | `'magenta'` | Color of the gauge bar |
| `fill` | String | No | `'white'` | Color of the percentage text |
| `showLabel` | Boolean | No | `true` | Whether to show percentage labels |

## Methods

### `setData(data)`

Sets the gauge data. Can accept either a single percentage or an array of percentages for stacked mode.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | Number/Array | Percentage (0-100 or 0-1) or array of values for stacked gauge |

### `setPercent(percent)`

Sets a single percentage value for the gauge.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `percent` | Number | Percentage value (0-100 or 0-1) |

### `setStack(stack)`

Sets multiple values for a stacked gauge.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `stack` | Array | Array of percentages or objects with percentage and stroke color |

## Examples

### Single Value Gauge

```javascript
const blessed = require('blessed');
const contrib = require('blessed-contrib');

// Create screen
const screen = blessed.screen();

// Create gauge
const gauge = contrib.gauge({
  label: 'Progress',
  percent: 25,
  stroke: 'green',
  fill: 'white',
  showLabel: true,
  height: '20%',
  width: '50%',
  top: 0,
  left: 0,
  border: {type: 'line', fg: 'cyan'}
});

// Add it to the screen
screen.append(gauge);

// Render the screen
screen.render();

// Update progress every second
let progress = 25;
const timer = setInterval(() => {
  progress += 5;
  if (progress >= 100) {
    clearInterval(timer);
    progress = 100;
  }
  gauge.setPercent(progress);
  screen.render();
}, 1000);

// Handle exit
screen.key(['escape', 'q', 'C-c'], function() {
  clearInterval(timer);
  return process.exit(0);
});
```

### Stacked Gauge

```javascript
const blessed = require('blessed');
const contrib = require('blessed-contrib');

// Create screen
const screen = blessed.screen();

// Create stacked gauge
const stackedGauge = contrib.gauge({
  label: 'Disk Usage',
  showLabel: true,
  height: '20%',
  width: '50%',
  top: 0,
  left: 0,
  border: {type: 'line', fg: 'cyan'},
  stack: [
    { percent: 30, stroke: 'red' },    // System files
    { percent: 20, stroke: 'yellow' },  // User files
    { percent: 10, stroke: 'blue' }     // Applications
  ]
});

// Add it to the screen
screen.append(stackedGauge);

// Render the screen
screen.render();

// Update stacked data after a delay
setTimeout(() => {
  stackedGauge.setStack([
    { percent: 35, stroke: 'red' },
    { percent: 25, stroke: 'yellow' },
    { percent: 15, stroke: 'blue' }
  ]);
  screen.render();
}, 3000);

// Handle exit
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});
```

## Notes

- The gauge widget can accept percentage values in either 0-1 range or 0-100 range.
- For stacked gauges, each segment can have its own color using the `stroke` property.
- If no custom colors are provided for segments in a stacked gauge, the widget cycles through a predefined color set (green, magenta, cyan, red, blue).
- The widget must be appended to the screen before calling `setData()`, `setPercent()`, or `setStack()`.
- Percentages are displayed as integer values (rounded to the nearest percent).
- Each segment in a stacked gauge displays its own percentage label if `showLabel` is true.