# Log Widget

The Log widget displays scrollable log messages in a terminal-friendly format. It's useful for showing application logs, status updates, or any stream of informational text.

## Import

```javascript
const contrib = require('blessed-contrib');
const log = contrib.log(options);
```

## Constructor

### `contrib.log(options)`

Creates a new log widget.

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `label` | String | No | - | The title of the log widget |
| `bufferLength` | Number | No | `30` | Maximum number of lines to keep in the log (older lines are removed) |
| `fg` | String | No | - | Text color for log entries |
| `bg` | String | No | - | Background color for the log widget |
| `border` | Object | No | - | Border configuration (e.g., `{type: 'line', fg: 'cyan'}`) |
| `tags` | Boolean | No | - | Enable blessed tags for styling log content |
| `scrollable` | Boolean | No | - | Whether the log should be scrollable |
| `scrollbar` | Object | No | - | Scrollbar configuration |
| `screen` | Object | No | - | The blessed screen object |

## Methods

### `log(str)`

Adds a new log entry to the widget.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `str` | String | The log message to add |

## Example

```javascript
const blessed = require('blessed');
const contrib = require('blessed-contrib');

// Create screen
const screen = blessed.screen();

// Create log widget
const log = contrib.log({
  label: 'System Logs',
  fg: 'green',
  selectedFg: 'green',
  bufferLength: 100,
  tags: true,
  border: {type: 'line', fg: 'cyan'},
  height: '50%',
  width: '60%',
  top: 0,
  left: 0,
  scrollable: true,
  scrollbar: {
    ch: ' ',
    track: {
      bg: 'blue'
    },
    style: {
      inverse: true
    }
  }
});

// Add it to the screen
screen.append(log);

// Add some log entries
log.log('System starting...');
log.log('Loading configuration');
log.log('Connecting to database');
log.log('{red-fg}Error: Database connection failed{/red-fg}');
log.log('{yellow-fg}Warning: Falling back to local storage{/yellow-fg}');
log.log('System ready');

// Add more logs over time
let count = 0;
const timer = setInterval(() => {
  log.log(`Log entry ${++count}: ${new Date().toISOString()}`);
  screen.render();
  
  // Stop after 20 entries
  if (count >= 20) clearInterval(timer);
}, 1000);

// Render the screen
screen.render();

// Handle exit
screen.key(['escape', 'q', 'C-c'], function() {
  clearInterval(timer);
  return process.exit(0);
});
```

## Notes

- The log widget automatically handles scrolling to show the most recent log entries.
- When the number of log entries exceeds `bufferLength`, the oldest entries are removed.
- If you enable the `tags` option, you can use blessed's markup tags for colored text (e.g., `{red-fg}Error{/red-fg}`).
- The log widget extends blessed's List widget, so it inherits all its capabilities.
- Unlike many other widgets, the log is not interactive by default (you can't select individual log lines).
- If you want to programmatically scroll the log, you can use the `setItems()` and `scrollTo()` methods inherited from the List widget.