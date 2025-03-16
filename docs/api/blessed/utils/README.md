# Utilities

blessed provides several utility functions for working with terminal content and handling common tasks.

## Text Manipulation

These utilities help with manipulating and formatting text for terminal display:

- [escape](./escape.md): Escape text for terminal display
- [stripTags](./striptags.md): Remove tags from text
- [cleanTags](./cleantags.md): Clean tags from text
- [generateTags](./generatetags.md): Generate tags for styling text
- [parseTags](./parsetags.md): Parse tags in text

## Usage

```javascript
const blessed = require('blessed');

// Escape special characters
const escapedText = blessed.escape('<hello>');
// Result: '&lt;hello&gt;'

// Strip tags from text
const strippedText = blessed.stripTags('{bold}hello{/bold}');
// Result: 'hello'

// Clean tags from text
const cleanedText = blessed.cleanTags('{bold}hello{/bold}');
// Result: '{bold}hello{/bold}'

// Generate tags for styling text
const styledText = blessed.generateTags({ fg: 'red', bg: 'blue' }, 'hello');
// Result: '{red-fg}{blue-bg}hello{/blue-bg}{/red-fg}'

// Parse tags in text
const parsedText = blessed.parseTags('{bold}hello{/bold}');
// Result: '\x1b[1mhello\x1b[22m'
```

## Notes

- These utilities are particularly useful when working with text content in blessed widgets.
- The tag system in blessed allows for rich text formatting in the terminal.
- Tags use a syntax similar to HTML/XML, with opening and closing tags.
- Available tags include color tags (e.g., `{red-fg}`, `{blue-bg}`), style tags (e.g., `{bold}`, `{underline}`), and more.
- When using tags, make sure to set the `tags` option to `true` on the widget that will display the text.