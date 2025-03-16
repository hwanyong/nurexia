# Video

The Video widget displays video files in the terminal using ASCII/ANSI art. It is an extension of the Image widget that is specialized for playing video content.

## Example

```javascript
const blessed = require('blessed');
const path = require('path');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a video
const video = blessed.video({
  top: 'center',
  left: 'center',
  width: '80%',
  height: '80%',
  file: path.join(__dirname, 'path/to/video.mp4'),
  style: {
    bg: 'black'
  },
  fps: 24,
  autoplay: true,
  loop: true
});

// Append the video to the screen
screen.append(video);

// Add controls
screen.key(['space'], function() {
  if (video.playing) {
    video.pause();
  } else {
    video.play();
  }
});

screen.key(['r'], function() {
  video.rewind();
});

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  video.stop();
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.video(options)`

Creates a new video element.

**Parameters:**

- `options` (Object): Configuration options for the video

## Options

The Video widget inherits all options from the Image element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `file` | String | Path to the video file to display |
| `fps` | Number | Frames per second to play the video at. Default: `24` |
| `autoplay` | Boolean | Whether to automatically start playing the video. Default: `false` |
| `loop` | Boolean | Whether to loop the video. Default: `false` |
| `volume` | Number | Volume level (0-100). Default: `100` |
| `muted` | Boolean | Whether the video is muted. Default: `false` |
| `renderer` | String | Renderer to use: 'ansi', 'overlay', or 'block'. Default: 'ansi' |

### Inherited Options

The Video widget inherits all options from the Image element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `animate` | Boolean | Whether to animate the video. Default: `true` |
| `optimization` | String | Optimization type: 'mem', 'cpu', or 'none'. Default: 'cpu' |
| `search` | Boolean | Whether to search for the video file. Default: `true` |
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The Video widget inherits all properties from the Image element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `file` | String | Path to the video file |
| `fps` | Number | Frames per second |
| `autoplay` | Boolean | Whether autoplay is enabled |
| `loop` | Boolean | Whether looping is enabled |
| `volume` | Number | Volume level |
| `muted` | Boolean | Whether the video is muted |
| `renderer` | String | Renderer being used |
| `playing` | Boolean | Whether the video is currently playing |
| `currentTime` | Number | Current playback time in seconds |
| `duration` | Number | Total duration of the video in seconds |

## Methods

The Video widget inherits all methods from the Image element and adds the following:

### Playback Control

#### `video.play()`

Starts or resumes playback of the video.

#### `video.pause()`

Pauses playback of the video.

#### `video.stop()`

Stops playback of the video and resets to the beginning.

#### `video.rewind()`

Rewinds the video to the beginning.

#### `video.seek(time)`

Seeks to a specific time in the video.

**Parameters:**

- `time` (Number): Time in seconds to seek to

#### `video.setVolume(volume)`

Sets the volume level.

**Parameters:**

- `volume` (Number): Volume level (0-100)

#### `video.mute()`

Mutes the video.

#### `video.unmute()`

Unmutes the video.

#### `video.toggleMute()`

Toggles the muted state of the video.

### Video Management

#### `video.setVideo(file, callback)`

Sets the video file to display.

**Parameters:**

- `file` (String): Path to the video file
- `callback` (Function): Function to call when the video is loaded

#### `video.clearVideo()`

Clears the current video.

### Rendering

#### `video.render()`

Renders the video.

## Events

The Video widget inherits all events from the Image element and adds the following:

| Event | Description |
|-------|-------------|
| `load` | Emitted when the video is loaded |
| `error` | Emitted when there is an error loading the video |
| `play` | Emitted when playback starts |
| `pause` | Emitted when playback is paused |
| `stop` | Emitted when playback stops |
| `seek` | Emitted when seeking to a specific time |
| `timeupdate` | Emitted when the current playback time updates |
| `ended` | Emitted when playback reaches the end |
| `volumechange` | Emitted when the volume changes |
| `mute` | Emitted when the video is muted |
| `unmute` | Emitted when the video is unmuted |

## Notes

- The Video widget displays video files in the terminal using ASCII/ANSI art.
- It is an extension of the Image widget that is specialized for playing video content.
- The `fps` option determines the frames per second at which the video is played. Higher values result in smoother playback but may be more resource-intensive.
- The `autoplay` option determines whether the video automatically starts playing when it is loaded.
- The `loop` option determines whether the video automatically restarts from the beginning when it reaches the end.
- The `volume` option sets the volume level for the video (if audio is supported).
- The `muted` option determines whether the video is muted (if audio is supported).
- The `renderer` option determines how the video is rendered:
  - `'ansi'`: Uses ANSI escape sequences to render the video
  - `'overlay'`: Uses a special overlay technique to render the video with better quality
  - `'block'`: Uses block characters to render the video
- The Video widget extends the Image widget, so it inherits all of its options, methods, and events.
- The video quality and appearance may vary depending on the terminal and the renderer used.
- Video playback in the terminal is resource-intensive and may not perform well on all systems.
- Audio playback may not be supported in all environments.