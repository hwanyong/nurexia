# Question

The Question widget is a modal dialog that prompts the user with a question and provides "Yes" and "No" buttons for response. It is useful for confirmation dialogs and decision points in your application.

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
  content: 'Press the button to show a question dialog.',
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

// Create a button to trigger the question
const button = blessed.button({
  parent: box,
  top: 'center',
  left: 'center',
  width: 'shrink',
  height: 'shrink',
  content: 'Show Question',
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
  // Create a question dialog
  const question = blessed.question({
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
        fg: 'red'
      }
    },
    keys: true,
    mouse: true,
    title: 'Confirmation',
    question: 'Are you sure you want to proceed?',
    vi: true
  });

  // Append the question to the screen
  screen.append(question);

  // Handle question response
  question.on('action', function(answer) {
    box.content = 'You answered: ' + answer;
    screen.render();
  });

  // Focus on the question
  question.focus();

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

### `blessed.question(options)`

Creates a new question element.

**Parameters:**

- `options` (Object): Configuration options for the question

## Options

The Question widget inherits all options from the Box element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `question` | String | The question text to display |
| `title` | String | Title for the question dialog |
| `yes` | String | Text for the "Yes" button. Default: `'Yes'` |
| `no` | String | Text for the "No" button. Default: `'No'` |
| `keys` | Boolean/Array | Use pre-defined keys (i.e. y, n, enter, escape) to answer the question. Default: `false` |
| `mouse` | Boolean | Whether to enable mouse support for this element. Default: `false` |
| `vi` | Boolean | Use vi keys with the keys option. Default: `false` |

### Inherited Options

The Question widget inherits all options from the Box element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The Question widget inherits all properties from the Box element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `question` | String | The question text |
| `title` | String | Title for the question dialog |
| `yes` | String | Text for the "Yes" button |
| `no` | String | Text for the "No" button |

## Methods

The Question widget inherits all methods from the Box element and adds the following:

### Question Management

#### `question.ask(question, callback)`

Asks a question.

**Parameters:**

- `question` (String): The question text
- `callback` (Function): Function to call with the answer

#### `question.setQuestion(question)`

Sets the question text.

**Parameters:**

- `question` (String): The question text

#### `question.setYes(text)`

Sets the text for the "Yes" button.

**Parameters:**

- `text` (String): Text for the "Yes" button

#### `question.setNo(text)`

Sets the text for the "No" button.

**Parameters:**

- `text` (String): Text for the "No" button

#### `question.answer(answer)`

Answers the question.

**Parameters:**

- `answer` (Boolean): The answer (true for "Yes", false for "No")

### Focus Management

#### `question.focus()`

Focuses on the question.

## Events

The Question widget inherits all events from the Box element and adds the following:

| Event | Description |
|-------|-------------|
| `action` | Emitted when the question is answered with the answer (true or false) |
| `yes` | Emitted when the question is answered with "Yes" |
| `no` | Emitted when the question is answered with "No" |
| `cancel` | Emitted when the question is cancelled (Escape key) |
| `keypress` | Emitted when a key is pressed while the question is focused |

## Notes

- The Question widget is a modal dialog that prompts the user with a question and provides "Yes" and "No" buttons for response.
- It is useful for confirmation dialogs and decision points in your application.
- The question can be answered by clicking the "Yes" or "No" buttons, or by pressing the 'y' or 'n' keys (if keys option is enabled).
- The `question` option sets the text of the question to display.
- The `title` option sets the title of the question dialog.
- The `yes` and `no` options allow you to customize the text of the "Yes" and "No" buttons.
- The Question widget extends the Box widget, so it inherits all of its options, methods, and events.
- The question dialog can be customized with different borders, colors, and styles to match the look and feel of your application.