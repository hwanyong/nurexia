/**
 * box.test.ts - Tests for Box widget
 */

import { Box, BoxOptions } from '../../widgets/box';
import { Element } from '../../widgets/element';

describe('Box', () => {
  // Basic instantiation
  test('should create a box with default options', () => {
    const box = new Box();
    expect(box).toBeInstanceOf(Box);
    expect(box).toBeInstanceOf(Element);
    expect(box.type).toBe('box');
  });

  // Box with options
  test('should create a box with custom options', () => {
    const options: BoxOptions = {
      width: 30,
      height: 10,
      style: {
        fg: 'white',
        bg: 'blue'
      },
      border: {
        type: 'line'
      },
      content: 'Hello Box'
    };

    const box = new Box(options);
    expect(box.width).toBe(30);
    expect(box.height).toBe(10);
    expect(box.style.fg).toBe('white');
    expect(box.style.bg).toBe('blue');
    expect(box.border).toBeDefined();
    expect(box.border?.type).toBe('line');
  });

  // Inheritance
  test('should inherit properties and methods from Element', () => {
    const box = new Box();

    // Test Element properties
    expect(box.align).toBe('left');
    expect(box.valign).toBe('top');
    expect(box.wrap).toBe(true);

    // Test Element methods
    expect(typeof box.setContent).toBe('function');
    expect(typeof box.getContent).toBe('function');
    expect(typeof box.focus).toBe('function');
    expect(typeof box.blur).toBe('function');
  });
});