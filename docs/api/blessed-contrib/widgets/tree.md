# Tree Widget

The Tree widget displays hierarchical data structures in a collapsible/expandable tree view format. This is useful for showing file systems, organization charts, or any nested data.

## Import

```javascript
const contrib = require('blessed-contrib');
const tree = contrib.tree(options);
```

## Constructor

### `contrib.tree(options)`

Creates a new tree widget.

#### Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `label` | String | No | - | The title of the tree widget |
| `keys` | Array | No | `['+', 'space', 'enter']` | Keys that toggle expand/collapse |
| `extended` | Boolean | No | `false` | Whether nodes are expanded by default |
| `template` | Object | No | *see below* | Templates for the tree display |
| `style` | Object | No | - | Style settings for the tree |
| `tags` | Boolean | No | - | Enable blessed tags for styling |
| `mouse` | Boolean | No | - | Enable mouse support |
| `selectedBg` | String | No | `'blue'` | Background color for selected node |
| `selectedFg` | String | No | `'black'` | Text color for selected node |
| `scrollable` | Boolean | No | - | Whether the tree is scrollable |
| `vi` | Boolean | No | - | Enable vi-like navigation |
| `input` | Boolean | No | - | Whether to listen for input |

#### Template Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `extend` | String | `' [+]'` | Symbol for collapsed nodes |
| `retract` | String | `' [-]'` | Symbol for expanded nodes |
| `lines` | Boolean | `false` | Use line-drawing characters for tree structure |
| `spaces` | Boolean | - | Use spaces instead of line characters |

## Methods

### `setData(data)`

Sets or updates the tree data.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | Object | Tree data structure (see Data Format below) |

### `focus()`

Focuses the tree widget so it can receive keyboard input.

### `render()`

Manually renders the tree. Usually, you'll just call `screen.render()` instead.

#### Data Format

The tree data should be a hierarchical object with the following structure:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | String | Yes | Text to display for the node |
| `extended` | Boolean | No | Whether this node is initially expanded |
| `children` | Object/Function | No | Child nodes or a function that returns child nodes |

When using a function for `children`, it will be called with the current node as a parameter and should return an object of child nodes.

## Events

| Event | Description | Callback Parameters |
|-------|-------------|---------------------|
| `select` | Emitted when a node is selected | `(node, index)`: The selected node and its index |

## Example

```javascript
const blessed = require('blessed');
const contrib = require('blessed-contrib');

// Create screen
const screen = blessed.screen();

// Create tree
const tree = contrib.tree({
  label: 'File System',
  style: { text: 'green' },
  template: {
    extend: ' [+]',
    retract: ' [-]',
    lines: true
  },
  extended: true, // default to extended nodes
  keys: true,     // enable keyboard navigation
  vi: true,       // vi-like navigation
  mouse: true,    // enable mouse support
  height: '50%',
  width: '50%',
  top: 0,
  left: 0,
  border: { type: 'line' }
});

// Add it to the screen
screen.append(tree);

// Set tree data
const treeData = {
  name: 'Project Root',
  extended: true,
  children: {
    'src': {
      name: 'src',
      children: {
        'main.js': {
          name: 'main.js'
        },
        'helpers': {
          name: 'helpers',
          extended: false,
          children: {
            'utils.js': {
              name: 'utils.js'
            },
            'validation.js': {
              name: 'validation.js'
            }
          }
        }
      }
    },
    'tests': {
      name: 'tests',
      children: {
        'test_main.js': {
          name: 'test_main.js'
        }
      }
    },
    'package.json': {
      name: 'package.json'
    }
  }
};

// Dynamic children example (not shown in displayed data)
const dynamicTreeData = {
  name: 'Dynamic Root',
  extended: true,
  children: function(node) {
    // This function would be called when the node is expanded
    return {
      'dynamic-1': { name: 'dynamically loaded 1' },
      'dynamic-2': { name: 'dynamically loaded 2' }
    };
  }
};

tree.setData(treeData);

// Handle select events
tree.on('select', function(node) {
  console.log('Selected:', node.name);
});

// Focus on the tree
tree.focus();

// Render the screen
screen.render();

// Handle exit
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});
```

## Notes

- The tree widget supports both static data and dynamically loaded children with function callbacks.
- Nodes can be expanded or collapsed using the configured keys (default: +, space, enter).
- Each node can have its own `extended` property to control whether it's initially expanded or collapsed.
- The tree depth is visually indicated with line characters or spaces, depending on the template settings.
- The selected node is highlighted using the `selectedBg` and `selectedFg` colors.
- Navigation can be done with arrows, vi keys (if enabled), or mouse (if enabled).
- The `tree.nodeLines` array provides access to the flattened list of currently visible nodes.