/**
 * element.ts - base Element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { Node, NodeOptions } from './node';
import { NodeType, Style, Position, Border } from '../types';
import { Program } from '../program/program';

/**
 * Element options interface
 */
export interface ElementOptions extends NodeOptions {
  name?: string;
  position?: {
    left?: Position;
    right?: Position;
    top?: Position;
    bottom?: Position;
    width?: Position | 'shrink';
    height?: Position | 'shrink';
  };
  left?: Position;
  right?: Position;
  top?: Position;
  bottom?: Position;
  width?: Position | 'shrink';
  height?: Position | 'shrink';
  noOverflow?: boolean;
  dockBorders?: boolean;
  shadow?: boolean;
  style?: Style;
  fg?: string;
  bg?: string;
  bold?: boolean;
  underline?: boolean;
  blink?: boolean;
  inverse?: boolean;
  invisible?: boolean;
  transparent?: boolean;
  hidden?: boolean;
  fixed?: boolean;
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  wrap?: boolean;
  shrink?: boolean;
  ch?: string;
  draggable?: boolean;
  clickable?: boolean;
  input?: boolean;
  keyable?: boolean;
  tags?: boolean;
  border?: Border | boolean;
  padding?: number | { left?: number; right?: number; top?: number; bottom?: number };
  hover?: boolean;
  scrollable?: boolean;
  mouse?: boolean;
  keys?: boolean;
  autoFocus?: boolean;
  content?: string;
}

/**
 * Element position interface
 */
export interface ElementPosition {
  left: Position;
  right: Position;
  top: Position;
  bottom: Position;
  width?: Position | 'shrink';
  height?: Position | 'shrink';
}

/**
 * Element Class - Base for all visual elements
 */
export class Element extends Node {
  /**
   * Element properties
   */
  type: NodeType = 'element';
  name?: string;

  // Additional position properties beyond what Node provides
  private _width?: Position | 'shrink';
  private _height?: Position | 'shrink';

  noOverflow: boolean;
  dockBorders: boolean;
  shadow: boolean;
  style: Style;
  hidden: boolean;
  fixed: boolean;
  align: 'left' | 'center' | 'right';
  valign: 'top' | 'middle' | 'bottom';
  wrap: boolean;
  shrink: boolean;
  ch: string;
  border?: { type?: string; ch?: string; bg?: string; fg?: string };
  padding?: { left: number; right: number; top: number; bottom: number };
  hover?: boolean;
  draggable?: boolean;

  /**
   * Element constructor
   */
  constructor(options: ElementOptions = {}) {
    super(options);

    this.name = options.name;

    // Helper function to convert Position to number safely
    const toNumber = (pos?: Position): number => {
      if (pos === undefined) return 0;
      if (typeof pos === 'number') return pos;
      if (pos === 'center') return 0; // Center will be calculated later
      return 0; // Default for now, will be resolved during rendering
    };

    // Initialize position properties from Node
    this.position = {
      left: toNumber(options.position?.left || options.left),
      right: toNumber(options.position?.right || options.right),
      top: toNumber(options.position?.top || options.top),
      bottom: toNumber(options.position?.bottom || options.bottom)
    };

    // Store width and height separately
    this._width = options.width !== undefined ? options.width :
                 (options.position?.width !== undefined ? options.position.width : 0);
    this._height = options.height !== undefined ? options.height :
                  (options.position?.height !== undefined ? options.position.height : 0);

    // Handle shrink option
    if (this._width === 'shrink' || this._height === 'shrink') {
      if (this._width === 'shrink') {
        this._width = undefined;
      }
      if (this._height === 'shrink') {
        this._height = undefined;
      }
      this.shrink = true;
    }

    // Set other properties
    this.noOverflow = options.noOverflow || false;
    this.dockBorders = options.dockBorders || false;
    this.shadow = options.shadow || false;

    // Initialize style
    this.style = options.style || {};
    if (!options.style) {
      this.style.fg = options.fg;
      this.style.bg = options.bg;
      this.style.bold = options.bold;
      this.style.underline = options.underline;
      this.style.blink = options.blink;
      this.style.inverse = options.inverse;
      this.style.invisible = options.invisible;
      this.style.transparent = options.transparent;
    }

    this.hidden = options.hidden || false;
    this.fixed = options.fixed || false;
    this.align = options.align || 'left';
    this.valign = options.valign || 'top';
    this.wrap = options.wrap !== false;
    this.shrink = options.shrink || false;
    this.ch = options.ch || ' ';

    // Initialize border
    if (options.border) {
      if (typeof options.border === 'boolean') {
        this.border = {
          type: 'line',
          fg: this.style.fg,
          bg: this.style.bg
        };
      } else {
        this.border = options.border;
      }
    }

    // Initialize padding
    if (options.padding !== undefined) {
      if (typeof options.padding === 'number') {
        this.padding = {
          left: options.padding,
          right: options.padding,
          top: options.padding,
          bottom: options.padding
        };
      } else {
        this.padding = {
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          ...options.padding
        };
      }
    }

    // Initialize other options
    this.hover = options.hover;
    this.draggable = options.draggable;

    // Initialize content if available
    if (options.content) {
      this.setContent(options.content);
    }
  }

  /**
   * Get element width
   */
  get width(): Position | 'shrink' | undefined {
    return this._width;
  }

  /**
   * Set element width
   */
  set width(value: Position | 'shrink' | undefined) {
    this._width = value;
    if (value === 'shrink') {
      this._width = undefined;
      this.shrink = true;
    }
  }

  /**
   * Get element height
   */
  get height(): Position | 'shrink' | undefined {
    return this._height;
  }

  /**
   * Set element height
   */
  set height(value: Position | 'shrink' | undefined) {
    this._height = value;
    if (value === 'shrink') {
      this._height = undefined;
      this.shrink = true;
    }
  }

  /**
   * Set the content of the element
   */
  setContent(content: string): this {
    // To be implemented
    return this;
  }

  /**
   * Get the content of the element
   */
  getContent(): string {
    // To be implemented
    return '';
  }

  /**
   * Calculate and return the element's rendered dimensions
   */
  render(): { width: number; height: number } {
    // To be implemented
    return { width: 0, height: 0 };
  }

  /**
   * Parse content tags
   */
  parseTags(text: string): string {
    // To be implemented
    return text;
  }

  /**
   * Calculate element position and dimensions
   */
  calculatePosition(): void {
    // To be implemented
  }

  /**
   * Render element content
   */
  renderContent(): string {
    // To be implemented
    return '';
  }

  /**
   * Focus this element
   */
  focus(): this {
    // To be implemented
    return this;
  }

  /**
   * Remove focus from this element
   */
  blur(): this {
    // To be implemented
    return this;
  }

  /**
   * Check if element has focus
   */
  hasFocus(): boolean {
    // To be implemented
    return false;
  }
}