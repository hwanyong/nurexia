# General Utilities

The blessed-contrib library provides several utility functions that can be used across different widgets and components.

## Usage

```javascript
const contrib = require('blessed-contrib');
const utils = contrib.utils;

// Use utility functions
const mergedObject = utils.MergeRecursive(obj1, obj2);
const typeName = utils.getTypeName(someValue);
const abbreviatedNumber = utils.abbreviateNumber(1500); // '1.5k'
const colorCode = utils.getColorCode([255, 0, 0]); // Get terminal color code for RGB
```

## Available Functions

### `MergeRecursive(obj1, obj2)`

Recursively merges properties of two objects. If a property exists in both objects and is an object itself, it will recursively merge those nested objects.

**Parameters:**

- `obj1` (Object): First object to merge
- `obj2` (Object): Second object to merge

**Returns:**

- (Object): The merged object

**Example:**

```javascript
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { b: { d: 3 }, e: 4 };
const merged = utils.MergeRecursive(obj1, obj2);
// Result: { a: 1, b: { c: 2, d: 3 }, e: 4 }
```

### `getTypeName(thing)`

Gets the internal `[[Class]]` property of an object, which represents its type.

**Parameters:**

- `thing` (Any): The value to get the type of

**Returns:**

- (String): The type name as a string (e.g., '[object Object]', '[object Array]')

**Example:**

```javascript
utils.getTypeName({}); // '[object Object]'
utils.getTypeName([]); // '[object Array]'
utils.getTypeName(null); // '[object Null]'
```

### `abbreviateNumber(value)`

Abbreviates a number to a more readable format using suffixes (k, m, b, t).

**Parameters:**

- `value` (Number): The number to abbreviate

**Returns:**

- (String|Number): The abbreviated number with suffix or the original number if less than 1000

**Example:**

```javascript
utils.abbreviateNumber(1500); // '1.5k'
utils.abbreviateNumber(1000000); // '1m'
utils.abbreviateNumber(2500000000); // '2.5b'
utils.abbreviateNumber(500); // 500 (unchanged)
```

### `getColorCode(color)`

Converts an RGB color array to a terminal color code using the x256 color palette.

**Parameters:**

- `color` (Array|String): Either an RGB array [r, g, b] or a color string

**Returns:**

- (Number|String): The terminal color code or the original color string

**Example:**

```javascript
utils.getColorCode([255, 0, 0]); // Returns the terminal color code for red
utils.getColorCode('blue'); // Returns 'blue'
```

## Notes

- The `MergeRecursive` function is useful for combining configuration objects
- `abbreviateNumber` is particularly useful for displaying large numbers in charts and gauges with limited space
- `getColorCode` helps convert standard RGB colors to terminal-compatible color codes
- These utility functions are used internally by many blessed-contrib widgets