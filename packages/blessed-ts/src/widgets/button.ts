/**
 * button.ts - button element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { Box, BoxOptions } from './box';
import { NodeType } from '../types';

/**
 * Button options interface
 */
export interface ButtonOptions extends BoxOptions {
  /**
   * Button content/text
   */
  content?: string;

  /**
   * The name of the key that activates the button
   */
  mouse?: boolean;

  /**
   * Whether to automatically cancel the key press event
   */
  keys?: boolean;

  /**
   * Callback for when the button is pressed
   */
  onPress?: () => void;
}

/**
 * Button Class - A clickable button widget
 */
export class Button extends Box {
  /**
   * Button specific properties
   */
  type: NodeType = 'button';

  /**
   * Callback for when the button is pressed
   */
  onPress?: () => void;

  /**
   * Options for this button
   */
  options: ButtonOptions;

  /**
   * Button constructor
   */
  constructor(options: ButtonOptions = {}) {
    // Set default options for buttons
    options.clickable = options.clickable !== false;
    options.mouse = options.mouse !== false;
    options.keyable = options.keyable !== false;
    options.keys = options.keys !== false;

    super(options);

    this.options = options;
    this.onPress = options.onPress;

    // Handle press events (click or enter key)
    if (this.options.mouse) {
      this.on('click', () => {
        this.press();
      });
    }

    if (this.options.keys) {
      this.on('keypress', (ch, key) => {
        if (key.name === 'enter' || key.name === 'return' || key.name === 'space') {
          this.press();
        }
      });
    }
  }

  /**
   * Called when the button is pressed (clicked or enter key)
   */
  press(): void {
    this.emit('press');
    if (this.onPress) {
      this.onPress();
    }
  }

  /**
   * Render the button
   */
  render(): { width: number; height: number } {
    // Highlight when focused
    if (this.screen && (this.screen as any).focused === this) {
      this.style = this.style || {};
      this.style.fg = this.style.fg || 'black';
      this.style.bg = this.style.bg || 'white';
      this.style.bold = this.style.bold !== false;
    }

    return super.render();
  }
}