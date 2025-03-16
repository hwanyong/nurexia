# Canvas Widget

The Canvas widget provides a drawing surface that uses the drawille-canvas-blessed-contrib library to create ASCII/ANSI art in the terminal. It serves as the base for many graphical widgets in blessed-contrib.

## Import

```javascript
const contrib = require('blessed-contrib');
const canvas = contrib.canvas(options);
```

## Constructor

### `contrib.canvas(options[, canvasType])`

Creates a new canvas widget.

#### Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `options` | Object | Yes | - | Canvas configuration options |
| `canvasType` | Object | No | - | Optional canvas type implementation |

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `label` | String | No | - | The title of the canvas |
| `width` | Number/String | Yes | - | Width of the canvas (in columns) |
| `height` | Number/String | Yes | - | Height of the canvas (in rows) |
| `top` | Number/String | No | - | Top position |
| `left` | Number/String | No | - | Left position |
| `border` | Object/String | No | - | Border settings |
| `style` | Object | No | - | Style settings for the canvas |
| `data` | Any | No | - | Initial data to render on canvas |

## Methods

### `calcSize()`

Calculates the internal canvas size based on the widget dimensions.

### `clear()`

Clears the entire canvas.

### `render()`

Renders the canvas content to the screen.

## Notes

- The Canvas widget is primarily used as a base class for other graphical widgets.
- It provides a 2D drawing context (ctx) similar to the HTML canvas API but for terminal rendering.
- Canvas size is calculated based on the widget's dimensions, but with different scaling - width is doubled minus 12 and height is quadrupled.
- Widgets that extend Canvas typically implement their own `setData` method to handle their specific visualization needs.
- The canvas uses the drawille algorithm to represent "pixels" using Braille patterns in the terminal.

## Example: Using Canvas Directly

```javascript
const blessed = require('blessed');
const contrib = require('blessed-contrib');

// Create screen
const screen = blessed.screen();

// Create canvas
const canvas = contrib.canvas({
  label: 'Custom Drawing',
  width: '50%',
  height: '50%',
  border: {type: 'line', fg: 'cyan'},
  top: 0,
  left: 0,
  style: {
    fg: 'white',
    bg: 'black'
  }
});

// Add it to the screen
screen.append(canvas);

// Wait for canvas to be ready
canvas.on('attach', () => {
  // Get the drawing context
  const ctx = canvas.ctx;
  
  // Draw a rectangle
  ctx.strokeStyle = 'blue';
  ctx.strokeRect(10, 10, 40, 20);
  
  // Draw a filled rectangle
  ctx.fillStyle = 'green';
  ctx.fillRect(60, 10, 40, 20);
  
  // Draw a line
  ctx.strokeStyle = 'yellow';
  ctx.beginPath();
  ctx.moveTo(10, 40);
  ctx.lineTo(100, 60);
  ctx.stroke();
  
  // Draw a circle
  ctx.strokeStyle = 'red';
  ctx.beginPath();
  ctx.arc(50, 50, 20, 0, Math.PI * 2, true);
  ctx.stroke();
  
  // Draw text
  ctx.fillStyle = 'magenta';
  ctx.fillText('Hello World', 10, 80);
  
  // Render the screen
  screen.render();
});

// Handle exit
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});
```

## Inheritance

Most graphical widgets in blessed-contrib extend the Canvas widget:

- Charts (line, bar, stacked-bar)
- Map
- Sparkline
- Gauge
- and more

These widgets implement their own rendering logic on top of the canvas drawing API.