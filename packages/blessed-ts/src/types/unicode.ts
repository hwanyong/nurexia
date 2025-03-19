/**
 * Unicode type definitions
 * Provides types for East Asian Width, combining characters, and emoji
 */

// Character width categories per Unicode East Asian Width property
// https://www.unicode.org/reports/tr11/
export enum EastAsianWidth {
  // Narrow (Na) - Latin, Cyrillic, etc.
  NARROW = 'Na',
  // Wide (W) - Full-width characters
  WIDE = 'W',
  // Full-width (F) - Full-width compatibility characters
  FULLWIDTH = 'F',
  // Half-width (H) - Half-width compatibility characters
  HALFWIDTH = 'H',
  // Ambiguous (A) - Characters that can be narrow or wide depending on context
  AMBIGUOUS = 'A',
  // Neutral (N) - All other characters (most non-CJK)
  NEUTRAL = 'N'
}

// Character width measurement for terminal display
export enum CharacterWidth {
  ZERO = 0,  // Control characters, combining marks
  ONE = 1,   // Standard ASCII and most non-Asian characters
  TWO = 2    // Full-width, wide CJK characters, emoji
}

// Unicode character range definition
export interface CharacterRange {
  start: number;
  end: number;
}

// Character classification table
export interface CharacterWidthTable {
  combining: CharacterRange[];
  ambiguous: CharacterRange[];
  wide: CharacterRange[];
  fullwidth: CharacterRange[];
  halfwidth: CharacterRange[];
  emoji: CharacterRange[];
  emojiPresentation: CharacterRange[];
  emojiModifier: CharacterRange[];
  emojiComponent: CharacterRange[];
}

// Options for character width calculation
export interface CharWidthOptions {
  // Treat ambiguous-width characters as wide
  ambiguousAsWide?: boolean;
  // Treat emoji as wide (default: true)
  emojiAsWide?: boolean;
  // Number of spaces for tab character
  tabWidth?: number;
}

// Configuration for grapheme segmentation
export interface GraphemeOptions {
  // Whether to use ICU-compatible grapheme breaking
  useICU?: boolean;
  // Whether to combine ZWJ sequences (for emoji)
  combineZWJ?: boolean;
  // Whether to combine with extended pictographics (for emoji)
  combineExtendedPictographic?: boolean;
}