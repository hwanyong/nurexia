/**
 * textbox.ts - textbox element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { Textarea, TextareaOptions } from './textarea';
import { NodeType } from '../types';

/**
 * TextBox options interface
 */
export interface TextBoxOptions extends TextareaOptions {
  // TextBox-specific options can be added here
}

/**
 * TextBox Class - Text input widget with focus and key handling
 *
 * This is a multi-line input like Textarea but with enhanced editing
 * and movement functionality specifically for editing text.
 */
export class TextBox extends Textarea {
  /**
   * TextBox specific properties
   */
  type: NodeType = 'textbox';

  /**
   * TextBox constructor
   */
  constructor(options: TextBoxOptions = {}) {
    super(options);

    // TextBox-specific initialization
    this.on('focus', () => {
      this.readInput();
    });
  }

  /**
   * Handle specific key events for TextBox
   */
  _listener(ch: string, key: any): void {
    // Add TextBox-specific key handling here if needed
    super._listener(ch, key);
  }

  /**
   * Set the value with specific TextBox handling
   */
  setValue(value?: string): this {
    return super.setValue(value);
  }

  /**
   * Render the TextBox
   */
  render(): { width: number; height: number } {
    return super.render();
  }
}