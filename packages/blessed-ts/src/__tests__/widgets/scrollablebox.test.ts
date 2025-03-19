/**
 * scrollablebox.test.ts - Tests for ScrollableBox widget
 */

import { ScrollableBox, ScrollableBoxOptions } from '../../widgets/scrollablebox';
import { Box } from '../../widgets/box';

describe('ScrollableBox', () => {
  // Basic instantiation
  test('should create a scrollable box with default options', () => {
    const sbox = new ScrollableBox();
    expect(sbox).toBeInstanceOf(ScrollableBox);
    expect(sbox).toBeInstanceOf(Box);
    expect(sbox.type).toBe('scrollable-box');
    expect(sbox.scrollable).toBe(true);
    expect(sbox.childBase).toBe(0);
    expect(sbox.childOffset).toBe(0);
    expect(sbox.alwaysScroll).toBe(false);
  });

  // ScrollableBox with options
  test('should create a scrollable box with custom options', () => {
    const options: ScrollableBoxOptions = {
      width: 40,
      height: 20,
      scrollable: true,
      alwaysScroll: true,
      baseLimit: 100,
      scrollbar: {
        ch: '█',
        fg: 'blue',
        track: {
          ch: '│',
          fg: 'gray'
        }
      }
    };

    const sbox = new ScrollableBox(options);
    expect(sbox.width).toBe(40);
    expect(sbox.height).toBe(20);
    expect(sbox.scrollable).toBe(true);
    expect(sbox.alwaysScroll).toBe(true);
    expect(sbox.baseLimit).toBe(100);
    expect(sbox.scrollbar).toBeDefined();
    expect(sbox.scrollbar?.ch).toBe('█');
    expect(sbox.style.scrollbar?.fg).toBe('blue');
    expect(sbox.track?.ch).toBe('│');
    expect(sbox.style.track?.fg).toBe('gray');
  });

  // Scroll methods
  test('should have scroll methods', () => {
    const sbox = new ScrollableBox();

    // Test that required methods exist
    expect(typeof sbox.scrollTo).toBe('function');
    expect(typeof sbox.setScroll).toBe('function');
    expect(typeof sbox.getScroll).toBe('function');
    expect(typeof sbox.scroll).toBe('function');
    expect(typeof sbox.resetScroll).toBe('function');
    expect(typeof sbox.getScrollHeight).toBe('function');
    expect(typeof sbox.getScrollPerc).toBe('function');
    expect(typeof sbox.setScrollPerc).toBe('function');
  });

  // Initial scroll position
  test('should have initial scroll position at 0', () => {
    const sbox = new ScrollableBox();
    expect(sbox.getScroll()).toBe(0);
  });
});