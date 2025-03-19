/**
 * question.ts - question element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { Box, BoxOptions } from './box';
import { Button } from './button';
import { NodeType } from '../types';

/**
 * Question widget internal properties
 */
interface QuestionPrivate {
  okay: Button;
  cancel: Button;
}

/**
 * Question options interface
 */
export interface QuestionOptions extends BoxOptions {
  // Question-specific options can be added here
}

/**
 * Question Class - A popup dialog with Yes/No options
 */
export class Question extends Box {
  /**
   * Question specific properties
   */
  type: NodeType = 'question';
  options: QuestionOptions;

  /**
   * Internal button references
   */
  private _: QuestionPrivate;

  /**
   * Question constructor
   */
  constructor(options: QuestionOptions = {}) {
    // Set default options
    options.hidden = true;

    // Call parent constructor
    super(options);

    // Store options
    this.options = options;

    // Create internal structure
    this._ = {} as QuestionPrivate;

    // Create OK button
    this._.okay = new Button({
      screen: this.screen || undefined,
      parent: this,
      top: 2,
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
      screen: this.screen || undefined,
      parent: this,
      top: 2,
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
   * Register an event listener on the screen
   */
  onScreenEvent(event: string, handler: Function): void {
    (this as any).onScreenEvent(event, handler);
  }

  /**
   * Remove a screen event listener
   */
  removeScreenEvent(event: string, handler: Function): void {
    (this as any).removeScreenEvent(event, handler);
  }

  /**
   * Display a question and wait for user response
   * @param text Question text to display
   * @param callback Callback function to call with the result (true/false)
   */
  ask(text: string, callback: (err: Error | null, result: boolean) => void): void {
    const self = this;
    let press: Function;
    let okay: Function;
    let cancel: Function;

    // Show the question dialog
    (this as any).show();
    this.setContent(' ' + text);

    // Handle keypress event
    this.onScreenEvent('keypress', press = function(ch: string, key: { name: string }) {
      // Ignore mouse events
      if (key.name === 'mouse') return;

      // Only allow specific keys
      if (key.name !== 'enter'
          && key.name !== 'escape'
          && key.name !== 'q'
          && key.name !== 'y'
          && key.name !== 'n') {
        return;
      }

      // Call done with the result
      done(null, key.name === 'enter' || key.name === 'y');
    });

    // Handle "Okay" button press
    this._.okay.on('press', okay = function() {
      done(null, true);
    });

    // Handle "Cancel" button press
    this._.cancel.on('press', cancel = function() {
      done(null, false);
    });

    // Save current focus and focus on the question
    if (this.screen) {
      (this.screen as any).saveFocus();
    }
    this.focus();

    // Function to handle completion
    function done(err: Error | null, data: boolean): void {
      (self as any).hide();

      // Restore previous focus
      if (self.screen) {
        (self.screen as any).restoreFocus();
      }

      // Clean up event listeners
      self.removeScreenEvent('keypress', press);

      // Use off method for event removal
      (self._.okay as any).off('press', okay);
      (self._.cancel as any).off('press', cancel);

      // Call the callback with the result
      return callback(err, data);
    }

    // Render the screen
    if (this.screen) {
      (this.screen as any).render();
    }
  }
}