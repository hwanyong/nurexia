# Message

The Message widget is a modal dialog that displays a message to the user with an "OK" button to dismiss it. It is useful for showing information, alerts, or notifications in your application.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a box for the main content
const box = blessed.box({
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  content: 'Press the button to show a message dialog.',
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: 'blue'
    }
  }
});

// Create a button to trigger the message
const button = blessed.button({
  parent: box,
  top: 'center',
  left: 'center',
  width: 'shrink',
  height: 'shrink',
  content: 'Show Message',
  padding: {
    left: 1,
    right: 1
  },
  style: {
    fg: 'white',
    bg: 'green',
    focus: {
      bg: 'red'
    }
  }
});

// Append the box to the screen
screen.append(box);

// Focus on the button
button.focus();

// Handle button press
button.on('press', function() {
  // Create a message dialog
  const message = blessed.message({
    top: 'center',
    left: 'center',
    width: '50%',
    height: 'shrink',
    border: {
      type: 'line'
    },
    style: {
      fg: 'white',
      bg: 'black',
      border: {
        fg: 'blue'
      }
    },
    keys: true,
    mouse: true,
    title: 'Information',
    content: 'This is a message dialog.\n\nClick OK to dismiss.',
    vi: true
  });

  // Append the message to the screen
  screen.append(message);

  // Handle message dismissal
  message.on('action', function() {
    box.content = 'Message dismissed!';
    screen.render();
  });

  // Focus on the message
  message.focus();

  // Render the screen
  screen.render();
});

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.message(options)`

Creates a new message element.

**Parameters:**

- `options` (Object): Configuration options for the message

## Options

The Message widget inherits all options from the Box element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `content` | String | The message text to display |
| `title` | String | Title for the message dialog |
| `ok` | String | Text for the "OK" button. Default: `'OK'` |
| `keys` | Boolean/Array | Use pre-defined keys (i.e. enter, escape) to dismiss the message. Default: `false` |
| `mouse` | Boolean | Whether to enable mouse support for this element. Default: `false` |
| `vi` | Boolean | Use vi keys with the keys option. Default: `false` |

### Inherited Options

The Message widget inherits all options from the Box element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The Message widget inherits all properties from the Box element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `content` | String | The message text |
| `title` | String | Title for the message dialog |
| `ok` | String | Text for the "OK" button |

## Methods

The Message widget inherits all methods from the Box element and adds the following:

### Message Management

#### `message.display(message, callback)`

Displays a message.

**Parameters:**

- `message` (String): The message text
- `callback` (Function): Function to call when the message is dismissed

#### `message.setMessage(message)`

Sets the message text.

**Parameters:**

- `message` (String): The message text

#### `message.setOK(text)`

Sets the text for the "OK" button.

**Parameters:**

- `text` (String): Text for the "OK" button

#### `message.dismiss()`

Dismisses the message.

### Focus Management

#### `message.focus()`

Focuses on the message.

## Events

The Message widget inherits all events from the Box element and adds the following:

| Event | Description |
|-------|-------------|
| `action` | Emitted when the message is dismissed |
| `ok` | Emitted when the message is dismissed with the "OK" button |
| `cancel` | Emitted when the message is cancelled (Escape key) |
| `keypress` | Emitted when a key is pressed while the message is focused |

## Notes

- The Message widget is a modal dialog that displays a message to the user with an "OK" button to dismiss it.
- It is useful for showing information, alerts, or notifications in your application.
- The message can be dismissed by clicking the "OK" button or by pressing the Enter key (if keys option is enabled).
- The `content` option sets the text of the message to display.
- The `title` option sets the title of the message dialog.
- The `ok` option allows you to customize the text of the "OK" button.
- The Message widget extends the Box widget, so it inherits all of its options, methods, and events.
- The message dialog can be customized with different borders, colors, and styles to match the look and feel of your application.