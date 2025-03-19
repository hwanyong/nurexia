/**
 * bidi.ts - bidirectional text support
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 *
 * Handles bidirectional text (RTL languages like Arabic and Hebrew)
 * Based on the Unicode Bidirectional Algorithm (UBA)
 */

import { unicode } from './unicode';

/**
 * Enum for text direction
 */
export enum Direction {
  LTR = 'ltr', // Left-to-Right
  RTL = 'rtl', // Right-to-Left
}

/**
 * Options for bidirectional text processing
 */
export interface BidiOptions {
  /** Default direction, used when no strong direction is detected */
  defaultDirection?: Direction;
  /** Whether to apply shaping for Arabic text */
  shapeArabic?: boolean;
}

/**
 * Character directional types according to Unicode Bidirectional Algorithm
 */
enum CharType {
  L,   // Left-to-Right (LTR)
  R,   // Right-to-Left (RTL)
  AL,  // Arabic Letter (RTL)
  EN,  // European Number (LTR)
  ES,  // European Number Separator
  ET,  // European Number Terminator
  AN,  // Arabic Number
  CS,  // Common Number Separator
  NSM, // Non-Spacing Mark
  BN,  // Boundary Neutral
  B,   // Paragraph Separator
  S,   // Segment Separator
  WS,  // Whitespace
  ON,  // Other Neutrals
}

// Unicode ranges for RTL scripts
const RTL_RANGES = [
  // Hebrew
  [0x0590, 0x05FF],
  // Arabic
  [0x0600, 0x06FF],
  [0x0750, 0x077F],
  [0x08A0, 0x08FF],
  [0xFB50, 0xFDFF],
  [0xFE70, 0xFEFF],
  // Other RTL scripts
  [0x0700, 0x074F], // Syriac
  [0x0780, 0x07BF], // Thaana
];

/**
 * Check if a character is RTL
 * @param codePoint Unicode code point
 * @returns True if the character is RTL
 */
export function isRTL(codePoint: number): boolean {
  for (const [start, end] of RTL_RANGES) {
    if (codePoint >= start && codePoint <= end) {
      return true;
    }
  }
  return false;
}

/**
 * Detect the dominant direction of a string
 * @param text Input text
 * @returns Detected direction
 */
export function detectDirection(text: string): Direction {
  let rtlCount = 0;
  let ltrCount = 0;

  for (let i = 0; i < text.length; i++) {
    const codePoint = unicode.codePointAt(text, i);
    if (isRTL(codePoint)) {
      rtlCount++;
    } else if (
      // Basic Latin alphabet and digits
      (codePoint >= 0x0041 && codePoint <= 0x005A) || // A-Z
      (codePoint >= 0x0061 && codePoint <= 0x007A) || // a-z
      (codePoint >= 0x0030 && codePoint <= 0x0039)    // 0-9
    ) {
      ltrCount++;
    }

    // Skip surrogate pairs
    if (unicode.isSurrogate(text, i)) {
      i++;
    }
  }

  return rtlCount > ltrCount ? Direction.RTL : Direction.LTR;
}

/**
 * Apply bidirectional algorithm to reorder text for display
 * This is a simplified implementation of the Unicode Bidirectional Algorithm
 *
 * @param text Input text
 * @param options Processing options
 * @returns Reordered text
 */
export function reorderBidiText(text: string, options: BidiOptions = {}): string {
  const defaultDirection = options.defaultDirection || Direction.LTR;

  // If text is empty, return empty string
  if (!text || text.length === 0) {
    return '';
  }

  // Detect direction if not specified
  const direction = detectDirection(text);

  // If text direction is LTR, no need to reorder
  if (direction === Direction.LTR && defaultDirection === Direction.LTR) {
    return text;
  }

  // For RTL text, implement a basic reordering
  // This is a simplified approach - a full implementation would use the UBA

  // 1. Split text into segments (words and separators)
  const segments = text.split(/(\s+)/);

  // 2. For RTL mode, reverse the order of segments but keep internal segment order
  if (direction === Direction.RTL) {
    segments.reverse();
  }

  // 3. Join segments back together
  return segments.join('');
}

/**
 * Process text for bidirectional display
 *
 * @param text Input text
 * @param width Display width (for wrapping)
 * @param options Processing options
 * @returns Processed text ready for terminal display
 */
export function processBidiText(text: string, width?: number, options: BidiOptions = {}): string {
  // Reorder the text according to bidi algorithm
  const reordered = reorderBidiText(text, options);

  // If width is specified, we'd implement wrapping here
  // For RTL text, the wrapping direction would need to be considered

  return reordered;
}

// Export bidi object for API consistency
export const bidi = {
  isRTL,
  detectDirection,
  reorderBidiText,
  processBidiText,
  Direction,
};