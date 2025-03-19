/**
 * checkbox.ts - checkbox element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { Input, InputOptions } from './input';
import { NodeType } from '../types';

/**
 * Checkbox options interface
 */
export interface CheckboxOptions extends InputOptions {
  checked?: boolean;
  text?: string;
  content?: string;
}

/**
 * Checkbox Class - Checkbox widget
 */
export class Checkbox extends Input {
  /**
   * Checkbox specific properties
   */
  type: NodeType = 'checkbox';
  text: string;
  checked: boolean;

  // We're not using the string value from Input class
  // Instead, we track the checked state separately
  declare value: any; // Using 'declare' to indicate we're aware of the override

  /**
   * Checkbox constructor
   */
  constructor(options: CheckboxOptions = {}) {
    super(options);

    this.text = options.content || options.text || '';
    this.checked = options.checked || false;
    this.value = this.checked; // Set value to match checked state

    this.on('keypress', (ch: string, key: any) => {
      if (key.name === 'enter' || key.name === 'space') {
        this.toggle();
        this.screen.render();
      }
    });

    if (options.mouse) {
      this.on('click', () => {
        this.toggle();
        this.screen.render();
      });
    }

    this.on('focus', () => {
      const lpos = this.lpos;
      if (!lpos) return;
      this.screen.program.lsaveCursor('checkbox');
      this.screen.program.cup(lpos.yi, lpos.xi + 1);
      this.screen.program.showCursor();
    });

    this.on('blur', () => {
      this.screen.program.lrestoreCursor('checkbox', true);
    });
  }

  /**
   * Render the checkbox
   */
  render(): any {
    // Set content instead of using clearPos and setContent with two parameters
    this.setContent('[' + (this.checked ? 'x' : ' ') + '] ' + this.text);
    return super.render();
  }

  /**
   * Check the checkbox
   */
  check(): void {
    if (this.checked) return;
    this.checked = true;
    this.value = true;
    this.emit('check');
  }

  /**
   * Uncheck the checkbox
   */
  uncheck(): void {
    if (!this.checked) return;
    this.checked = false;
    this.value = false;
    this.emit('uncheck');
  }

  /**
   * Toggle the checkbox state
   */
  toggle(): void {
    this.checked ? this.uncheck() : this.check();
  }
}