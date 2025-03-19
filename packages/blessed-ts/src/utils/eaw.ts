/**
 * East Asian Width utility
 * Implementation based on Unicode TR11: East Asian Width
 * https://www.unicode.org/reports/tr11/
 */

import { CharacterRange, EastAsianWidth, CharacterWidth, CharWidthOptions } from '../types/unicode';

// Character ranges for East Asian Width property values
// Derived from Unicode 15.0.0 data
// These are PARTIAL ranges to demonstrate the concept - a complete implementation
// would include all ranges from the Unicode database

// Fullwidth (F) characters
const fullwidth: CharacterRange[] = [
  { start: 0xFF01, end: 0xFF60 }, // Fullwidth ASCII variants
  { start: 0xFFE0, end: 0xFFE6 }  // Fullwidth symbol variants
];

// Wide (W) characters - CJK, Hangul, etc.
const wide: CharacterRange[] = [
  { start: 0x1100, end: 0x115F },   // Hangul Jamo
  { start: 0x2329, end: 0x232A },   // Angle Brackets
  { start: 0x3000, end: 0x303E },   // CJK Symbols and Punctuation
  { start: 0x3040, end: 0x309F },   // Hiragana
  { start: 0x30A0, end: 0x30FF },   // Katakana
  { start: 0x3400, end: 0x4DBF },   // CJK Unified Ideographs Extension A
  { start: 0x4E00, end: 0x9FFF },   // CJK Unified Ideographs
  { start: 0xAC00, end: 0xD7A3 },   // Hangul Syllables
  { start: 0xF900, end: 0xFAFF },   // CJK Compatibility Ideographs
  { start: 0xFF00, end: 0xFF00 },   // Fullwidth Character
  { start: 0x20000, end: 0x2FFFD }, // CJK Unified Ideographs Extension B
  { start: 0x30000, end: 0x3FFFD }  // CJK Unified Ideographs Extension C-G
];

// Halfwidth (H) characters
const halfwidth: CharacterRange[] = [
  { start: 0xFF61, end: 0xFFDC }, // Halfwidth Katakana
  { start: 0xFFE8, end: 0xFFEE }  // Halfwidth symbols
];

// Sample of ambiguous width (A) characters
const ambiguous: CharacterRange[] = [
  { start: 0x00A1, end: 0x00A1 },   // Inverted Exclamation Mark
  { start: 0x00A4, end: 0x00A4 },   // Currency Sign
  { start: 0x00A7, end: 0x00A8 },   // Section Sign, Diaeresis
  { start: 0x00AA, end: 0x00AA },   // Feminine Ordinal Indicator
  { start: 0x00B0, end: 0x00B4 },   // Degree Sign to Acute Accent
  { start: 0x2020, end: 0x2022 },   // Dagger, Double Dagger, Bullet
  { start: 0x2030, end: 0x2030 },   // Per Mille Sign
  { start: 0x2032, end: 0x2033 },   // Prime, Double Prime
  { start: 0x2192, end: 0x2199 },   // Arrows
  { start: 0x2211, end: 0x2211 },   // N-Ary Summation
  { start: 0x221A, end: 0x221A },   // Square Root
  { start: 0x22EF, end: 0x22EF },   // Midline Horizontal Ellipsis
  { start: 0x2601, end: 0x2601 }    // Cloud (weather symbol)
];

// Emoji ranges (incomplete - just a sample)
const emoji: CharacterRange[] = [
  { start: 0x1F300, end: 0x1F64F }, // Miscellaneous Symbols and Pictographs
  { start: 0x1F680, end: 0x1F6FF }, // Transport and Map Symbols
  { start: 0x1F700, end: 0x1F77F }, // Alchemical Symbols
  { start: 0x1F780, end: 0x1F7FF }, // Geometric Shapes Extended
  { start: 0x1F800, end: 0x1F8FF }, // Supplemental Arrows-C
  { start: 0x1F900, end: 0x1F9FF }  // Supplemental Symbols and Pictographs
];

// Zero-width characters and combining marks (incomplete)
const combining: CharacterRange[] = [
  { start: 0x0300, end: 0x036F }, // Combining Diacritical Marks
  { start: 0x0483, end: 0x0489 }, // Cyrillic Combining Marks
  { start: 0x1AB0, end: 0x1AFF }, // Combining Diacritical Marks Extended
  { start: 0x1DC0, end: 0x1DFF }, // Combining Diacritical Marks Supplement
  { start: 0x200B, end: 0x200F }, // Zero-width characters
  { start: 0x202A, end: 0x202E }, // Bidirectional formatting
  { start: 0x20D0, end: 0x20FF }  // Combining Diacritical Marks for Symbols
];

/**
 * Checks if a code point is in any of the character ranges in the array
 */
function isInRanges(codePoint: number, ranges: CharacterRange[]): boolean {
  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i];
    if (codePoint >= range.start && codePoint <= range.end) {
      return true;
    }
  }
  return false;
}

/**
 * Determines the East Asian Width property of a character
 *
 * @param codePoint Unicode code point
 * @returns East Asian Width property value
 */
export function getEastAsianWidth(codePoint: number): EastAsianWidth {
  if (isInRanges(codePoint, fullwidth)) {
    return EastAsianWidth.FULLWIDTH;
  }

  if (isInRanges(codePoint, wide)) {
    return EastAsianWidth.WIDE;
  }

  if (isInRanges(codePoint, halfwidth)) {
    return EastAsianWidth.HALFWIDTH;
  }

  if (isInRanges(codePoint, ambiguous)) {
    return EastAsianWidth.AMBIGUOUS;
  }

  // ASCII range
  if (codePoint >= 0x0020 && codePoint <= 0x007F) {
    return EastAsianWidth.NARROW;
  }

  // Default to Neutral for everything else
  return EastAsianWidth.NEUTRAL;
}

/**
 * Determines the display width of a code point based on its East Asian Width
 *
 * @param codePoint Unicode code point
 * @param options Configuration options
 * @returns Display width (0, 1, or 2)
 */
export function getCharacterWidth(
  codePoint: number,
  options: CharWidthOptions = {}
): CharacterWidth {
  // Default options
  const opts = {
    ambiguousAsWide: process.env.NCURSES_CJK_WIDTH === '1',
    emojiAsWide: true,
    tabWidth: 8,
    ...options
  };

  // Check for control characters
  if (codePoint === 0) {
    return CharacterWidth.ZERO; // Null character
  }

  // Tab character
  if (codePoint === 0x09) {
    return opts.tabWidth as unknown as CharacterWidth;
  }

  // Control characters
  if (codePoint < 32 || (codePoint >= 0x7f && codePoint < 0xa0)) {
    return CharacterWidth.ZERO;
  }

  // Combining characters
  if (isInRanges(codePoint, combining)) {
    return CharacterWidth.ZERO;
  }

  // Emoji - they're wide in modern terminals
  if (opts.emojiAsWide && isInRanges(codePoint, emoji)) {
    return CharacterWidth.TWO;
  }

  // Check East Asian Width
  const eaw = getEastAsianWidth(codePoint);

  switch (eaw) {
    case EastAsianWidth.FULLWIDTH:
    case EastAsianWidth.WIDE:
      return CharacterWidth.TWO;

    case EastAsianWidth.AMBIGUOUS:
      return opts.ambiguousAsWide ? CharacterWidth.TWO : CharacterWidth.ONE;

    case EastAsianWidth.HALFWIDTH:
    case EastAsianWidth.NARROW:
    case EastAsianWidth.NEUTRAL:
    default:
      return CharacterWidth.ONE;
  }
}