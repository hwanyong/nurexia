/**
 * unicode.ts - unicode handling with improved East Asian Width support
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 *
 * TypeScript implementation of the unicode.js module from blessed
 * Handles East Asian Width calculation, surrogate pairs, and combining characters
 */

// Use import instead of require
import GraphemeSplitter from 'grapheme-splitter';
import { CharWidthOptions, CharacterWidth } from '../types/unicode';
import { getCharacterWidth } from './eaw';

const stringFromCharCode = String.fromCharCode;

// Type definitions
interface ICombiningTable extends Array<[number, number]> {}

/**
 * Interface for character classification regexes
 */
export interface IUnicodeChars {
  wide: RegExp;
  swide: RegExp;
  all: RegExp;
  surrogate: RegExp;
  combining?: RegExp;
}

// Initialize grapheme splitter
const graphemeSplitter = new GraphemeSplitter();

// Export namespace
export const unicode = {
  /**
   * Calculates the display width of a character
   *
   * @param str Character or code point to check
   * @param i Position in the string (used when str is a string)
   * @param options Options for width calculation
   * @returns The display width (0, 1, or 2)
   */
  charWidth(str: string | number, i?: number, options?: CharWidthOptions): number {
    const point = typeof str !== 'number'
      ? unicode.codePointAt(str, i || 0)
      : str;

    // Use the improved East Asian Width utilities
    return getCharacterWidth(point, options);
  },

  /**
   * Calculate the display width of a string
   *
   * @param str String to measure
   * @param options Options for width calculation
   * @returns Total display width
   */
  strWidth(str: string, options?: CharWidthOptions): number {
    if (str === '' || str == null) return 0;

    // New implementation using grapheme-splitter for correct handling
    // of emoji sequences and combining characters
    const graphemes = graphemeSplitter.splitGraphemes(str);
    let width = 0;

    for (let i = 0; i < graphemes.length; i++) {
      const grapheme = graphemes[i];
      const point = unicode.codePointAt(grapheme, 0);

      // Skip zero-width graphemes
      if (getCharacterWidth(point, options) === CharacterWidth.ZERO) {
        continue;
      }

      // For emoji and other surrogate pairs, we need to check if the main
      // code point is wide, as combining marks will be handled by grapheme-splitter
      if (unicode.isSurrogate(grapheme)) {
        width += options?.emojiAsWide !== false ? 2 : 1;
        continue;
      }

      // For normal characters
      width += getCharacterWidth(point, options);
    }

    return width;
  },

  /**
   * Checks if a character is a surrogate pair
   *
   * @param str Character or code point to check
   * @param i Position in the string (used when str is a string)
   * @returns True if the character is a surrogate pair
   */
  isSurrogate(str: string | number, i?: number): boolean {
    let point;

    if (typeof str !== 'number') {
      point = unicode.codePointAt(str, i || 0);
      return point > 0xffff;
    }

    point = str;
    return point > 0xffff;
  },

  /**
   * Get the combining character table
   */
  get combining() {
    return combiningTable();
  },

  /**
   * Checks if a character is a combining character
   *
   * @param str Character or code point to check
   * @param i Position in the string (used when str is a string)
   * @returns True if the character is a combining character
   */
  isCombining(str: string | number, i?: number): boolean {
    const point = typeof str !== 'number'
      ? unicode.codePointAt(str, i || 0)
      : str;

    return getCharacterWidth(point) === CharacterWidth.ZERO
      && unicode.combining[point] === true;
  },

  /**
   * Get the code point of a character at a specific position
   *
   * @param str String to get code point from
   * @param position Position in the string
   * @returns Unicode code point
   */
  codePointAt(str: string, position: number): number {
    if (position < 0 || position >= str.length) {
      return undefined as any;
    }

    const first = str.charCodeAt(position);

    // Check if it's a lone surrogate
    if (
      first >= 0xD800 && first <= 0xDBFF && // high surrogate
      position + 1 < str.length // there is a next code unit
    ) {
      const second = str.charCodeAt(position + 1);
      if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
        // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
      }
    }

    return first;
  },

  /**
   * Convert code points to a string
   *
   * @param codePoints Code points to convert
   * @returns Resulting string
   */
  fromCodePoint(...codePoints: number[]): string {
    if (String.fromCodePoint) {
      return String.fromCodePoint(...codePoints);
    }

    const result = [];
    let codePoint;
    let offset = 0;

    while (offset < codePoints.length) {
      codePoint = codePoints[offset++];

      if (codePoint < 0 || codePoint > 0x10FFFF) {
        throw RangeError('Invalid code point: ' + codePoint);
      }

      if (codePoint <= 0xFFFF) {
        // BMP code point
        result.push(stringFromCharCode(codePoint));
      } else {
        // Astral code point; split in surrogate halves
        codePoint -= 0x10000;
        result.push(
          stringFromCharCode((codePoint >> 10) + 0xD800),
          stringFromCharCode((codePoint % 0x400) + 0xDC00)
        );
      }
    }

    return result.join('');
  },

  /**
   * Regexes for character classification
   * Needed for backward compatibility with the original blessed
   */
  chars: {
    // Wide characters (CJK, etc.)
    wide: /[\u1100-\u115f\u2329\u232a\u2e80-\u303e\u3040-\ua4cf\uac00-\ud7a3\uf900-\ufaff\ufe10-\ufe19\ufe30-\ufe6f\uff00-\uff60\uffe0-\uffe6]/g,

    // Surrogate pairs
    swide: /[\ud840-\ud87f][\udc00-\udffd]|[\ud880-\ud8bf][\udc00-\udffd]/g,

    // Combined regex for wide characters and surrogate pairs
    all: /[\ud840-\ud87f][\udc00-\udffd]|[\ud880-\ud8bf][\udc00-\udffd]|[\u1100-\u115f\u2329\u232a\u2e80-\u303e\u3040-\ua4cf\uac00-\ud7a3\uf900-\ufaff\ufe10-\ufe19\ufe30-\ufe6f\uff00-\uff60\uffe0-\uffe6]/g,

    // Surrogate pair detection
    surrogate: /[\ud800-\udbff][\udc00-\udfff]/g,

    // Combining characters pattern - this will be initialized by combiningTable
    combining: /[\u0300-\u036f\u1dc0-\u1dff\u20d0-\u20ff\ufe20-\ufe2f]/g
  } as IUnicodeChars
};

