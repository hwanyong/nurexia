/**
 * radioset.ts - radio set element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { Box, BoxOptions } from './box';
import { NodeType } from '../types';

/**
 * RadioSet options interface
 */
export interface RadioSetOptions extends BoxOptions {
  // RadioSet specific options can be added here
}

/**
 * RadioSet Class - Container for RadioButton elements
 */
export class RadioSet extends Box {
  /**
   * RadioSet specific properties
   */
  type: NodeType = 'radio-set';

  /**
   * RadioSet constructor
   */
  constructor(options: RadioSetOptions = {}) {
    super(options);
  }

  /**
   * Get the value of the currently selected radio button
   */
  getValue(): string | null {
    let selected: any = null;

    // Find the checked radio button
    this.forDescendants((el: any) => {
      if (el.type === 'radio-button' && el.checked) {
        selected = el;
        return false; // Stop searching
      }
    });

    return selected ? selected.text : null;
  }
}