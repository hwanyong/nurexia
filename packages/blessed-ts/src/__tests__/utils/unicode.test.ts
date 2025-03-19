/**
 * Tests for unicode.ts utility functions
 * Tests character width calculation, surrogate pairs, and combining characters
 */

import { unicode } from '../../utils/unicode';

describe('Unicode Utilities', () => {
  describe('charWidth', () => {
    test('should return 0 for control characters', () => {
      expect(unicode.charWidth('\u0000')).toBe(0); // null character
      expect(unicode.charWidth('\u001b')).toBe(0); // escape
    });

    test('should return 1 for standard ASCII characters', () => {
      expect(unicode.charWidth('a')).toBe(1);
      expect(unicode.charWidth('A')).toBe(1);
      expect(unicode.charWidth('1')).toBe(1);
      expect(unicode.charWidth('!')).toBe(1);
    });

    test('should return 2 for full-width characters', () => {
      expect(unicode.charWidth('あ')).toBe(2); // Hiragana
      expect(unicode.charWidth('漢')).toBe(2); // Kanji
      expect(unicode.charWidth('한')).toBe(2); // Hangul
      expect(unicode.charWidth('￥')).toBe(2); // Full-width Yen symbol
    });

    test('should return 0 for combining characters', () => {
      expect(unicode.charWidth('\u0300')).toBe(0); // Combining grave accent
      expect(unicode.charWidth('\u0301')).toBe(0); // Combining acute accent
    });
  });

  describe('strWidth', () => {
    test('should calculate the correct width for ASCII strings', () => {
      expect(unicode.strWidth('hello')).toBe(5);
      expect(unicode.strWidth('abc123')).toBe(6);
    });

    test('should calculate the correct width for mixed strings', () => {
      expect(unicode.strWidth('hello漢字')).toBe(9); // 5 + (2*2)
      expect(unicode.strWidth('こんにちは')).toBe(10); // 5 * 2
    });

    test('should handle combining characters correctly', () => {
      expect(unicode.strWidth('e\u0301')).toBe(1); // é (e + combining acute)
      expect(unicode.strWidth('a\u0308bc')).toBe(3); // ä + bc
    });

    test('should handle surrogate pairs correctly', () => {
      expect(unicode.strWidth('🎉')).toBe(2); // emoji
      expect(unicode.strWidth('hello 🎉')).toBe(8); // 6 + 2
    });
  });

  describe('isSurrogate', () => {
    test('should correctly identify surrogate pairs', () => {
      expect(unicode.isSurrogate('🎉')).toBe(true);
      expect(unicode.isSurrogate('🇰🇷')).toBe(true);
    });

    test('should return false for regular characters', () => {
      expect(unicode.isSurrogate('a')).toBe(false);
      expect(unicode.isSurrogate('漢')).toBe(false);
    });
  });

  describe('isCombining', () => {
    test('should correctly identify combining characters', () => {
      expect(unicode.isCombining('\u0300')).toBe(true); // Combining grave accent
      expect(unicode.isCombining('\u0301')).toBe(true); // Combining acute accent
    });

    test('should return false for non-combining characters', () => {
      expect(unicode.isCombining('a')).toBe(false);
      expect(unicode.isCombining('漢')).toBe(false);
    });
  });
});