# Carousel Layout

The Carousel layout creates a slideshow-like interface that allows switching between different "pages" or screens of content. This is useful for creating multi-screen dashboards that can be navigated with keyboard controls.

## Import

```javascript
const contrib = require('blessed-contrib');
const carousel = new contrib.carousel(pages, options);
```

## Constructor

### `new contrib.carousel(pages, options)`

Creates a new carousel layout.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pages` | Array | Yes | Array of page functions, each defining a different screen in the carousel |
| `options` | Object | Yes | Carousel configuration options |

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `screen` | Object | Yes | - | The blessed screen object to which the carousel belongs |
| `interval` | Number | No | - | Auto-rotation interval in milliseconds (if not set, auto-rotation is disabled) |
| `controlKeys` | Boolean | No | `false` | Enable keyboard navigation controls |
| `rotate` | Boolean | No | `false` | Whether to rotate back to the first page after reaching the last page (and vice versa) |

## Methods

### `next()`

Moves to the next page in the carousel.

### `prev()`

Moves to the previous page in the carousel.

### `home()`

Moves to the first page in the carousel.

### `end()`

Moves to the last page in the carousel.

### `start()`

Initializes the carousel, displays the first page, and sets up interval and key handlers if configured.

### `move()`

Internal method used to change carousel pages. Detaches all screen children and attaches the new page's elements.

## Example

```javascript
const blessed = require('blessed');
const contrib = require('blessed-contrib');

const screen = blessed.screen();

// Create page functions
const page1 = (screen) => {
  // Create a grid for page 1
  const grid = new contrib.grid({rows: 12, cols: 12, screen: screen});
  
  // Add widgets to page 1
  const line = grid.set(0, 0, 6, 6, contrib.line, {
    label: 'CPU Usage',
    showLegend: true
  });
  
  const bar = grid.set(6, 0, 6, 12, contrib.bar, {
    label: 'Server Resources'
  });
  
  // Sample data
  line.setData({
    x: ['t1', 't2', 't3', 't4'],
    y: [5, 1, 7, 5]
  });
  
  bar.setData({
    titles: ['CPU', 'Memory', 'Disk'],
    data: [80, 60, 40]
  });
};

const page2 = (screen) => {
  // Create a grid for page 2
  const grid = new contrib.grid({rows: 12, cols: 12, screen: screen});
  
  // Add widgets to page 2
  const map = grid.set(0, 0, 6, 12, contrib.map, {
    label: 'World Map'
  });
  
  const log = grid.set(6, 0, 6, 12, contrib.log, {
    label: 'System Log'
  });
  
  // Add some log entries
  log.log('System started');
  log.log('Loading resources...');
  log.log('System ready');
};

// Initialize the carousel with pages
const carousel = new contrib.carousel(
  [page1, page2],
  {
    screen: screen,
    interval: 5000,  // Auto-rotate every 5 seconds
    controlKeys: true,  // Enable keyboard navigation
    rotate: true  // Rotate from last page to first page
  }
);

// Start the carousel
carousel.start();

screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

screen.render();
```

## Notes

- Each page function receives the screen object and the current page number as parameters.
- Page functions are responsible for creating and configuring all widgets for that specific page.
- When auto-rotation is enabled, the carousel will automatically move to the next page at the specified interval.
- When control keys are enabled, you can navigate using:
  - Right arrow: next page
  - Left arrow: previous page
  - Home: first page
  - End: last page