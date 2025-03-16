# RadioSet and RadioButton

The RadioSet and RadioButton widgets work together to create a group of radio buttons where only one option can be selected at a time. The RadioSet acts as a container for RadioButton elements, managing their state and ensuring that only one button in the set is checked.

## RadioSet

### Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a radio set
const radioSet = blessed.radioset({
  top: 'center',
  left: 'center',
  width: 30,
  height: 10,
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

// Create radio buttons
const radio1 = blessed.radiobutton({
  parent: radioSet,
  top: 1,
  left: 2,
  content: 'Option 1',
  checked: true
});

const radio2 = blessed.radiobutton({
  parent: radioSet,
  top: 3,
  left: 2,
  content: 'Option 2'
});

const radio3 = blessed.radiobutton({
  parent: radioSet,
  top: 5,
  left: 2,
  content: 'Option 3'
});

// Append the radio set to the screen
screen.append(radioSet);

// Focus on the radio set
radioSet.focus();

// Handle radio button selection
radio1.on('check', function() {
  console.log('Option 1 selected');
});

radio2.on('check', function() {
  console.log('Option 2 selected');
});

radio3.on('check', function() {
  console.log('Option 3 selected');
});

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

### Constructor

#### `blessed.radioset(options)`

Creates a new radio set element.

**Parameters:**

- `options` (Object): Configuration options for the radio set

### Options

The RadioSet widget inherits all options from the Box element:

| Option | Type | Description |
|--------|------|-------------|
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |
| `mouse` | Boolean | Whether to enable mouse support for this element. Default: `false` |
| `keys` | Boolean/Array | Use pre-defined keys to navigate the radio set. Default: `false` |

### Properties

The RadioSet widget inherits all properties from the Box element.

### Methods

The RadioSet widget inherits all methods from the Box element.

### Events

The RadioSet widget inherits all events from the Box element.

## RadioButton

### Constructor

#### `blessed.radiobutton(options)`

Creates a new radio button element.

**Parameters:**

- `options` (Object): Configuration options for the radio button

### Options

The RadioButton widget inherits all options from the Checkbox element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `checked` | Boolean | Whether the radio button is checked. Default: `false` |
| `content` | String | The text content displayed next to the radio button |
| `check` | String | The character to use for the checked state. Default: `'◉'` |
| `uncheck` | String | The character to use for the unchecked state. Default: `'◯'` |
| `mouse` | Boolean | Whether to enable mouse support for this element. Default: `false` |
| `keys` | Boolean/Array | Use pre-defined keys (i.e. space) to toggle the radio button. Default: `false` |
| `align` | String | Text alignment: 'left', 'center', or 'right'. Default: 'left' |
| `padding` | Number/Object | Padding inside the radio button |

### Inherited Options

The RadioButton widget inherits all options from the Checkbox element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

### Properties

The RadioButton widget inherits all properties from the Checkbox element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `checked` | Boolean | Whether the radio button is checked |
| `value` | Boolean | The value of the radio button (same as checked) |
| `text` | String | The text content displayed next to the radio button |

### Methods

The RadioButton widget inherits all methods from the Checkbox element and adds the following:

#### `radiobutton.check()`

Checks the radio button and unchecks all other radio buttons in the same set, emitting the 'check' event.

#### `radiobutton.uncheck()`

Unchecks the radio button, emitting the 'uncheck' event.

#### `radiobutton.toggle()`

Toggles the radio button state, emitting either the 'check' or 'uncheck' event.

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

### Events

The RadioButton widget inherits all events from the Checkbox element and adds the following:

| Event | Description |
|-------|-------------|
| `check` | Emitted when the radio button is checked |
| `uncheck` | Emitted when the radio button is unchecked |

## Notes

- The RadioSet and RadioButton widgets work together to create a group of radio buttons where only one option can be selected at a time.
- The RadioSet acts as a container for RadioButton elements, managing their state and ensuring that only one button in the set is checked.
- When a RadioButton is checked, all other RadioButtons in the same set are automatically unchecked.
- The radio button can be toggled by clicking it with the mouse or by pressing the Space key when it is focused.
- The `check` and `uncheck` options can be used to customize the characters displayed when the radio button is checked or unchecked.
- The RadioSet widget extends the Box widget, so it inherits all of its options, methods, and events.
- The RadioButton widget extends the Checkbox widget, so it inherits all of its options, methods, and events.
- Radio buttons are commonly used in forms to enable users to select a single option from a list of mutually exclusive options.