# Unicode and East Asian Width Utilities

This directory contains utilities for handling Unicode characters, with special focus on East Asian Width (EAW) properties and character width calculations.

## Overview

The Unicode standard defines several width properties for characters, which are essential for proper rendering in terminal environments:

- **Narrow**: Most Latin characters (1-column width)
- **Wide**: CJK characters like Hanzi/Kanji/Hanja, Hiragana, Katakana, Hangul (2-column width)
- **Fullwidth**: Fullwidth forms of Latin characters (2-column width)
- **Halfwidth**: Halfwidth forms of CJK characters (1-column width)
- **Ambiguous**: Characters that can be narrow or wide depending on context
- **Neutral**: All other characters

## Features

### East Asian Width (EAW) Detection

The `eaw.ts` module provides functions to detect and handle East Asian Width properties:

- `getEastAsianWidth(codePoint)`: Returns the East Asian Width property of a character
- `getCharacterWidth(codePoint, options)`: Calculates display width based on EAW properties

### Enhanced Unicode Support

The `unicode.ts` module extends the original blessed functionality with improved:

- Character width detection for CJK characters
- Surrogate pair handling for emoji and other supplementary plane characters
- Combining character support
- Grapheme cluster handling for complex character sequences

## Examples

See `examples/eaw-demo.ts` for usage examples. Here's a simple example:

```typescript
import { unicode } from '../utils/unicode';
import { getEastAsianWidth } from '../utils/eaw';

// Check EAW property
const eaw = getEastAsianWidth('漢'.codePointAt(0)!); // 'W' (Wide)

// Calculate string width
const width = unicode.strWidth('Hello 世界'); // 8 (5 + 1 + 2*1)
```

## Configuration

Width calculation can be configured with options:

```typescript
// Control ambiguous character width
const width = unicode.charWidth('☺', 0, { ambiguousAsWide: true });

// Control emoji width
const emojiWidth = unicode.charWidth('😀', 0, { emojiAsWide: false });
```

## Implementation Notes

- This implementation follows Unicode Technical Report #11 (East Asian Width)
- Character width calculation uses a combination of EAW properties and grapheme segmentation
- Careful handling of combining marks, zero-width characters, and complex emoji sequences
- Support for proper bidirectional text rendering is planned for future updates