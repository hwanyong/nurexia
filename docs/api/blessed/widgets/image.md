# Image

The Image widget displays images in the terminal using ASCII/ANSI art. It can load images from files and render them using terminal-friendly characters and colors.

## Example

```javascript
const blessed = require('blessed');
const path = require('path');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create an image
const image = blessed.image({
  top: 'center',
  left: 'center',
  type: 'overlay',
  width: '80%',
  height: '80%',
  file: path.join(__dirname, 'path/to/image.png'),
  search: false,
  style: {
    bg: 'black'
  }
});

// Append the image to the screen
screen.append(image);

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.image(options)`

Creates a new image element.

**Parameters:**

- `options` (Object): Configuration options for the image

## Options

The Image widget inherits all options from the Box element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `file` | String | Path to the image file to display |
| `type` | String | Type of image rendering: 'ansi', 'overlay', or 'block'. Default: 'ansi' |
| `animate` | Boolean | Whether to animate the image (for GIFs). Default: `false` |
| `optimization` | String | Optimization type: 'mem', 'cpu', or 'none'. Default: 'cpu' |
| `search` | Boolean | Whether to search for the image file. Default: `true` |
| `w3m` | Boolean | Whether to use w3m to render the image. Default: `false` |
| `w3m_delay` | Number | Delay for w3m rendering. Default: `0` |
| `w3m_command` | String | Command for w3m rendering. Default: `'w3m'` |

### Inherited Options

The Image widget inherits all options from the Box element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The Image widget inherits all properties from the Box element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `file` | String | Path to the image file |
| `type` | String | Type of image rendering |
| `animate` | Boolean | Whether animation is enabled |
| `optimization` | String | Optimization type |
| `search` | Boolean | Whether search is enabled |
| `w3m` | Boolean | Whether w3m is enabled |
| `w3m_delay` | Number | Delay for w3m rendering |
| `w3m_command` | String | Command for w3m rendering |

## Methods

The Image widget inherits all methods from the Box element and adds the following:

### Image Management

#### `image.setImage(file, callback)`

Sets the image file to display.

**Parameters:**

- `file` (String): Path to the image file
- `callback` (Function): Function to call when the image is loaded

#### `image.clearImage()`

Clears the current image.

#### `image.play()`

Starts animation for animated images.

#### `image.pause()`

Pauses animation for animated images.

#### `image.stop()`

Stops animation for animated images.

#### `image.tint(color)`

Tints the image with the specified color.

**Parameters:**

- `color` (String): Color to tint the image with

### Rendering

#### `image.render()`

Renders the image.

## Events

The Image widget inherits all events from the Box element and adds the following:

| Event | Description |
|-------|-------------|
| `load` | Emitted when the image is loaded |
| `error` | Emitted when there is an error loading the image |
| `play` | Emitted when animation starts |
| `pause` | Emitted when animation is paused |
| `stop` | Emitted when animation stops |
| `frame` | Emitted when a new frame is displayed (for animated images) |

## Notes

- The Image widget displays images in the terminal using ASCII/ANSI art.
- It can load images from files and render them using terminal-friendly characters and colors.
- The `type` option determines how the image is rendered:
  - `'ansi'`: Uses ANSI escape sequences to render the image
  - `'overlay'`: Uses a special overlay technique to render the image with better quality
  - `'block'`: Uses block characters to render the image
- The `animate` option enables animation for GIFs and other animated image formats.
- The `optimization` option determines the optimization strategy:
  - `'mem'`: Optimizes for memory usage
  - `'cpu'`: Optimizes for CPU usage
  - `'none'`: No optimization
- The `search` option determines whether to search for the image file if it's not found at the specified path.
- The `w3m` option enables rendering using the w3m web browser, which can provide better image quality in some terminals.
- The Image widget extends the Box widget, so it inherits all of its options, methods, and events.
- The image quality and appearance may vary depending on the terminal and the rendering type used.