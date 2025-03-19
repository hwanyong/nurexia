/**
 * line.ts - line element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { Box, BoxOptions } from './box';
import { NodeType, Border } from '../types';

/**
 * Line options interface
 */
export interface LineOptions extends BoxOptions {
  /**
   * Line orientation: 'vertical' or 'horizontal'
   */
  orientation?: 'vertical' | 'horizontal';

  /**
   * Line type: 'line' or 'bg'
   */
  type?: 'line' | 'bg';

  /**
   * Character to use for drawing the line
   */
  ch?: string;
}

/**
 * Line Class - Simple line element
 */
export class Line extends Box {
  /**
   * Line specific properties
   */
  type: NodeType = 'line';
  orientation: 'vertical' | 'horizontal';

  /**
   * Line constructor
   */
  constructor(options: LineOptions = {}) {
    // Set orientation
    const orientation = options.orientation || 'vertical';

    // Set fixed dimensions based on orientation
    if (orientation === 'vertical') {
      options.width = 1;
    } else {
      options.height = 1;
    }

    // Call parent constructor
    super(options);

    // Store orientation
    this.orientation = orientation;

    // Set character for the line
    this.ch = !options.type || options.type === 'line'
      ? orientation === 'horizontal' ? '─' : '│'
      : options.ch || ' ';

    // Set border properties
    this.border = {
      type: 'bg'
    } as Border;

    // Set border style
    this.style.border = this.style;
  }
}