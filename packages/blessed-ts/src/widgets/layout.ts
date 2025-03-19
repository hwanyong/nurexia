/**
 * layout.ts - layout element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { Element, ElementOptions } from './element';
import { Node } from './node';
import { NodeType } from '../types';

/**
 * Coordinates interface
 */
export interface Coords {
  xi: number;
  xl: number;
  yi: number;
  yl: number;
}

/**
 * Layout options interface
 */
export interface LayoutOptions extends ElementOptions {
  layout?: 'inline' | 'grid';
  renderer?: (coords: Coords) => (el: Element, i: number) => boolean | void;
}

/**
 * Layout - A layout manager for arranging elements
 */
export class Layout extends Element {
  /**
   * Layout properties
   */
  type: NodeType = 'layout' as NodeType;
  layout: 'inline' | 'grid';
  lpos?: Coords;

  /**
   * Layout constructor
   */
  constructor(options: LayoutOptions = {}) {
    // Validate required options
    if ((options.width == null && (options.left == null && options.right == null)) ||
        (options.height == null && (options.top == null && options.bottom == null))) {
      throw new Error('`Layout` must have a width and height!');
    }

    // Set default layout type
    options.layout = options.layout || 'inline';

    super(options);

    this.layout = options.layout;

    // Set custom renderer if provided
    if (options.renderer) {
      this.renderer = options.renderer;
    }
  }

  /**
   * Check if an element is rendered
   */
  isRendered(el: Element): boolean {
    if (!(el as any).lpos) return false;
    const lpos = (el as any).lpos as Coords;
    return (lpos.xl - lpos.xi) > 0 && (lpos.yl - lpos.yi) > 0;
  }

  /**
   * Get the last rendered element before index i
   */
  getLast(i: number): Element | undefined {
    while (this.children[--i]) {
      const el = this.children[i] as Element;
      if (this.isRendered(el)) return el;
    }
    return undefined;
  }

  /**
   * Get the coordinates of the last rendered element before index i
   */
  getLastCoords(i: number): Coords | undefined {
    const last = this.getLast(i);
    if (last) return (last as any).lpos as Coords;
    return undefined;
  }

  /**
   * Get render coordinates
   */
  _renderCoords(): Coords | undefined {
    const coords = (this as any)._getCoords(true) as Coords;
    const children = this.children;
    this.children = [];
    (this as any)._render();
    this.children = children;
    return coords;
  }

  /**
   * Default renderer
   */
  renderer(coords: Coords): (el: Element, i: number) => boolean | void {
    const self = this;

    // The coordinates of the layout element
    const width = coords.xl - coords.xi;
    const height = coords.yl - coords.yi;
    const xi = coords.xi;
    const yi = coords.yi;

    // The current row offset in cells (which row are we on?)
    let rowOffset = 0;

    // The index of the first child in the row
    let rowIndex = 0;
    let lastRowIndex = 0;

    // Figure out the highest width child
    let highWidth = 0;
    if (this.layout === 'grid') {
      highWidth = this.children.reduce((out, el) => {
        const element = el as Element;
        return Math.max(out, element.width as number);
      }, 0);
    }

    return function iterator(el: Element, i: number): boolean | void {
      // Make our children shrinkable. If they don't have a height, for
      // example, calculate it for them.
      el.shrink = true;

      // Find the previous rendered child's coordinates
      const last = self.getLast(i);

      // If there is no previously rendered element, we are on the first child.
      if (!last) {
        el.position.left = 0;
        el.position.top = 0;
      } else {
        // Otherwise, figure out where to place this child. We'll start by
        // setting its `left`/`x` coordinate to right after the previous
        // rendered element. This child will end up directly to the right of it.
        const lastPos = (last as any).lpos as Coords;
        el.position.left = lastPos.xl - xi;

        // Make sure the position matches the highest width element
        if (self.layout === 'grid') {
          // Compensate with position:
          el.position.left += highWidth - (lastPos.xl - lastPos.xi);
        }

        // If our child does not overlap the right side of the Layout, set its
        // `top`/`y` to the current `rowOffset` (the coordinate for the current
        // row).
        if ((el.position.left as number) + (el.width as number) <= width) {
          el.position.top = rowOffset;
        } else {
          // Otherwise we need to start a new row and calculate a new
          // `rowOffset` and `rowIndex` (the index of the child on the current
          // row).
          rowOffset += self.children.slice(rowIndex, i).reduce((out, child) => {
            const element = child as Element;
            if (!self.isRendered(element)) return out;
            const elPos = (element as any).lpos as Coords;
            out = Math.max(out, elPos.yl - elPos.yi);
            return out;
          }, 0);
          lastRowIndex = rowIndex;
          rowIndex = i;
          el.position.left = 0;
          el.position.top = rowOffset;
        }
      }

      // Make sure the elements on lower rows gravitate up as much as possible
      if (self.layout === 'inline') {
        let above: Element | null = null;
        let abovea = Infinity;
        for (let j = lastRowIndex; j < rowIndex; j++) {
          const l = self.children[j] as Element;
          if (!self.isRendered(l)) continue;
          const lPos = (l as any).lpos as Coords;
          const abs = Math.abs((el.position.left as number) - (lPos.xi - xi));
          if (abs < abovea) {
            above = l;
            abovea = abs;
          }
        }
        if (above) {
          const abovePos = (above as any).lpos as Coords;
          el.position.top = abovePos.yl - yi;
        }
      }

      // If our child overflows the Layout, do not render it!
      // Disable this feature for now.
      if ((el.position.top as number) + (el.height as number) > height) {
        // Returning false tells blessed to ignore this child.
        // return false;
      }
    };
  }

  /**
   * Render the layout and its children
   */
  render(): { width: number; height: number } {
    this.emit('prerender');

    const coords = this._renderCoords();
    if (!coords) {
      delete this.lpos;
      return { width: 0, height: 0 };
    }

    if (coords.xl - coords.xi <= 0) {
      coords.xl = Math.max(coords.xl, coords.xi);
      return { width: 0, height: 0 };
    }

    if (coords.yl - coords.yi <= 0) {
      coords.yl = Math.max(coords.yl, coords.yi);
      return { width: 0, height: 0 };
    }

    this.lpos = coords;

    if (this.border) coords.xi++, coords.xl--, coords.yi++, coords.yl--;
    if (this.padding) {
      coords.xi += this.padding.left;
      coords.xl -= this.padding.right;
      coords.yi += this.padding.top;
      coords.yl -= this.padding.bottom;
    }

    const iterator = this.renderer(coords);

    if (this.border) coords.xi--, coords.xl++, coords.yi--, coords.yl++;
    if (this.padding) {
      coords.xi -= this.padding.left;
      coords.xl += this.padding.right;
      coords.yi -= this.padding.top;
      coords.yl += this.padding.bottom;
    }

    this.children.forEach((child, i) => {
      const el = child as Element;
      if ((el.screen as any)._ci !== -1) {
        (el as any).index = (el.screen as any)._ci++;
      }
      const rendered = iterator(el, i);
      if (rendered === false) {
        delete (el as any).lpos;
        return;
      }
      el.render();
    });

    this.emit('render', coords);

    return {
      width: coords.xl - coords.xi,
      height: coords.yl - coords.yi
    };
  }
}