# Utilities

blessed-contrib provides several utility functions that help with common operations when building terminal dashboards.

## Available Utilities

### Utility Functions

These are internal utility functions that are used throughout blessed-contrib but can also be accessed directly:

- `MergeRecursive(obj1, obj2)`: Recursively merges properties of two objects
- `getTypeName(thing)`: Gets the type name of a JavaScript object
- `abbreviateNumber(value)`: Abbreviates numbers (e.g., 1000 becomes "1k")
- `getColorCode(color)`: Converts color specifications to terminal color codes

For detailed documentation on these utility functions, see [General Utilities](./utils.md).

### Server Utilities

These utilities help with creating server-side terminal dashboards:

- `createScreen(options)`: Creates a virtual screen for server-side rendering
- `OutputBuffer(options)`: Captures output from a virtual screen for sending to clients
- `InputBuffer()`: Handles input for server-side blessed applications
- `serverError(err)`: Standardized error handler for server applications

For detailed documentation on server utilities, see [Server Utilities](./server-utils.md).

## Import

```javascript
const utils = require('blessed-contrib/lib/utils');
const serverUtils = require('blessed-contrib/lib/server-utils');
```

## Usage Examples

```javascript
// Using utility functions
const utils = require('blessed-contrib/lib/utils');

// Merge two objects recursively
const merged = utils.MergeRecursive(
  { a: 1, b: { c: 2 } },
  { b: { d: 3 }, e: 4 }
);
// Result: { a: 1, b: { c: 2, d: 3 }, e: 4 }

// Abbreviate large numbers
const abbreviated = utils.abbreviateNumber(1500000);
// Result: "1.5m"

// Using server utilities for remote dashboards
const serverUtils = require('blessed-contrib/lib/server-utils');
const screen = serverUtils.createScreen();
const outputBuffer = new serverUtils.OutputBuffer();

// Now you can create a dashboard to be rendered remotely
// ...

// Handle any errors
process.on('uncaughtException', serverUtils.serverError);
```

For detailed documentation on each utility, refer to the specific files.