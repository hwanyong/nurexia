# Markdown Widget

The Markdown widget renders Markdown text in the terminal with proper formatting, including headings, lists, code blocks, and more.

## Example

```javascript
const blessed = require('blessed');
const contrib = require('blessed-contrib');

const screen = blessed.screen();

// Create a markdown widget
const markdown = contrib.markdown({
  markdown: '# Hello World\n\nThis is **bold** and this is *italic*.\n\n```\ncode block\n```',
  markdownStyle: {
    heading: 'green.bold',
    em: 'italic',
    strong: 'red.bold',
    code: 'yellow'
  },
  width: '50%',
  height: '50%',
  border: {
    type: 'line'
  }
});

screen.append(markdown);
screen.render();
```

## Options

The Markdown widget supports the following options:

| Option | Type | Description |
|--------|------|-------------|
| `markdown` | String | Markdown text to render |
| `markdownStyle` | Object | Style options for different markdown elements |

### Markdown Style Options

The `markdownStyle` object can include the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `heading` | String | Style for headings (e.g., 'green.bold') |
| `em` | String | Style for emphasized text (italic) |
| `strong` | String | Style for strong text (bold) |
| `code` | String | Style for inline code |
| `codespan` | String | Style for code spans |
| `table` | String | Style for tables |
| `listitem` | String | Style for list items |
| `hr` | String | Style for horizontal rules |
| `blockquote` | String | Style for blockquotes |
| `link` | String | Style for links |
| `image` | String | Style for images |

### Inherited Options

The Markdown widget inherits all options from the blessed Box element. Common options include:

| Option | Type | Description |
|--------|------|-------------|
| `width` | String/Number | Width of the widget |
| `height` | String/Number | Height of the widget |
| `border` | Object | Border options |
| `style` | Object | Style options for the widget |

## Methods

### `setMarkdown(str)`

Updates the widget with new markdown content.

**Parameters:**

- `str` (String): Markdown text to render

**Example:**

```javascript
markdown.setMarkdown('# New Content\n\nThis is updated markdown content.');
screen.render();
```

### `setOptions(style)`

Updates the markdown rendering style.

**Parameters:**

- `style` (Object): Style options for different markdown elements

**Example:**

```javascript
markdown.setOptions({
  heading: 'blue.bold',
  strong: 'green.bold'
});
markdown.setMarkdown(markdown.options.markdown); // Re-render with new styles
screen.render();
```

## Events

The Markdown widget inherits all events from the blessed Box element.

## Notes

- The Markdown widget uses the `marked` and `marked-terminal` packages for rendering
- Style strings use dot notation to specify multiple styles (e.g., 'red.bold.underline')
- Available style properties depend on the chalk library
- For best results, keep markdown content simple and terminal-friendly
- Complex markdown features like tables may not render well in all terminal environments