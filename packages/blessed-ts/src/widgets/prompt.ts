/**
 * prompt.ts - prompt element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { Box, BoxOptions } from './box';
import { Button } from './button';
import { TextBox } from './textbox';
import { NodeType } from '../types';

/**
 * Prompt widget internal properties
 */
interface PromptPrivate {
  input: TextBox;
  okay: Button;
  cancel: Button;
}

/**
 * Prompt options interface
 */
export interface PromptOptions extends BoxOptions {
  // Prompt-specific options can be added here
}

/**
 * Prompt Class - A popup dialog with text input
 */
export class Prompt extends Box {
  /**
   * Prompt specific properties
   */
  type: NodeType = 'prompt';
  options: PromptOptions;

  /**
   * Internal component references
   */
  private _: PromptPrivate;

  /**
   * Prompt constructor
   */
  constructor(options: PromptOptions = {}) {
    // Set default options
    options.hidden = true;

    // Call parent constructor
    super(options);

    // Store options
    this.options = options;

    // Create internal structure
    this._ = {} as PromptPrivate;

    // Create input textbox
    this._.input = new TextBox({
      parent: this,
      top: 3,
      height: 1,
      left: 2,
      right: 2,
      bg: 'black'
    });

    // Create OK button
    this._.okay = new Button({
      parent: this,
      top: 5,
      height: 1,
      left: 2,
      width: 6,
      content: 'Okay',
      align: 'center',
      bg: 'black',
      hoverBg: 'blue',
      autoFocus: false,
      mouse: true
    });

    // Create Cancel button
    this._.cancel = new Button({
      parent: this,
      top: 5,
      height: 1,
      shrink: true,
      left: 10,
      width: 8,
      content: 'Cancel',
      align: 'center',
      bg: 'black',
      hoverBg: 'blue',
      autoFocus: false,
      mouse: true
    });
  }

  /**
   * Show a prompt and get user input
   * @param text Prompt text/question to display
   * @param value Default value for the input field
   * @param callback Callback function to call with the result
   */
  input(text: string, value: string | Function, callback?: (err: Error | null, result: string) => void): void {
    // Handle callback as second argument
    if (typeof value === 'function') {
      callback = value as (err: Error | null, result: string) => void;
      value = '';
    }

    this.readInput(text, value as string, callback as (err: Error | null, result: string) => void);
  }

  /**
   * Set input value (alias for input)
   */
  setInput = this.input;

  /**
   * Read input from user (alias for input)
   */
  readInput(text: string, value: string, callback: (err: Error | null, result: string) => void): void {
    const self = this;
    let okay: Function;
    let cancel: Function;

    // Show the prompt
    (this as any).show();
    this.setContent(' ' + text);

    // Set initial value
    this._.input.value = value;

    // Save current focus
    if (this.screen) {
      (this.screen as any).saveFocus();
    }

    // Handle "Okay" button press
    this._.okay.on('press', okay = function() {
      (self._.input as any).submit();
    });

    // Handle "Cancel" button press
    this._.cancel.on('press', cancel = function() {
      (self._.input as any).cancel();
    });

    // Read input and handle completion
    (this._.input as any).readInput(function(err: Error | null, data: string) {
      (self as any).hide();

      // Restore previous focus
      if (self.screen) {
        (self.screen as any).restoreFocus();
      }

      // Clean up event listeners
      (self._.okay as any).off('press', okay);
      (self._.cancel as any).off('press', cancel);

      // Call the callback with the result
      return callback(err, data);
    });

    // Render the screen
    if (this.screen) {
      (this.screen as any).render();
    }
  }
}