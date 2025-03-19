/**
 * message.ts - message element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { Box, BoxOptions } from './box';
import { NodeType } from '../types';

/**
 * Message options interface
 */
export interface MessageOptions extends BoxOptions {
  /**
   * Enable vi-style key bindings
   */
  vi?: boolean;

  /**
   * Keys to ignore for dismissing the message
   */
  ignoreKeys?: string[];

  /**
   * Enable mouse interaction
   */
  mouse?: boolean;

  /**
   * Enable scrollable content
   */
  scrollable?: boolean;
}

/**
 * Message Class - Popup message box
 */
export class Message extends Box {
  /**
   * Message specific properties
   */
  type: NodeType = 'message';
  options: MessageOptions;

  /**
   * Message constructor
   */
  constructor(options: MessageOptions = {}) {
    // Set default options
    options.tags = true;

    // Call parent constructor
    super(options);

    // Store options
    this.options = options;
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
   * Display a message for a specified time
   * @param text Text content to display
   * @param time Time in seconds (default: 3, 0/-1/Infinity: wait for key/mouse)
   * @param callback Callback function to call when message is hidden
   */
  display(text: string, time?: number | Function, callback?: Function): void {
    // Handle callback as second argument
    if (typeof time === 'function') {
      callback = time as Function;
      time = undefined;
    }

    // Default time is 3 seconds
    if (time == null) time = 3;

    // Handle scrollable message
    if (this.options.scrollable) {
      if (this.screen) {
        (this.screen as any).saveFocus();
      }
      this.focus();
      (this as any).scrollTo(0);
    }

    // Show the message with content
    (this as any).show();
    this.setContent(text);
    if (this.screen) {
      (this.screen as any).render();
    }

    // Handle infinite wait or wait for key/mouse
    if (time === Infinity || time === -1 || time === 0) {
      const end = () => {
        if ((end as any).done) return;
        (end as any).done = true;

        if (this.options.scrollable && this.screen) {
          try {
            (this.screen as any).restoreFocus();
          } catch (e) {
            // Ignore errors
          }
        }

        (this as any).hide();
        if (this.screen) {
          (this.screen as any).render();
        }
        if (callback) callback();
      };

      // Set up event listeners after a short delay
      setTimeout(() => {
        // Listen for keypress events
        this.onScreenEvent('keypress', function fn(ch: string, key: { name: string, ctrl?: boolean, shift?: boolean }) {
          const self = this as unknown as Message;

          // Allow scroll keys if scrollable
          if (self.options.scrollable) {
            if ((key.name === 'up' || (self.options.vi && key.name === 'k'))
              || (key.name === 'down' || (self.options.vi && key.name === 'j'))
              || (self.options.vi && key.name === 'u' && key.ctrl)
              || (self.options.vi && key.name === 'd' && key.ctrl)
              || (self.options.vi && key.name === 'b' && key.ctrl)
              || (self.options.vi && key.name === 'f' && key.ctrl)
              || (self.options.vi && key.name === 'g' && !key.shift)
              || (self.options.vi && key.name === 'g' && key.shift)) {
              return;
            }
          }

          // Skip ignored keys
          if (self.options.ignoreKeys && self.options.ignoreKeys.includes(key.name)) {
            return;
          }

          // Remove event listener and close
          self.removeScreenEvent('keypress', fn);
          end();
        });

        // Listen for mouse events if mouse is enabled
        if (this.options.mouse) {
          this.onScreenEvent('mouse', function fn(data: { action: string }) {
            const self = this as unknown as Message;
            if (data.action === 'mousemove') return;
            self.removeScreenEvent('mouse', fn);
            end();
          });
        }
      }, 10);

      return;
    }

    // Auto-hide after specified time
    setTimeout(() => {
      (this as any).hide();
      if (this.screen) {
        (this.screen as any).render();
      }
      if (callback) callback();
    }, (time as number) * 1000);
  }

  /**
   * Alias for display
   */
  log = this.display;

  /**
   * Display an error message
   * @param text Error text to display
   * @param time Time in seconds (default: 3, 0/-1/Infinity: wait for key/mouse)
   * @param callback Callback function to call when message is hidden
   */
  error(text: string, time?: number | Function, callback?: Function): void {
    return this.display(`{red-fg}Error: ${text}{/red-fg}`, time, callback);
  }
}