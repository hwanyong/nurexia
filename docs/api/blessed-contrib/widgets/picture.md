# Picture Widget

The Picture widget displays images in the terminal using ASCII/ANSI art. It can load images from files or base64-encoded strings.

## Example

```javascript
const blessed = require('blessed');
const contrib = require('blessed-contrib');

const screen = blessed.screen();

// Create a picture widget from a file
const picture = contrib.picture({
  file: './path/to/image.png',
  cols: 50,
  onReady: () => {
    screen.render();
  }
});

screen.append(picture);
```

## Options

The Picture widget supports the following options:

| Option | Type | Description |
|--------|------|-------------|
| `file` | String | Path to the image file to display |
| `base64` | String | Base64-encoded image data (alternative to `file`) |
| `cols` | Number | Number of columns to use for the image. Controls the width of the rendered image. Default: `50` |
| `onReady` | Function | Callback function that is called when the image is ready to be displayed |

### Inherited Options

The Picture widget inherits all options from the blessed Box element. Common options include:

| Option | Type | Description |
|--------|------|-------------|
| `width` | String/Number | Width of the widget |
| `height` | String/Number | Height of the widget |
| `border` | Object | Border options |
| `style` | Object | Style options for the widget |

## Methods

### `setImage(options)`

Sets or changes the image displayed in the widget.

**Parameters:**

- `options` (Object): Configuration options
  - `file` (String): Path to the image file to display
  - `base64` (String): Base64-encoded image data
  - `cols` (Number): Number of columns to use for the image
  - `onReady` (Function): Callback function that is called when the image is ready

**Example:**

```javascript
picture.setImage({
  file: './path/to/new-image.jpg',
  cols: 60,
  onReady: () => {
    screen.render();
  }
});
```

## Events

The Picture widget inherits all events from the blessed Box element.

## Notes

- The Picture widget uses the `picture-tuber` package to convert images to terminal-friendly format
- Images are rendered using ASCII/ANSI characters and colors
- For best results, use images with good contrast and simple designs
- The `cols` parameter controls the width of the rendered image - higher values give more detail but require more terminal space
- You must call `screen.render()` after the image is ready (using the `onReady` callback) to display it properly
- You can use either a file path or base64-encoded data, but not both simultaneously