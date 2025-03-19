/**
 * image.ts - image element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { Box, BoxOptions } from './box';
import { NodeType } from '../types';

/**
 * Image options interface
 */
export interface ImageOptions extends BoxOptions {
  /**
   * Image type: 'ansi' for ANSIImage or 'overlay' for OverlayImage
   */
  type?: 'ansi' | 'overlay';

  /**
   * Alternative name for type
   */
  itype?: 'ansi' | 'overlay';

  /**
   * Path to the image file (for applicable image types)
   */
  file?: string;
}

/**
 * Image Class - Base wrapper for different image types
 *
 * This class delegates to either ANSIImage or OverlayImage based on the 'type' option.
 */
export class Image extends Box {
  /**
   * Widget type
   */
  type: NodeType = 'image';

  /**
   * Image constructor
   */
  constructor(options: ImageOptions = {}) {
    // Process options
    options = options || {};
    options.type = options.itype || options.type || 'ansi';

    super(options);

    // Dynamically become an ANSIImage instance if type is 'ansi'
    if (options.type === 'ansi' && this.type !== 'ansi-image') {
      try {
        // We must require here to avoid circular dependencies
        const { ANSIImage } = require('./ansiimage');

        // Copy all properties from ANSIImage prototype to this instance
        Object.getOwnPropertyNames(ANSIImage.prototype).forEach((key) => {
          if (key === 'type') return;
          Object.defineProperty(
            this,
            key,
            Object.getOwnPropertyDescriptor(ANSIImage.prototype, key) as PropertyDescriptor
          );
        });

        // Call ANSIImage constructor on this instance
        ANSIImage.call(this, options);
        return this;
      } catch (e) {
        throw new Error('Failed to load ANSIImage: ' + (e as Error).message);
      }
    }

    // Dynamically become an OverlayImage instance if type is 'overlay'
    if (options.type === 'overlay' && this.type !== 'overlay-image') {
      try {
        // We must require here to avoid circular dependencies
        const { OverlayImage } = require('./overlayimage');

        // Copy all properties from OverlayImage prototype to this instance
        Object.getOwnPropertyNames(OverlayImage.prototype).forEach((key) => {
          if (key === 'type') return;
          Object.defineProperty(
            this,
            key,
            Object.getOwnPropertyDescriptor(OverlayImage.prototype, key) as PropertyDescriptor
          );
        });

        // Call OverlayImage constructor on this instance
        OverlayImage.call(this, options);
        return this;
      } catch (e) {
        throw new Error('Failed to load OverlayImage: ' + (e as Error).message);
      }
    }

    throw new Error('`type` must either be `ansi` or `overlay`.');
  }
}