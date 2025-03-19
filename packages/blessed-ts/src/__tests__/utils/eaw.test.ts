/**
 * Tests for East Asian Width utilities
 */

import { getEastAsianWidth, getCharacterWidth } from '../../utils/eaw';
import { EastAsianWidth, CharacterWidth } from '../../types/unicode';

describe('East Asian Width Utilities', () => {
  describe('getEastAsianWidth', () => {
    test('should correctly identify Full Width characters', () => {
      expect(getEastAsianWidth(0xFF01)).toBe(EastAsianWidth.FULLWIDTH); // Full-width !
      expect(getEastAsianWidth(0xFF21)).toBe(EastAsianWidth.FULLWIDTH); // Full-width A
      expect(getEastAsianWidth(0xFFE5)).toBe(EastAsianWidth.FULLWIDTH); // Full-width ¥
    });

    test('should correctly identify Wide characters', () => {
      expect(getEastAsianWidth(0x4E00)).toBe(EastAsianWidth.WIDE); // CJK Ideograph
      expect(getEastAsianWidth(0x3042)).toBe(EastAsianWidth.WIDE); // Hiragana あ
      expect(getEastAsianWidth(0xAC00)).toBe(EastAsianWidth.WIDE); // Hangul 가
    });

    test('should correctly identify Half Width characters', () => {
      expect(getEastAsianWidth(0xFF61)).toBe(EastAsianWidth.HALFWIDTH); // Half-width ideographic period
      expect(getEastAsianWidth(0xFF65)).toBe(EastAsianWidth.HALFWIDTH); // Half-width katakana middle dot
      expect(getEastAsianWidth(0xFFE8)).toBe(EastAsianWidth.HALFWIDTH); // Half-width forms
    });

    test('should correctly identify Ambiguous Width characters', () => {
      expect(getEastAsianWidth(0x00A1)).toBe(EastAsianWidth.AMBIGUOUS); // Inverted Exclamation Mark
      expect(getEastAsianWidth(0x00A4)).toBe(EastAsianWidth.AMBIGUOUS); // Currency Sign
      expect(getEastAsianWidth(0x2030)).toBe(EastAsianWidth.AMBIGUOUS); // Per Mille Sign
    });

    test('should correctly identify Narrow characters', () => {
      expect(getEastAsianWidth(0x0061)).toBe(EastAsianWidth.NARROW); // 'a'
      expect(getEastAsianWidth(0x0041)).toBe(EastAsianWidth.NARROW); // 'A'
      expect(getEastAsianWidth(0x0031)).toBe(EastAsianWidth.NARROW); // '1'
    });

    test('should default to Neutral for other characters', () => {
      // Characters not explicitly in other categories
      // (This is a simplification as our test ranges are incomplete)
      expect(getEastAsianWidth(0x0100)).toBe(EastAsianWidth.NEUTRAL); // Latin A with macron
      expect(getEastAsianWidth(0x0400)).toBe(EastAsianWidth.NEUTRAL); // Cyrillic capital letter IE
    });
  });

  describe('getCharacterWidth', () => {
    test('should return 0 for control characters', () => {
      expect(getCharacterWidth(0x0000)).toBe(CharacterWidth.ZERO); // NULL
      expect(getCharacterWidth(0x001F)).toBe(CharacterWidth.ZERO); // Unit separator
      expect(getCharacterWidth(0x007F)).toBe(CharacterWidth.ZERO); // DEL
    });

    test('should return 0 for combining characters', () => {
      expect(getCharacterWidth(0x0300)).toBe(CharacterWidth.ZERO); // Combining grave accent
      expect(getCharacterWidth(0x0301)).toBe(CharacterWidth.ZERO); // Combining acute accent
      expect(getCharacterWidth(0x20D0)).toBe(CharacterWidth.ZERO); // Combining left harpoon above
    });

    test('should return 1 for standard ASCII and narrow characters', () => {
      expect(getCharacterWidth(0x0041)).toBe(CharacterWidth.ONE); // 'A'
      expect(getCharacterWidth(0x0061)).toBe(CharacterWidth.ONE); // 'a'
      expect(getCharacterWidth(0x0031)).toBe(CharacterWidth.ONE); // '1'
    });

    test('should return 2 for full-width and wide characters', () => {
      expect(getCharacterWidth(0x4E00)).toBe(CharacterWidth.TWO); // CJK Ideograph
      expect(getCharacterWidth(0x3042)).toBe(CharacterWidth.TWO); // Hiragana あ
      expect(getCharacterWidth(0xAC00)).toBe(CharacterWidth.TWO); // Hangul 가
      expect(getCharacterWidth(0xFF21)).toBe(CharacterWidth.TWO); // Full-width A
    });

    test('should handle emoji as wide by default', () => {
      expect(getCharacterWidth(0x1F600)).toBe(CharacterWidth.TWO); // 😀 Grinning Face
    });

    test('should respect ambiguousAsWide option', () => {
      // Without option (should default to env var or false)
      expect(getCharacterWidth(0x00A1)).not.toBe(CharacterWidth.TWO);

      // With option set to true
      expect(getCharacterWidth(0x00A1, { ambiguousAsWide: true })).toBe(CharacterWidth.TWO);

      // With option set to false
      expect(getCharacterWidth(0x00A1, { ambiguousAsWide: false })).toBe(CharacterWidth.ONE);
    });

    test('should respect emojiAsWide option', () => {
      expect(getCharacterWidth(0x1F600, { emojiAsWide: true })).toBe(CharacterWidth.TWO);
      expect(getCharacterWidth(0x1F600, { emojiAsWide: false })).not.toBe(CharacterWidth.TWO);
    });
  });
});