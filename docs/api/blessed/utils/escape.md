# escape

The `escape` function is a utility that escapes special characters in text to make it safe for display in the terminal.

## Syntax

```javascript
blessed.escape(text)
```

## Parameters

- `text` (String): The text to escape

## Return Value

- (String): The escaped text

## Description

The `escape` function replaces special characters in the input text with their HTML entity equivalents. This is useful when you want to display text that contains characters that might be interpreted as tags or control characters by blessed.

The following characters are escaped:

- `&` becomes `&amp;`
- `<` becomes `&lt;`
- `>` becomes `&gt;`
- `"` becomes `&quot;`
- `'` becomes `&apos;`

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Create a box with escaped content
const box = blessed.box({
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  content: blessed.escape('<hello world>'),
  tags: true,
  border: {
    type: 'line'
  }
});

// Append the box to the screen
screen.append(box);

// Render the screen
screen.render();

// The box will display: &lt;hello world&gt;
```

## Notes

- This function is particularly useful when displaying user input or external data that might contain special characters.
- When using the `escape` function, you should still set the `tags` option to `true` on the widget that will display the text, as the escaped text may still contain valid tags.
- If you want to completely strip tags from text rather than escaping them, use the `stripTags` function instead.
- If you want to preserve tags but prevent them from being interpreted, use the `cleanTags` function instead.