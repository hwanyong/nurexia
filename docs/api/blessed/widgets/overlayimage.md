# OverlayImage

The OverlayImage widget displays images in the terminal using a special overlay technique that provides better quality than standard ANSI rendering. It is a specialized version of the Image widget that is optimized for displaying high-quality images in the terminal.

## Example

```javascript
const blessed = require('blessed');
const path = require('path');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create an overlay image
const overlayImage = blessed.overlayimage({
  top: 'center',
  left: 'center',
  width: '80%',
  height: '80%',
  file: path.join(__dirname, 'path/to/image.png'),
  style: {
    bg: 'black'
  }
});

// Append the overlay image to the screen
screen.append(overlayImage);

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.overlayimage(options)`

Creates a new overlay image element.

**Parameters:**

- `options` (Object): Configuration options for the overlay image

## Options

The OverlayImage widget inherits all options from the Image element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `overlayMode` | String | Overlay mode: 'opaque' or 'transparent'. Default: `'transparent'` |
| `ratio` | Number | Aspect ratio for the image. Default: `1.0` |
| `preserveAspectRatio` | Boolean | Whether to preserve the aspect ratio. Default: `true` |
| `resizeToFit` | Boolean | Whether to resize the image to fit the element. Default: `true` |

### Inherited Options

The OverlayImage widget inherits all options from the Image element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `file` | String | Path to the image file to display |
| `animate` | Boolean | Whether to animate the image (for GIFs). Default: `false` |
| `optimization` | String | Optimization type: 'mem', 'cpu', or 'none'. Default: 'cpu' |
| `search` | Boolean | Whether to search for the image file. Default: `true` |
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The OverlayImage widget inherits all properties from the Image element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `overlayMode` | String | Overlay mode |
| `ratio` | Number | Aspect ratio for the image |
| `preserveAspectRatio` | Boolean | Whether aspect ratio is preserved |
| `resizeToFit` | Boolean | Whether the image is resized to fit |

## Methods

The OverlayImage widget inherits all methods from the Image element and adds the following:

### Image Management

#### `overlayimage.setImage(file, callback)`

Sets the image file to display.

**Parameters:**

- `file` (String): Path to the image file
- `callback` (Function): Function to call when the image is loaded

#### `overlayimage.clearImage()`

Clears the current image.

#### `overlayimage.play()`

Starts animation for animated images.

#### `overlayimage.pause()`

Pauses animation for animated images.

#### `overlayimage.stop()`

Stops animation for animated images.

#### `overlayimage.tint(color)`

Tints the image with the specified color.

**Parameters:**

- `color` (String): Color to tint the image with

### Rendering

#### `overlayimage.render()`

Renders the overlay image.

## Events

The OverlayImage widget inherits all events from the Image element:

| Event | Description |
|-------|-------------|
| `load` | Emitted when the image is loaded |
| `error` | Emitted when there is an error loading the image |
| `play` | Emitted when animation starts |
| `pause` | Emitted when animation is paused |
| `stop` | Emitted when animation stops |
| `frame` | Emitted when a new frame is displayed (for animated images) |

## Notes

- The OverlayImage widget displays images in the terminal using a special overlay technique that provides better quality than standard ANSI rendering.
- It is a specialized version of the Image widget that is optimized for displaying high-quality images in the terminal.
- The `overlayMode` option determines how the image is rendered:
  - `'transparent'`: The image is rendered with transparency
  - `'opaque'`: The image is rendered without transparency
- The `ratio` option allows you to adjust the aspect ratio of the image.
- The `preserveAspectRatio` option determines whether to preserve the aspect ratio of the image when resizing.
- The `resizeToFit` option determines whether to resize the image to fit the element.
- The OverlayImage widget extends the Image widget, so it inherits all of its options, methods, and events.
- The image quality and appearance may vary depending on the terminal and the options used.
- The overlay technique used by this widget may not be supported in all terminals.