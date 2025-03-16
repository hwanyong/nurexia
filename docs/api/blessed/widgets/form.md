# Form

The Form widget is a container for form elements like input fields, buttons, checkboxes, and more. It provides functionality for submitting and resetting form data.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a form
const form = blessed.form({
  top: 'center',
  left: 'center',
  width: 50,
  height: 12,
  border: {
    type: 'line'
  },
  style: {
    border: {
      fg: 'blue'
    }
  }
});

// Create a text label
const label = blessed.text({
  parent: form,
  top: 1,
  left: 2,
  content: 'Username:'
});

// Create a text input
const username = blessed.textbox({
  parent: form,
  name: 'username',
  top: 2,
  left: 2,
  width: 40,
  height: 1,
  inputOnFocus: true,
  border: {
    type: 'line'
  }
});

// Create a text label
const passwordLabel = blessed.text({
  parent: form,
  top: 4,
  left: 2,
  content: 'Password:'
});

// Create a text input for password
const password = blessed.textbox({
  parent: form,
  name: 'password',
  top: 5,
  left: 2,
  width: 40,
  height: 1,
  inputOnFocus: true,
  censor: true,
  border: {
    type: 'line'
  }
});

// Create a submit button
const submit = blessed.button({
  parent: form,
  name: 'submit',
  content: 'Submit',
  top: 8,
  left: 10,
  width: 10,
  height: 1,
  border: {
    type: 'line'
  },
  style: {
    focus: {
      bg: 'blue'
    },
    hover: {
      bg: 'blue'
    }
  }
});

// Create a reset button
const reset = blessed.button({
  parent: form,
  name: 'reset',
  content: 'Reset',
  top: 8,
  left: 30,
  width: 10,
  height: 1,
  border: {
    type: 'line'
  },
  style: {
    focus: {
      bg: 'blue'
    },
    hover: {
      bg: 'blue'
    }
  }
});

// Add event handlers
submit.on('press', function() {
  form.submit();
});

reset.on('press', function() {
  form.reset();
});

form.on('submit', function(data) {
  screen.destroy();
  console.log('Form submitted with data:', data);
  process.exit(0);
});

form.on('reset', function() {
  console.log('Form reset');
});

// Focus on the first input
username.focus();

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.form(options)`

Creates a new form element.

**Parameters:**

- `options` (Object): Configuration options for the form

## Options

The Form widget inherits all options from the ScrollableBox element.

### Inherited Options

The Form widget inherits all options from the ScrollableBox element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `keys` | Boolean/Array | Use pre-defined keys (i.e. up, down) to navigate the form. Default: `false` |
| `vi` | Boolean | Use vi keys with the keys option. Default: `false` |
| `mouse` | Boolean | Whether to enable automatic mouse support for this element. Default: `false` |
| `scrollbar` | Object | Object enabling a scrollbar |
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The Form widget inherits all properties from the ScrollableBox element.

## Methods

The Form widget inherits all methods from the ScrollableBox element and adds the following:

### Form Management

#### `form.submit()`

Submits the form, emitting the 'submit' event with the form data.

**Returns:**

- Object: The form data

#### `form.reset()`

Resets the form, clearing all input fields and emitting the 'reset' event.

#### `form.getValue()`

Gets the current values of all form elements.

**Returns:**

- Object: The form data

### Focus Management

#### `form.focusNext()`

Focuses on the next form element.

#### `form.focusPrevious()`

Focuses on the previous form element.

#### `form.focus()`

Focuses on the form or its first child element.

## Events

The Form widget inherits all events from the ScrollableBox element and adds the following:

| Event | Description |
|-------|-------------|
| `submit` | Emitted when the form is submitted |
| `reset` | Emitted when the form is reset |

## Notes

- The Form widget is a container for form elements like input fields, buttons, checkboxes, and more.
- Form elements should have a `name` property to be included in the form data when submitted.
- The form data is an object where the keys are the names of the form elements and the values are their current values.
- You can submit the form programmatically using the `submit()` method or by pressing the Enter key when a form element is focused.
- You can reset the form programmatically using the `reset()` method.
- The Form widget extends the ScrollableBox widget, so it inherits all of its options, methods, and events.
- Form elements can be added to the form using the `parent` option when creating the element or by using the `append()` method.