# Node

The Node is the base class for all elements in blessed. It provides the foundation for the element hierarchy and implements common functionality like event handling and parent-child relationships.

## Example

```javascript
const blessed = require('blessed');
const Node = blessed.Node;

// Create a custom node
class MyNode extends Node {
  constructor(options = {}) {
    // Call the parent constructor
    super(options);

    // Set the type
    this.type = 'mynode';

    // Initialize custom properties
    this.customProperty = options.customProperty || 'default';
  }

  // Add custom methods
  customMethod() {
    return this.customProperty;
  }
}

// Create a screen
const screen = blessed.screen();

// Create an instance of the custom node
const myNode = new MyNode({
  parent: screen,
  customProperty: 'custom value'
});

// Use the custom node
console.log(myNode.customMethod()); // 'custom value'
```

## Constructor

### `new Node(options)`

Creates a new node.

**Parameters:**

- `options` (Object): Configuration options for the node

## Options

| Option | Type | Description |
|--------|------|-------------|
| `name` | String | Name of the node |
| `screen` | Screen | Screen to which this node belongs |
| `parent` | Node | Parent node |
| `children` | Array | Array of child nodes |
| `focusable` | Boolean | Whether the node can be focused |

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `type` | String | Type of the node |
| `options` | Object | Options passed to the constructor |
| `parent` | Node | Parent node |
| `screen` | Screen | Screen to which this node belongs |
| `children` | Array | Array of child nodes |
| `data` | Object | User-defined data |
| `_` | Object | Private data |
| `$` | Object | Blessed-specific data |
| `index` | Number | Index in parent's children array |
| `focusable` | Boolean | Whether the node can be focused |

## Methods

### Node Hierarchy

#### `node.append(element)`

Appends a child node.

**Parameters:**

- `element` (Node): The node to append

#### `node.prepend(element)`

Prepends a child node.

**Parameters:**

- `element` (Node): The node to prepend

#### `node.insertBefore(element, other)`

Inserts a node before another node.

**Parameters:**

- `element` (Node): The node to insert
- `other` (Node): The node to insert before

#### `node.insertAfter(element, other)`

Inserts a node after another node.

**Parameters:**

- `element` (Node): The node to insert
- `other` (Node): The node to insert after

#### `node.remove(element)`

Removes a child node.

**Parameters:**

- `element` (Node): The node to remove

#### `node.removeChild(element)`

Removes a child node.

**Parameters:**

- `element` (Node): The node to remove

#### `node.detach()`

Detaches the node from its parent.

### Node Traversal

#### `node.forDescendants(iter, s)`

Iterates over descendants.

**Parameters:**

- `iter` (Function): Iterator function
- `s` (Boolean): Whether to skip this node

#### `node.forAncestors(iter, s)`

Iterates over ancestors.

**Parameters:**

- `iter` (Function): Iterator function
- `s` (Boolean): Whether to skip this node

#### `node.getAncestry()`

Returns an array of ancestors.

**Returns:**

- Array of ancestor nodes

#### `node.getDescendants()`

Returns an array of descendants.

**Returns:**

- Array of descendant nodes

#### `node.hasDescendant(target)`

Checks if a node is a descendant.

**Parameters:**

- `target` (Node): The node to check

**Returns:**

- Boolean indicating whether the node is a descendant

### Event Handling

#### `node.on(event, listener)`

Registers an event listener.

**Parameters:**

- `event` (String): Event name
- `listener` (Function): Event listener

#### `node.once(event, listener)`

Registers a one-time event listener.

**Parameters:**

- `event` (String): Event name
- `listener` (Function): Event listener

#### `node.off(event, listener)`

Removes an event listener.

**Parameters:**

- `event` (String): Event name
- `listener` (Function): Event listener

#### `node.removeListener(event, listener)`

Removes an event listener.

**Parameters:**

- `event` (String): Event name
- `listener` (Function): Event listener

#### `node.removeAllListeners(event)`

Removes all listeners for an event.

**Parameters:**

- `event` (String, optional): Event name

#### `node.emit(event, ...args)`

Emits an event.

**Parameters:**

- `event` (String): Event name
- `...args` (Any): Arguments to pass to listeners

### Lifecycle

#### `node.destroy()`

Destroys the node and cleans up resources.

#### `node.free()`

Frees the node from memory.

## Events

| Event | Description |
|-------|-------------|
| `adopt` | Emitted when the node is added to a parent |
| `remove` | Emitted when the node is removed from its current parent |
| `reparent` | Emitted when the node gains a new parent |
| `attach` | Emitted when the node is attached to the screen directly or somewhere in its ancestry |
| `detach` | Emitted when the node is detached from the screen directly or somewhere in its ancestry |

## Notes

- The Node class is an abstract class and is not meant to be instantiated directly. Instead, it should be extended by other classes.
- The Node class extends the EventEmitter class, so it inherits all of its methods and properties.
- The Node class is the foundation of the element hierarchy in blessed, and all elements are instances of Node or its subclasses.