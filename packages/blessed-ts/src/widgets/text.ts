/**
 * text.ts - text element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { Element, ElementOptions } from './element';
import { NodeType } from '../types';

/**
 * Text options interface
 */
export interface TextOptions extends ElementOptions {
  content?: string;
  text?: string;
  // Additional text-specific options can be added here
}

/**
 * Text Class - Simple text display element
 *
 * The Text element is used for displaying non-interactive text.
 * It shrinks to fit its content by default.
 */
export class Text extends Element {
  /**
   * Text properties
   */
  type: NodeType = 'text';

  /**
   * Text constructor
   */
  constructor(options: TextOptions = {}) {
    // Ensure shrink is enabled by default
    options.shrink = options.shrink !== false;

    // Initialize as Element
    super(options);

    // Set content if provided
    if (options.content || options.text) {
      this.setContent(options.content || options.text || '');
    }
  }

  /**
   * Get plain text content (without tags)
   * This will be implemented later when tag parsing is added to Element
   */
  getPlainText(): string {
    // For now, just return the regular content
    // In the future, this should strip tags
    return this.getContent();
  }
}