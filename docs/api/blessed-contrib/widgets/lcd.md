# LCD Widget

The LCD widget displays text in a 16-segment LCD/LED display style commonly found in digital devices and calculators. It's useful for displaying numeric values, simple text, or status indicators with a retro electronics feel.

## Import

```javascript
const contrib = require('blessed-contrib');
const lcd = contrib.lcd(options);
```

## Constructor

### `contrib.lcd(options)`

Creates a new LCD display widget.

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `label` | String | No | - | The title of the widget |
| `segmentWidth` | Number | No | `0.06` | Width of segments as percentage of element width |
| `segmentInterval` | Number | No | `0.11` | Spacing between segments as percentage of element width |
| `strokeWidth` | Number | No | `0.11` | Width of segment outlines |
| `elements` | Number | No | `3` | Number of characters to display |
| `display` | Number/String | No | `321` | Initial text to display |
| `elementSpacing` | Number | No | `4` | Spacing between characters |
| `elementPadding` | Number | No | `2` | Padding around the display |
| `color` | String | No | `'white'` | Color of the active segments |

## Methods

### `setData(data)`

Sets the display text.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | String/Number | Text or number to display |

### `setDisplay(display)`

Alternative to `setData()` - sets the display text.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `display` | String/Number | Text or number to display |

### `setOptions(options)`

Updates display options.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `options` | Object | New options to apply (same as constructor options) |

### Segment Adjustment Methods

These methods allow fine-tuning of the segment appearance:

| Method | Description |
|--------|-------------|
| `increaseWidth()` | Increases segment width |
| `decreaseWidth()` | Decreases segment width |
| `increaseInterval()` | Increases spacing between segments |
| `decreaseInterval()` | Decreases spacing between segments |
| `increaseStroke()` | Increases segment stroke width |
| `decreaseStroke()` | Decreases segment stroke width |

## Example

```javascript
const blessed = require('blessed');
const contrib = require('blessed-contrib');

// Create screen
const screen = blessed.screen();

// Create LCD display
const lcd = contrib.lcd({
  label: 'System Status',
  elements: 5,
  display: '12345',
  segmentWidth: 0.06,
  segmentInterval: 0.11,
  strokeWidth: 0.1,
  elementSpacing: 4,
  elementPadding: 2,
  color: 'green',
  height: '20%',
  width: '30%',
  top: 0,
  left: 0,
  border: {type: 'line', fg: 'cyan'}
});

// Add it to the screen
screen.append(lcd);

// Render the screen
screen.render();

// Update the display after a delay
setTimeout(() => {
  lcd.setDisplay('HELLO');
  screen.render();
}, 1000);

// Adjust segment width after another delay
setTimeout(() => {
  lcd.increaseWidth();
  lcd.increaseStroke();
  screen.render();
}, 2000);

// Handle exit
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});
```

## Supported Characters

The LCD widget can display the following characters:

- Digits: `0-9`
- Letters: `A-Z` (uppercase only)
- Special characters: Space, `-`, `?`, `+`, `*`

## Notes

- The LCD display is based on a 16-segment display, which can represent most alphanumeric characters.
- The appearance of the segments can be fine-tuned using the adjustment methods or by setting the appropriate options.
- The widget must be appended to the screen before calling `setData()` or `setDisplay()`.
- For best visual appearance, adjust the `segmentWidth`, `segmentInterval`, and `strokeWidth` based on your terminal size and the number of elements.
- The display automatically adapts to the widget's size.
- Note that lowercase letters are not supported and will not display correctly.