// Simplified approach - use the built-in Set for quick lookups
let combiningSet: Set<number> | null = null;

function combiningTable(): Record<number, boolean> {
  if (combiningSet === null) {
    // Combining character ranges (from the EAW module)
    const ranges = [
      // Combining Diacritical Marks
      [0x0300, 0x036F],
      // Combining Diacritical Marks Supplement
      [0x1DC0, 0x1DFF],
      // Combining Diacritical Marks for Symbols
      [0x20D0, 0x20FF],
      // Combining Half Marks
      [0xFE20, 0xFE2F],
      // Zero-width characters and control chars
      [0x200B, 0x200F],
      [0x202A, 0x202E],
      // Plus many more that would be included in a complete implementation
    ];

    combiningSet = new Set();

    for (const [start, end] of ranges) {
      for (let cp = start; cp <= end; cp++) {
        combiningSet.add(cp);
      }
    }
  }

  // Create a proxy object that acts like an array but is backed by the Set
  const result = new Proxy(
    {},
    {
      get(target, prop) {
        const cp = parseInt(prop as string, 10);
        if (isNaN(cp)) return undefined;
        return combiningSet?.has(cp) || false;
      },
    }
  );

  return result;
}

// Declare global for module augmentation
declare global {
  let blessed: any;
}

// Export individual functions and objects for backward compatibility
export {
  ICombiningTable,
  combiningTable
};