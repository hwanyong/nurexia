# stripTags

The `stripTags` function is a utility that removes all tags from text, leaving only the plain content. This is useful when you need to extract the raw text from content that contains blessed formatting tags.

## Syntax

```javascript
blessed.stripTags(text)
```

## Parameters

- `text` (String): The text containing tags to strip

## Return Value

- (String): The text with all tags removed

## Description

The `stripTags` function removes all blessed formatting tags from the input text. Blessed tags are enclosed in curly braces and are used for styling text in the terminal, such as `{bold}`, `{red-fg}`, etc.

This function is particularly useful when you need to:
- Calculate the actual length of text without tags
- Display text without formatting
- Process text content without being affected by formatting tags

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Text with tags
const taggedText = '{bold}Hello{/bold} {red-fg}World{/red-fg}!';

// Strip tags from text
const plainText = blessed.stripTags(taggedText);

// Create a box with the plain text
const box = blessed.box({
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  content: `Original: ${taggedText}\nStripped: ${plainText}`,
  tags: true,
  border: {
    type: 'line'
  }
});

// Append the box to the screen
screen.append(box);

// Add a way to quit the program
screen.key(['escape', 'q', 'C-c'], function() {
  return process.exit(0);
});

// Render the screen
screen.render();

// The box will display:
// Original: {bold}Hello{/bold} {red-fg}World{/red-fg}!
// Stripped: Hello World!
```

## Notes

- This function completely removes all tags, including their content delimiters (the curly braces).
- If you want to preserve the tags but prevent them from being interpreted, use the `cleanTags` function instead.
- If you want to escape special characters in text, use the `escape` function instead.
- The `stripTags` function only affects blessed's formatting tags and does not affect other types of markup or HTML tags.
- This function is useful when calculating text dimensions or when you need to process the raw text content without formatting.