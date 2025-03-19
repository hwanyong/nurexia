/**
 * loading.ts - loading element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { Box, BoxOptions } from './box';
import { Text } from './text';
import { NodeType } from '../types';

/**
 * Loading widget internal properties
 */
interface LoadingPrivate {
  icon: Text;
  timer?: NodeJS.Timeout;
}

/**
 * Loading options interface
 */
export interface LoadingOptions extends BoxOptions {
  // Loading-specific options can be added here
}

/**
 * Loading Class - A loading indicator widget
 */
export class Loading extends Box {
  /**
   * Loading specific properties
   */
  type: NodeType = 'loading';
  options: LoadingOptions;

  /**
   * Internal component references
   */
  private _: LoadingPrivate;

  /**
   * Loading constructor
   */
  constructor(options: LoadingOptions = {}) {
    // Call parent constructor
    super(options);

    // Store options
    this.options = options;

    // Create internal structure
    this._ = {} as LoadingPrivate;

    // Create the loading icon
    this._.icon = new Text({
      parent: this,
      align: 'center',
      top: 2,
      left: 1,
      right: 1,
      height: 1,
      content: '|'
    });
  }

  /**
   * Start the loading animation
   * @param text Text content to display
   */
  load(text: string): void {
    const self = this;

    // Show the loading indicator
    (this as any).show();
    this.setContent(text);

    // Clear any existing timer
    if (this._.timer) {
      this.stop();
    }

    // Lock keyboard input
    if (this.screen) {
      (this.screen as any).lockKeys = true;
    }

    // Start the animation timer
    this._.timer = setInterval(function() {
      if (self._.icon.getContent() === '|') {
        self._.icon.setContent('/');
      } else if (self._.icon.getContent() === '/') {
        self._.icon.setContent('-');
      } else if (self._.icon.getContent() === '-') {
        self._.icon.setContent('\\');
      } else if (self._.icon.getContent() === '\\') {
        self._.icon.setContent('|');
      }

      // Render the screen
      if (self.screen) {
        (self.screen as any).render();
      }
    }, 200);
  }

  /**
   * Stop the loading animation
   */
  stop(): void {
    // Unlock keyboard input
    if (this.screen) {
      (this.screen as any).lockKeys = false;
    }

    // Hide the loading indicator
    (this as any).hide();

    // Clear the animation timer
    if (this._.timer) {
      clearInterval(this._.timer);
      delete this._.timer;
    }

    // Render the screen
    if (this.screen) {
      (this.screen as any).render();
    }
  }
}