# Server Utilities

The server utilities in blessed-contrib provide functionality for creating and managing terminal dashboards that can be accessed remotely over HTTP. These utilities are particularly useful for building web-accessible terminal dashboards.

## Import

```javascript
const serverUtils = require('blessed-contrib/lib/server-utils');
```

## Classes and Functions

### `OutputBuffer(options)`

A utility class that emulates a TTY output stream for blessed's program to write to.

#### Constructor Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `res` | Object | Yes | HTTP response object to write terminal output to |
| `cols` | Number | Yes | Number of columns in the terminal |
| `rows` | Number | Yes | Number of rows in the terminal |

#### Methods

| Method | Description |
|--------|-------------|
| `write(s)` | Writes a string to the HTTP response |
| `on()` | No-op event handler (for compatibility) |

### `InputBuffer()`

A utility class that emulates a TTY input stream for blessed's program to read from.

#### Methods

| Method | Description |
|--------|-------------|
| `emit()` | No-op event emitter (for compatibility) |
| `setRawMode()` | No-op (for compatibility) |
| `resume()` | No-op (for compatibility) |
| `pause()` | No-op (for compatibility) |
| `on()` | No-op event handler (for compatibility) |

### `createScreen(req, res)`

Creates a virtual blessed screen for server-side rendering.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `req` | Object | HTTP request object |
| `res` | Object | HTTP response object |

#### Returns

A blessed screen instance configured for server-side rendering, or `null` if there was an error.

#### Query Parameters

The function supports the following query parameters in the request URL:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `cols` | Number | `250` | Number of columns in the terminal (must be between 36 and 499) |
| `rows` | Number | `50` | Number of rows in the terminal (must be between 6 and 299) |
| `terminal` | String | - | Terminal type identifier |
| `isOSX` | Boolean | - | Whether the client is running on macOS |
| `isiTerm2` | Boolean | - | Whether the client is using iTerm2 |

### `serverError(req, res, err)`

Handles errors in server-side rendering by sending an appropriate HTTP response.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `req` | Object | HTTP request object |
| `res` | Object | HTTP response object |
| `err` | String | Error message |

#### Returns

Always returns `true`.

## Example: HTTP Server with Dashboard

```javascript
const http = require('http');
const blessed = require('blessed');
const contrib = require('blessed-contrib');

// Create HTTP server
http.createServer((req, res) => {
  // Create a screen for this request
  const screen = contrib.createScreen(req, res);
  
  if (!screen) return; // createScreen handles the error response
  
  // Create a grid layout
  const grid = new contrib.grid({rows: 12, cols: 12, screen: screen});
  
  // Add a line chart
  const line = grid.set(0, 0, 6, 6, contrib.line, {
    style: {
      line: "yellow",
      text: "green",
      baseline: "black"
    },
    xLabelPadding: 3,
    xPadding: 5,
    label: 'Network Latency (ms)'
  });
  
  // Set line chart data
  const data = {
    x: ['t1', 't2', 't3', 't4'],
    y: [5, 1, 7, 5]
  };
  
  line.setData([data]);
  
  // Add a map widget
  const map = grid.set(6, 0, 6, 6, contrib.map, {label: 'Server Locations'});
  
  // Add a log widget
  const log = grid.set(0, 6, 12, 6, contrib.log, {
    fg: "green",
    label: 'Server Log'
  });
  
  // Add some log entries
  log.log("Server started");
  log.log("Listening on port 8080");
  log.log("Ready to serve dashboards");
  
  // Render the screen
  screen.render();
  
}).listen(8080);

// Handle uncaught exceptions to prevent server crashes
process.on('uncaughtException', (err) => {
  console.error('Error:', err);
});

console.log('Server running on port 8080');
```

## Notes

- These utilities are designed for creating server-side terminal dashboards that can be accessed via HTTP.
- The client needs to properly handle ANSI escape sequences to correctly display the dashboard.
- The `cols` and `rows` parameters determine the size of the virtual terminal.
- Error handling is important when serving dashboards over HTTP, so `serverError` provides a standard way to respond to errors.
- The `OutputBuffer` and `InputBuffer` classes emulate TTY streams for blessed to work in a non-TTY environment.