# RadioButton

The RadioButton widget is an interactive element that allows users to select one option from a group of options. It is typically used within a RadioSet to create a group of mutually exclusive options.

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
  height: 20,
  border: {
    type: 'line'
  },
  style: {
    border: {
      fg: 'blue'
    }
  }
});

// Create a radio set
const radioSet = blessed.radioset({
  parent: form,
  top: 2,
  left: 2,
  width: 'shrink',
  height: 'shrink',
  label: 'Select an option:',
  style: {
    label: {
      fg: 'blue',
      bold: true
    }
  }
});

// Create radio buttons
const radio1 = blessed.radiobutton({
  parent: radioSet,
  top: 0,
  left: 0,
  width: 'shrink',
  height: 'shrink',
  content: 'Option 1',
  checked: true
});

const radio2 = blessed.radiobutton({
  parent: radioSet,
  top: 1,
  left: 0,
  width: 'shrink',
  height: 'shrink',
  content: 'Option 2'
});

const radio3 = blessed.radiobutton({
  parent: radioSet,
  top: 2,
  left: 0,
  width: 'shrink',
  height: 'shrink',
  content: 'Option 3'
});

// Create a submit button
const submit = blessed.button({
  parent: form,
  top: 6,
  left: 2,
  width: 'shrink',
  height: 'shrink',
  content: 'Submit',
  style: {
    bg: 'blue',
    fg: 'white',
    focus: {
      bg: 'red'
    }
  },
  padding: {
    left: 1,
    right: 1
  }
});

// Handle submit button press
submit.on('press', function() {
  let selectedOption = '';
  if (radio1.checked) selectedOption = 'Option 1';
  if (radio2.checked) selectedOption = 'Option 2';
  if (radio3.checked) selectedOption = 'Option 3';

  form.setContent(`You selected: ${selectedOption}`);
  screen.render();
});

// Append the form to the screen
screen.append(form);

// Focus on the form
form.focus();

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.radiobutton(options)`

Creates a new radio button element.

**Parameters:**

- `options` (Object): Configuration options for the radio button

## Options

The RadioButton widget inherits all options from the Checkbox element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `checked` | Boolean | Whether the radio button is checked. Default: `false` |
| `content` | String | The text content displayed next to the radio button |
| `radio` | String | The character to use for the radio button. Default: `'◉'` |
| `text` | String | Alias for `content` |

### Inherited Options

The RadioButton widget inherits all options from the Checkbox element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `mouse` | Boolean | Whether to enable mouse support for this element. Default: `false` |
| `keys` | Boolean/Array | Use pre-defined keys (i.e. space) to toggle the radio button. Default: `false` |
| `align` | String | Text alignment: 'left', 'center', or 'right'. Default: 'left' |
| `padding` | Number/Object | Padding inside the radio button |
| `style` | Object | Style object |
| `border` | Object/String | Border object or border type |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The RadioButton widget inherits all properties from the Checkbox element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `checked` | Boolean | Whether the radio button is checked |
| `value` | Boolean | The value of the radio button (same as checked) |
| `text` | String | The text content displayed next to the radio button |

## Methods

The RadioButton widget inherits all methods from the Checkbox element and adds the following:

### Radio Button Management

#### `radiobutton.check()`

Checks the radio button, unchecking all other radio buttons in the same radio set, and emits the 'check' event.

#### `radiobutton.uncheck()`

Unchecks the radio button and emits the 'uncheck' event.

#### `radiobutton.toggle()`

Toggles the radio button state, unchecking all other radio buttons in the same radio set if this one becomes checked, and emits either the 'check' or 'uncheck' event.

#### `radiobutton.setValue(value)`

Sets the value (checked state) of the radio button.

**Parameters:**

- `value` (Boolean): The value to set

#### `radiobutton.getValue()`

Gets the current value (checked state) of the radio button.

**Returns:**

- Boolean: The current value of the radio button

#### `radiobutton.setContent(text)`

Sets the text content displayed next to the radio button.

**Parameters:**

- `text` (String): The text to set

#### `radiobutton.getContent()`

Gets the text content displayed next to the radio button.

**Returns:**

- String: The text content

### Focus Management

#### `radiobutton.focus()`

Focuses on the radio button.

## Events

The RadioButton widget inherits all events from the Checkbox element and adds the following:

| Event | Description |
|-------|-------------|
| `check` | Emitted when the radio button is checked |
| `uncheck` | Emitted when the radio button is unchecked |
| `click` | Emitted when the radio button is clicked with the mouse |
| `mouseover` | Emitted when the mouse moves over the radio button |
| `mouseout` | Emitted when the mouse moves out of the radio button |
| `mousedown` | Emitted when a mouse button is pressed down on the radio button |
| `mouseup` | Emitted when a mouse button is released on the radio button |
| `keypress` | Emitted when a key is pressed while the radio button is focused |

## Notes

- The RadioButton widget is an interactive element that allows users to select one option from a group of options.
- It is typically used within a RadioSet to create a group of mutually exclusive options.
- When one radio button in a radio set is checked, all other radio buttons in the same set are automatically unchecked.
- The radio button can be toggled by clicking it with the mouse or by pressing the Space key when it is focused.
- The `style.hover` option can be used to change the appearance of the radio button when the mouse is over it.
- The `style.focus` option can be used to change the appearance of the radio button when it is focused.
- The RadioButton widget extends the Checkbox widget, so it inherits all of its options, methods, and events.
- The radio button can be customized with different borders, colors, and styles to match the look and feel of your application.
- The `radio` option can be used to customize the character displayed when the radio button is checked.