/**
 * Tests for bidirectional text utilities
 */

import { bidi, Direction, isRTL, detectDirection, reorderBidiText } from '../bidi';

// Type declarations for Jest globals
declare const describe: any;
declare const test: any;
declare const expect: any;

describe('Bidirectional text utilities', () => {
  // Test isRTL function
  describe('isRTL', () => {
    test('should identify Hebrew characters as RTL', () => {
      // Hebrew letter Alef (א)
      expect(isRTL(0x05D0)).toBe(true);
    });

    test('should identify Arabic characters as RTL', () => {
      // Arabic letter Alef (ا)
      expect(isRTL(0x0627)).toBe(true);
    });

    test('should not identify Latin characters as RTL', () => {
      // Latin 'A'
      expect(isRTL(0x0041)).toBe(false);
    });
  });

  // Test detectDirection function
  describe('detectDirection', () => {
    test('should detect LTR direction for Latin text', () => {
      expect(detectDirection('Hello world')).toBe(Direction.LTR);
    });

    test('should detect RTL direction for Hebrew text', () => {
      // "שלום" (Shalom)
      expect(detectDirection('שלום')).toBe(Direction.RTL);
    });

    test('should detect RTL direction for Arabic text', () => {
      // "مرحبا" (Hello)
      expect(detectDirection('مرحبا')).toBe(Direction.RTL);
    });

    test('should detect dominant direction in mixed text', () => {
      // More Latin than Hebrew
      expect(detectDirection('Hello שלום world')).toBe(Direction.LTR);

      // More Hebrew than Latin
      expect(detectDirection('שלום Hello שלום עולם')).toBe(Direction.RTL);
    });
  });

  // Test reorderBidiText function
  describe('reorderBidiText', () => {
    test('should not change LTR text', () => {
      const text = 'Hello world';
      expect(reorderBidiText(text)).toBe(text);
    });

    test('should reorder RTL text segments', () => {
      // This is a simple test with words separated by spaces
      // In a real implementation, we would need more sophisticated tests
      const text = 'שלום world';

      // In this simplified model, we expect words to be reordered (reverse order)
      expect(reorderBidiText(text)).not.toBe(text);
    });

    test('should handle empty strings', () => {
      expect(reorderBidiText('')).toBe('');
    });
  });

  // Test the exported bidi object
  describe('bidi object', () => {
    test('should expose all required methods', () => {
      expect(bidi.isRTL).toBeDefined();
      expect(bidi.detectDirection).toBeDefined();
      expect(bidi.reorderBidiText).toBeDefined();
      expect(bidi.processBidiText).toBeDefined();
      expect(bidi.Direction).toBeDefined();
    });
  });
});