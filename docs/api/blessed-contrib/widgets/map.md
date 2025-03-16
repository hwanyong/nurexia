# Map Widget

The Map widget displays a world map in the terminal with the ability to add location markers. It's useful for visualizing geographical data or locations.

## Import

```javascript
const contrib = require('blessed-contrib');
const map = contrib.map(options);
```

## Constructor

### `contrib.map(options)`

Creates a new map widget.

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `label` | String | No | - | The title of the map |
| `region` | String | No | - | Region to display (e.g., 'us' for United States) |
| `startLon` | Number | No | - | Starting longitude for the map view |
| `endLon` | Number | No | - | Ending longitude for the map view |
| `startLat` | Number | No | - | Starting latitude for the map view |
| `endLat` | Number | No | - | Ending latitude for the map view |
| `excludeAntarctica` | Boolean | No | `true` | Whether to exclude Antarctica from the map |
| `disableBackground` | Boolean | No | `true` | Whether to disable the background of the entire widget |
| `disableMapBackground` | Boolean | No | `true` | Whether to disable the background of the map itself |
| `disableGraticule` | Boolean | No | `true` | Whether to disable the grid lines on the map |
| `disableFill` | Boolean | No | `true` | Whether to disable filling of land shapes |
| `labelSpace` | Number | No | `5` | Space for labels |
| `markers` | Array | No | - | Array of markers to display on the map (see Marker Format below) |
| `style` | Object | No | *see below* | Style configuration for the map |

#### Style Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `shapeColor` | String | 'green' | Color of map land shapes |
| `stroke` | String | 'green' | Border color for map shapes |
| `fill` | String | 'green' | Fill color for map shapes |

#### Marker Format

Each marker in the `markers` array should be an object with the following properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `lon` | String | Yes | Longitude as a string (e.g., '-79.0000') |
| `lat` | String | Yes | Latitude as a string (e.g., '37.5000') |
| `color` | String | No | Color of the marker |
| `char` | String | No | Character to use for the marker |

## Methods

### `addMarker(options)`

Adds a marker to the map.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `options` | Object | Marker configuration object (see Marker Format above) |

### `clearMarkers()`

Removes all markers from the map and redraws it.

## Example

```javascript
const blessed = require('blessed');
const contrib = require('blessed-contrib');

// Create screen
const screen = blessed.screen();

// Create map
const map = contrib.map({
  label: 'World Map',
  style: {
    shapeColor: 'blue',
    stroke: 'blue',
    fill: 'blue'
  },
  height: '50%',
  width: '50%',
  top: 0,
  left: 0
});

// Add it to the screen
screen.append(map);

// Add markers
map.addMarker({
  lon: '-122.4194',
  lat: '37.7749',
  color: 'red',
  char: 'X'  // San Francisco
});

map.addMarker({
  lon: '2.3522',
  lat: '48.8566',
  color: 'yellow',
  char: 'O'  // Paris
});

map.addMarker({
  lon: '139.6917',
  lat: '35.6895',
  color: 'green',
  char: '+'  // Tokyo
});

// Render the screen
screen.render();

// Handle exit
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});
```

## Notes

- You must add markers after the map has been attached to the screen via `screen.append()`.
- The map uses the `map-canvas` library under the hood to render the world map.
- You can focus on specific regions by setting the `startLon`, `endLon`, `startLat`, and `endLat` options.
- The `region` option provides a shortcut for focusing on a specific area (like 'us' for the United States).
- The map is drawn using ASCII characters, so the resolution is limited by the terminal's character grid.
- Longitude values range from -180 (West) to 180 (East), and latitude values range from -90 (South) to 90 (North).