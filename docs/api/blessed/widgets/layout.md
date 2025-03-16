# Layout

The Layout widget provides a way to organize elements in a grid-like structure. It automatically positions and sizes child elements based on the layout configuration, making it easier to create complex user interfaces.

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a layout
const layout = blessed.layout({
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  layout: 'grid',
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

// Create boxes for the layout
const box1 = blessed.box({
  width: '50%',
  height: '50%',
  content: 'Box 1',
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'blue',
    border: {
      fg: 'white'
    }
  }
});

const box2 = blessed.box({
  width: '50%',
  height: '50%',
  content: 'Box 2',
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'green',
    border: {
      fg: 'white'
    }
  }
});

const box3 = blessed.box({
  width: '50%',
  height: '50%',
  content: 'Box 3',
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'red',
    border: {
      fg: 'white'
    }
  }
});

const box4 = blessed.box({
  width: '50%',
  height: '50%',
  content: 'Box 4',
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'magenta',
    border: {
      fg: 'white'
    }
  }
});

// Append boxes to the layout
layout.append(box1);
layout.append(box2);
layout.append(box3);
layout.append(box4);

// Append the layout to the screen
screen.append(layout);

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();
```

## Constructor

### `blessed.layout(options)`

Creates a new layout element.

**Parameters:**

- `options` (Object): Configuration options for the layout

## Options

The Layout widget inherits all options from the Element element and adds the following:

| Option | Type | Description |
|--------|------|-------------|
| `layout` | String | Layout type: 'inline', 'grid', 'horizontal', or 'vertical'. Default: `'inline'` |
| `renderer` | Function | Custom layout renderer function |
| `children` | Array | Array of child elements |
| `keys` | Boolean/Array | Use pre-defined keys to navigate the layout. Default: `false` |
| `mouse` | Boolean | Whether to enable mouse support for this element. Default: `false` |

### Inherited Options

The Layout widget inherits all options from the Element element. Some commonly used options include:

| Option | Type | Description |
|--------|------|-------------|
| `border` | Object/String | Border object or border type |
| `style` | Object | Style object |
| `top` | Number/String | Top offset |
| `left` | Number/String | Left offset |
| `width` | Number/String | Width of the element |
| `height` | Number/String | Height of the element |

## Properties

The Layout widget inherits all properties from the Element element and adds the following:

| Property | Type | Description |
|----------|------|-------------|
| `layout` | String | Layout type |
| `renderer` | Function | Layout renderer function |
| `children` | Array | Array of child elements |

## Methods

The Layout widget inherits all methods from the Element element and adds the following:

### Layout Management

#### `layout.append(element)`

Appends a child element to the layout.

**Parameters:**

- `element` (Element): The element to append

#### `layout.prepend(element)`

Prepends a child element to the layout.

**Parameters:**

- `element` (Element): The element to prepend

#### `layout.insertBefore(element, before)`

Inserts a child element before another element.

**Parameters:**

- `element` (Element): The element to insert
- `before` (Element): The element to insert before

#### `layout.insertAfter(element, after)`

Inserts a child element after another element.

**Parameters:**

- `element` (Element): The element to insert
- `after` (Element): The element to insert after

#### `layout.remove(element)`

Removes a child element from the layout.

**Parameters:**

- `element` (Element): The element to remove

#### `layout.setLayout(type)`

Sets the layout type.

**Parameters:**

- `type` (String): The layout type: 'inline', 'grid', 'horizontal', or 'vertical'

#### `layout.setRenderer(renderer)`

Sets the layout renderer function.

**Parameters:**

- `renderer` (Function): The renderer function

#### `layout.reflow()`

Reflows the layout, recalculating positions and sizes of child elements.

### Focus Management

#### `layout.focus()`

Focuses on the layout.

## Events

The Layout widget inherits all events from the Element element and adds the following:

| Event | Description |
|-------|-------------|
| `append` | Emitted when a child element is appended |
| `prepend` | Emitted when a child element is prepended |
| `insert` | Emitted when a child element is inserted |
| `remove` | Emitted when a child element is removed |
| `reflow` | Emitted when the layout is reflowed |
| `keypress` | Emitted when a key is pressed while the layout is focused |

## Notes

- The Layout widget provides a way to organize elements in a grid-like structure.
- It automatically positions and sizes child elements based on the layout configuration, making it easier to create complex user interfaces.
- The `layout` option sets the layout type, which can be 'inline', 'grid', 'horizontal', or 'vertical'.
- The 'inline' layout positions elements one after another, wrapping to the next line when necessary.
- The 'grid' layout positions elements in a grid, with each element taking up an equal amount of space.
- The 'horizontal' layout positions elements horizontally, with each element taking up an equal amount of width.
- The 'vertical' layout positions elements vertically, with each element taking up an equal amount of height.
- The `renderer` option allows you to provide a custom layout renderer function for more complex layouts.
- The Layout widget extends the Element widget, so it inherits all of its options, methods, and events.
- The layout can be customized with different borders, colors, and styles to match the look and feel of your application.