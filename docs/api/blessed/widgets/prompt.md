# Prompt

The Prompt widget is a modal dialog that prompts the user for input. It is useful for getting user input in a non-blocking way, such as asking for confirmation, collecting text input, or selecting from a list of options.

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
  content: 'Press the button to show a prompt dialog.',
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

// Create a button to trigger the prompt
const button = blessed.button({
  parent: box,
  top: 'center',
  left: 'center',
  width: 'shrink',
  height: 'shrink',
  content: 'Show Prompt',
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
  // Create a prompt dialog
  const prompt = blessed.prompt({
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
    title: 'Input',
    label: 'Please enter your name:',
    inputOnFocus: true
  });

  // Append the prompt to the screen
  screen.append(prompt);

  // Handle prompt submission
  prompt.input('', function(err, value) {
    if (err) {
      box.content = 'Prompt cancelled!';
    } else {
      box.content = `Hello, ${value}!`;
    }
    screen.render();
  });

  // Focus on the prompt
  prompt.focus();

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

### `blessed.prompt(options)`

Creates a new prompt element.

**Parameters:**

- `options` (Object): Configuration options for the prompt

## Options

The Prompt widget inherits all options from the Box element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `label` | String | Label text for the prompt |
| `title` | String | Title for the prompt dialog |
| `inputOnFocus` | Boolean | Whether to automatically enter input mode when the element is focused. Default: `false` |
| `keys` | Boolean/Array | Use pre-defined keys (i.e. enter, escape) to submit or cancel the prompt. Default: `false` |
| `mouse` | Boolean | Whether to enable mouse support for this element. Default: `false` |
| `vi` | Boolean | Use vi keys with the keys option. Default: `false` |

### Inherited Options

The Prompt widget inherits all options from the Box element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The Prompt widget inherits all properties from the Box element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `label` | String | Label text for the prompt |
| `title` | String | Title for the prompt dialog |
| `inputOnFocus` | Boolean | Whether to automatically enter input mode when the element is focused |

## Methods

The Prompt widget inherits all methods from the Box element and adds the following:

### Prompt Management

#### `prompt.input(text, callback)`

Prompts the user for input.

**Parameters:**

- `text` (String): Initial text for the input
- `callback` (Function): Function to call when the prompt is submitted or cancelled
  - `err` (Error): Error object if the prompt was cancelled, null otherwise
  - `value` (String): The input value if the prompt was submitted

#### `prompt.setLabel(text)`

Sets the label text for the prompt.

**Parameters:**

- `text` (String): The label text

#### `prompt.setTitle(text)`

Sets the title for the prompt dialog.

**Parameters:**

- `text` (String): The title text

#### `prompt.submit()`

Submits the prompt, emitting the 'submit' event with the current input value.

#### `prompt.cancel()`

Cancels the prompt, emitting the 'cancel' event.

### Focus Management

#### `prompt.focus()`

Focuses on the prompt.

## Events

The Prompt widget inherits all events from the Box element and adds the following:

| Event | Description |
|-------|-------------|
| `submit` | Emitted when the prompt is submitted (Enter key) |
| `cancel` | Emitted when the prompt is cancelled (Escape key) |
| `action` | Emitted when any action is performed on the prompt |
| `keypress` | Emitted when a key is pressed while the prompt is focused |

## Notes

- The Prompt widget is a modal dialog that prompts the user for input.
- It is useful for getting user input in a non-blocking way, such as asking for confirmation, collecting text input, or selecting from a list of options.
- The prompt can be submitted by pressing the Enter key or cancelled by pressing the Escape key.
- The `label` option sets the text displayed above the input field.
- The `title` option sets the title of the prompt dialog.
- The `inputOnFocus` option is useful for automatically entering input mode when the prompt is focused.
- The Prompt widget extends the Box widget, so it inherits all of its options, methods, and events.
- The prompt dialog can be customized with different borders, colors, and styles to match the look and feel of your application.