# ANSIImage

The ANSIImage widget displays images in the terminal using ANSI escape sequences. It is a specialized version of the Image widget that is optimized for displaying images using ANSI color codes.

## Example

```javascript
const blessed = require('blessed');
const path = require('path');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create an ANSI image
const ansiImage = blessed.ansiimage({
  top: 'center',
  left: 'center',
  width: '80%',
  height: '80%',
  file: path.join(__dirname, 'path/to/image.png'),
  style: {
    bg: 'black'
  }
});

// Append the ANSI image to the screen
screen.append(ansiImage);

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.ansiimage(options)`

Creates a new ANSI image element.

**Parameters:**

- `options` (Object): Configuration options for the ANSI image

## Options

The ANSIImage widget inherits all options from the Image element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `scale` | Number | Scale factor for the image. Default: `1.0` |
| `width` | Number | Width of the image in cells |
| `height` | Number | Height of the image in cells |
| `ascii` | Boolean | Whether to use ASCII characters instead of block characters. Default: `false` |
| `colors` | Number | Number of colors to use (8, 16, 256, or 16777216). Default: `256` |
| `transparent` | Boolean | Whether to use transparency. Default: `false` |
| `dither` | Boolean | Whether to dither the image. Default: `false` |

### Inherited Options

The ANSIImage widget inherits all options from the Image element. Some commonly used options include:

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

## Properties

The ANSIImage widget inherits all properties from the Image element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `scale` | Number | Scale factor for the image |
| `ascii` | Boolean | Whether ASCII characters are used |
| `colors` | Number | Number of colors used |
| `transparent` | Boolean | Whether transparency is enabled |
| `dither` | Boolean | Whether dithering is enabled |

## Methods

The ANSIImage widget inherits all methods from the Image element and adds the following:

### Image Management

#### `ansiimage.setImage(file, callback)`

Sets the image file to display.

**Parameters:**

- `file` (String): Path to the image file
- `callback` (Function): Function to call when the image is loaded

#### `ansiimage.clearImage()`

Clears the current image.

#### `ansiimage.play()`

Starts animation for animated images.

#### `ansiimage.pause()`

Pauses animation for animated images.

#### `ansiimage.stop()`

Stops animation for animated images.

#### `ansiimage.tint(color)`

Tints the image with the specified color.

**Parameters:**

- `color` (String): Color to tint the image with

### Rendering

#### `ansiimage.render()`

Renders the ANSI image.

## Events

The ANSIImage widget inherits all events from the Image element:

| Event | Description |
|-------|-------------|
| `load` | Emitted when the image is loaded |
| `error` | Emitted when there is an error loading the image |
| `play` | Emitted when animation starts |
| `pause` | Emitted when animation is paused |
| `stop` | Emitted when animation stops |
| `frame` | Emitted when a new frame is displayed (for animated images) |

## Notes

- The ANSIImage widget displays images in the terminal using ANSI escape sequences.
- It is a specialized version of the Image widget that is optimized for displaying images using ANSI color codes.
- The `scale` option allows you to resize the image. A value of `1.0` means the image will be displayed at its original size.
- The `ascii` option determines whether to use ASCII characters instead of block characters for rendering the image.
- The `colors` option determines the number of colors to use for rendering the image. The available options are 8, 16, 256, or 16777216 (true color).
- The `transparent` option determines whether to use transparency when rendering the image.
- The `dither` option determines whether to dither the image, which can improve the appearance of images with limited colors.
- The ANSIImage widget extends the Image widget, so it inherits all of its options, methods, and events.
- The image quality and appearance may vary depending on the terminal and the options used.