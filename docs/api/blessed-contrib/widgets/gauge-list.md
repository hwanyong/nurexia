# GaugeList Widget

The GaugeList widget displays multiple stacked horizontal gauges, allowing you to visualize multiple metrics or progress indicators in a compact format.

## Example

```javascript
const blessed = require('blessed');
const contrib = require('blessed-contrib');

const screen = blessed.screen();

// Create a gauge list
const gaugeList = contrib.gaugeList({
  gaugeWidth: 15,
  gaugeHeight: 1,
  gaugeSpacing: 1,
  width: '50%',
  height: '50%',
  gauges: [
    {
      stack: [
        { percent: 30, stroke: 'red' },
        { percent: 30, stroke: 'green' },
        { percent: 40, stroke: 'blue' }
      ],
      showLabel: true
    },
    {
      stack: [
        { percent: 40, stroke: 'magenta' },
        { percent: 60, stroke: 'cyan' }
      ],
      showLabel: true
    },
    {
      stack: [
        { percent: 100, stroke: 'yellow' }
      ],
      showLabel: true
    }
  ]
});

screen.append(gaugeList);
screen.render();
```

## Options

The GaugeList widget supports the following options:

| Option | Type | Description |
|--------|------|-------------|
| `gauges` | Array | Array of gauge objects to display |
| `stroke` | String | Default stroke color for gauges. Default: `'magenta'` |
| `fill` | String | Fill color for gauge text. Default: `'white'` |
| `gaugeSpacing` | Number | Vertical spacing between gauges. Default: `0` |
| `gaugeHeight` | Number | Height of each gauge. Default: `1` |
| `showLabel` | Boolean | Whether to show percentage labels. Default: `true` |

### Gauge Object

Each gauge in the `gauges` array can have the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `stack` | Array | Array of segments that make up the gauge |
| `showLabel` | Boolean | Whether to show percentage labels for this gauge |

### Stack Segment

Each segment in the `stack` array can have the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `percent` | Number | Percentage value for this segment (0-100) |
| `stroke` | String | Color for this segment |

### Inherited Options

The GaugeList widget inherits all options from the Canvas element. Common options include:

| Option | Type | Description |
|--------|------|-------------|
| `width` | String/Number | Width of the widget |
| `height` | String/Number | Height of the widget |
| `border` | Object | Border options |
| `style` | Object | Style options for the widget |

## Methods

### `setGauges(gauges)`

Updates the gauge list with new gauge data.

**Parameters:**

- `gauges` (Array): Array of gauge objects to display

**Example:**

```javascript
gaugeList.setGauges([
  {
    stack: [
      { percent: 50, stroke: 'red' },
      { percent: 50, stroke: 'green' }
    ],
    showLabel: true
  },
  {
    stack: [
      { percent: 100, stroke: 'blue' }
    ],
    showLabel: true
  }
]);
screen.render();
```

## Events

The GaugeList widget inherits all events from the Canvas element.

## Notes

- Each gauge can have multiple segments that stack horizontally
- The sum of all segment percentages in a gauge should equal 100
- If no stroke color is specified for a segment, it will use a color from a predefined array
- The widget automatically numbers each gauge on the left side
- For best results, keep the number of gauges reasonable for your terminal height