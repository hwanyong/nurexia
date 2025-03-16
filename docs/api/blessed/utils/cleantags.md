# cleanTags

The `cleanTags` function is a utility that preserves tags in text but prevents them from being interpreted as formatting instructions. This is useful when you want to display text that contains curly braces without them being processed as blessed tags.

## Syntax

```javascript
blessed.cleanTags(text)
```

## Parameters

- `text` (String): The text containing tags to clean

## Return Value

- (String): The text with tags preserved but made non-interpretable

## Description

The `cleanTags` function preserves blessed formatting tags in the input text but modifies them so they won't be interpreted as actual formatting instructions. It does this by escaping the opening curly brace of each tag, which prevents blessed from recognizing it as a tag.

This function is particularly useful when you need to:
- Display text that contains curly braces without them being interpreted as tags
- Show examples of blessed tags in your application
- Preserve the original text structure while preventing tag interpretation

## Example

```javascript
const blessed = require('blessed');

// Create a screen object
const screen = blessed.screen({
  smartCSR: true
});

// Text with tags
const taggedText = '{bold}Hello{/bold} {red-fg}World{/red-fg}!';

// Clean tags from text
const cleanedText = blessed.cleanTags(taggedText);

// Create a box with the cleaned text
const box = blessed.box({
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  content: `Original (interpreted): ${taggedText}\nCleaned (displayed as-is): ${cleanedText}`,
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
// Original (interpreted): Hello World!  (with "Hello" in bold and "World" in red)
// Cleaned (displayed as-is): {bold}Hello{/bold} {red-fg}World{/red-fg}!  (with tags visible)
```

## Notes

- This function preserves the tags in the text but prevents them from being interpreted by escaping the opening curly brace.
- If you want to completely remove tags from text, use the `stripTags` function instead.
- If you want to escape all special characters in text, use the `escape` function instead.
- The `cleanTags` function is useful when you need to display examples of blessed tags or when you want to show text that contains curly braces without them being interpreted as tags.
- When using `cleanTags`, you should still set the `tags` option to `true` on the widget that will display the text, as the cleaned text may still contain valid tags elsewhere.