# Sparkline Widget

The Sparkline widget displays multiple small line charts without axes, providing a compact visualization of data trends.

## Example

```javascript
const blessed = require('blessed');
const contrib = require('blessed-contrib');

const screen = blessed.screen();

// Create a sparkline
const sparkline = contrib.sparkline({
  label: 'Sparkline',
  tags: true,
  border: {type: 'line', fg: 'cyan'},
  width: '50%',
  height: '50%',
  style: { fg: 'blue' },
  data: {
    titles: ['CPU', 'Memory'],
    data: [
      [10, 20, 30, 20, 50, 70, 60, 30, 35, 38],
      [40, 10, 40, 50, 20, 30, 20, 20, 19, 40]
    ]
  }
});

screen.append(sparkline);
screen.render();
```

## Options

The Sparkline widget supports the following options:

| Option | Type | Description |
|--------|------|-------------|
| `bufferLength` | Number | Maximum number of data points to display. Default: `30` |
| `style` | Object | Style options for the widget |
| `style.titleFg` | String | Foreground color for titles. Default: `'white'` |
| `data` | Object | Data to display in the sparkline |
| `data.titles` | Array | Array of strings representing titles for each sparkline |
| `data.data` | Array | Array of arrays containing numeric data points for each sparkline |

### Inherited Options

The Sparkline widget inherits all options from the blessed Box element. Common options include:

| Option | Type | Description |
|--------|------|-------------|
| `label` | String | Label text for the widget |
| `tags` | Boolean | Whether to parse tags in the content text |
| `border` | Object | Border options |
| `width` | String/Number | Width of the widget |
| `height` | String/Number | Height of the widget |

## Methods

### `setData(titles, datasets)`

Updates the sparkline with new data.

**Parameters:**

- `titles` (Array): Array of strings representing titles for each sparkline
- `datasets` (Array): Array of arrays containing numeric data points for each sparkline

**Example:**

```javascript
sparkline.setData(
  ['CPU', 'Memory'],
  [
    [10, 20, 30, 40, 50],
    [50, 40, 30, 20, 10]
  ]
);
screen.render();
```

## Events

The Sparkline widget inherits all events from the blessed Box element.

## Notes

- The sparkline will automatically adjust to fit the width of the widget
- Each sparkline is displayed with its title followed by the visualization
- The widget uses the `sparkline` npm package to render the actual sparklines