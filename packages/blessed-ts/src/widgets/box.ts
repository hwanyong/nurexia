/**
 * box.ts - box element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { Element, ElementOptions } from './element';
import { NodeType } from '../types';

/**
 * Box options interface
 */
export interface BoxOptions extends ElementOptions {
  // Box-specific options can be added here
}

/**
 * Box Class - Base container for all interactive elements
 */
export class Box extends Element {
  /**
   * Box properties
   */
  type: NodeType = 'box';

  /**
   * Box constructor
   */
  constructor(options: BoxOptions = {}) {
    super(options);
  }

  /**
   * Additional box-specific methods can be added here
   */
}