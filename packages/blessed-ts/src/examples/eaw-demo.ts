/**
 * East Asian Width demo
 * Demonstrates the improved character width calculations
 */

import { unicode } from '../utils/unicode';
import { getEastAsianWidth, getCharacterWidth } from '../utils/eaw';
import { EastAsianWidth, CharacterWidth } from '../types/unicode';

// Examples of different character types
const examples = [
  { char: 'A', desc: 'Basic Latin' },
  { char: 'ñ', desc: 'Latin with diacritic' },
  { char: 'Ж', desc: 'Cyrillic' },
  { char: '漢', desc: 'CJK Ideograph' },
  { char: 'あ', desc: 'Hiragana' },
  { char: 'カ', desc: 'Katakana' },
  { char: '한', desc: 'Hangul' },
  { char: '☺', desc: 'Symbol' },
  { char: '😀', desc: 'Emoji' },
  { char: '👨‍👩‍👧‍👦', desc: 'Complex emoji (family)' },
  { char: 'é', desc: 'Composed character' },
  { char: 'e\u0301', desc: 'Decomposed character (e + combining acute)' },
  { char: '￥', desc: 'Full-width Yen' },
  { char: 'Ａ', desc: 'Full-width Latin A' }
];

// Function to demonstrate width calculation
function demonstrateWidthCalculation(): void {
  console.log('East Asian Width Demo');
  console.log('=====================\n');
  console.log('Character | Code Point | EAW      | Display Width | String Width');
  console.log('----------|------------|----------|--------------|------------');

  for (const example of examples) {
    const char = example.char;
    const codePoint = unicode.codePointAt(char, 0);
    const eaw = getEastAsianWidth(codePoint);
    const displayWidth = getCharacterWidth(codePoint);
    const stringWidth = unicode.strWidth(char);

    console.log(
      `${char.padEnd(10)} | U+${codePoint.toString(16).toUpperCase().padStart(8, '0')} | ${eaw.padEnd(8)} | ${displayWidth}            | ${stringWidth}`
    );
  }

  console.log('\nEAW Legend:');
  console.log('  F - Fullwidth');
  console.log('  W - Wide');
  console.log('  H - Halfwidth');
  console.log('  Na - Narrow');
  console.log('  A - Ambiguous');
  console.log('  N - Neutral');
}

// Run the demonstration
demonstrateWidthCalculation();