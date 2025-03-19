/**
 * radiobutton.ts - radio button element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { Checkbox, CheckboxOptions } from './checkbox';
import { NodeType } from '../types';

/**
 * RadioButton options interface
 */
export interface RadioButtonOptions extends CheckboxOptions {
  // RadioButton specific options can be added here
}

/**
 * RadioButton Class - Radio button widget for selection groups
 */
export class RadioButton extends Checkbox {
  /**
   * RadioButton specific properties
   */
  type: NodeType = 'radio-button';

  /**
   * RadioButton constructor
   */
  constructor(options: RadioButtonOptions = {}) {
    super(options);

    this.on('check', () => {
      // When this radio button is checked, find the parent radio-set or form
      // and uncheck all other radio buttons in that container
      let el: any = this;
      while (el = el.parent) {
        if (el.type === 'radio-set' || el.type === 'form') break;
      }

      // If no appropriate parent found, use the direct parent
      el = el || this.parent;

      // Uncheck all other radio buttons in the container
      el.forDescendants((el: any) => {
        if (el.type !== 'radio-button' || el === this) {
          return;
        }
        el.uncheck();
      });
    });
  }

  /**
   * Render the radio button
   */
  render(): any {
    this.setContent('(' + (this.checked ? '*' : ' ') + ') ' + this.text);
    return super.render();
  }

  /**
   * Override toggle to always check (radio buttons only check, never uncheck via toggle)
   */
  toggle(): void {
    this.check();
  }
}