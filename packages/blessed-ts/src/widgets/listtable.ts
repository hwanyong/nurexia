/**
 * listtable.ts - list table element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { Box, BoxOptions } from './box';
import { List } from './list';
import { NodeType, Position, Border } from '../types';

/**
 * ListTable options interface
 */
export interface ListTableOptions extends BoxOptions {
  rows?: string[][];
  data?: string[][];
  pad?: number;
  noCellBorders?: boolean;
  fillCellBorders?: boolean;
  align?: 'left' | 'center' | 'right';
  tags?: boolean;
  parseTags?: boolean;
  normalShrink?: boolean;
  border?: boolean | Border;
}

// Used for coords return type from render
interface Coords {
  xi: number;
  xl: number;
  yi: number;
  yl: number;
  [key: string]: any;
}

/**
 * ListTable Class - Combines List with Table functionalities
 */
export class ListTable extends List {
  /**
   * ListTable specific properties
   */
  type: NodeType = 'list-table';
  rows: string[][] = [];
  pad: number;
  _maxes: number[] = [];
  _header: Box;
  __align: 'left' | 'center' | 'right';
  options: ListTableOptions;

  /**
   * Extends the Box prototype
   */
  constructor(options: ListTableOptions = {}) {
    // Set default options
    options.normalShrink = true;
    options.style = options.style || {};
    options.style.border = options.style.border || {};
    options.style.header = options.style.header || {};
    options.style.cell = options.style.cell || {};

    // Store align before deleting (List doesn't use it)
    const align = options.align || 'center';
    delete options.align;

    // Set appropriate styles for list selection
    if (options.style.cell && options.style.selected) {
      options.style.selected = options.style.selected;
    }
    options.style.item = options.style.cell;

    // Handle border specially
    const border = options.border;
    if (border && typeof border !== 'boolean') {
      if (border.top === false &&
          border.bottom === false &&
          border.left === false &&
          border.right === false) {
        delete options.border;
      }
    }

    // Call parent constructor
    super(options);

    // Restore border option
    options.border = border;

    // Store align as instance property
    this.__align = align;

    // Store options for later use
    this.options = options;

    // Create header box
    this._header = new Box({
      parent: this,
      left: this.screen.autoPadding ? 0 : (this as any).ileft || 0,
      top: 0,
      width: 'shrink',
      height: 1,
      style: options.style.header,
      tags: options.parseTags || options.tags
    });

    // Handle scroll events to keep header visible
    this.on('scroll', () => {
      (this._header as any).setFront();
      (this._header as any).rtop = this.childBase;
      if (!this.screen.autoPadding) {
        (this._header as any).rtop = this.childBase + (this.border ? 1 : 0);
      }
    });

    // Set padding
    this.pad = options.pad != null ? options.pad : 2;

    // Set initial data
    this.setData(options.rows || options.data);

    // Reset data on attach
    this.on('attach', () => {
      this.setData(this.rows);
    });

    // Handle resize events
    this.on('resize', () => {
      const selected = this.selected;
      this.setData(this.rows);
      this.select(selected);
      this.screen.render();
    });
  }

  /**
   * Calculate maximum width for each column
   */
  _calculateMaxes(): number[] | undefined {
    const maxes: number[] = [];

    if (!this.rows.length) {
      return undefined;
    }

    // Find max width for each column
    for (let i = 0; i < this.rows.length; i++) {
      const row = this.rows[i];
      for (let j = 0; j < row.length; j++) {
        const cell = row[j];
        const width = (this as any).strWidth(cell);
        if (maxes[j] == null || width > maxes[j]) {
          maxes[j] = width;
        }
      }
    }

    // Add padding
    const width = (maxes.length * this.pad) + maxes.reduce((total, max) => total + max, 0);

    // Handle width calculation based on available space
    const _width = (this as any).width;
    const position = (this as any).position || {};

    if (position.width != null && _width > 0 && width > _width) {
      const missing = width - _width;
      const perColumn = Math.ceil(missing / maxes.length);
      for (let i = 0; i < maxes.length; i++) {
        maxes[i] -= perColumn;
        if (maxes[i] < 1) maxes[i] = 1;
      }
    }

    // Calculate actual position
    if (position.width == null) {
      const ileft = (this as any).ileft || 0;
      const iright = (this as any).iright || 0;

      position.width = width;
      if (this.screen.autoPadding) {
        position.width -= (ileft + iright);
      }
    }

    this._maxes = maxes;
    return maxes;
  }

  /**
   * Set table data
   */
  setRows = this.setData;
  setData(data?: string[][] | string | { [key: string]: any }, startIndex?: number): void {
    // Handle different data formats
    let rows: string[][] = [];

    if (Array.isArray(data)) {
      rows = data as string[][];
    } else if (typeof data === 'string') {
      // Handle string data case if needed
      super.setData(data, startIndex);
      return;
    } else if (data && typeof data === 'object') {
      // Handle object data case if needed
      super.setData(data as unknown as string, startIndex);
      return;
    }

    const selected = this.selected;
    const original = this.items.slice();
    const sel = this.ritems[this.selected];

    if ((this as any).visible && (this as any).lpos) {
      (this as any).clearPos();
    }

    (this as any).clearItems();
    this.rows = rows || [];
    this._calculateMaxes();

    if (!this._maxes) return;

    (this as any).addItem('');

    // Process rows
    this.rows.forEach((row, i) => {
      const isHeader = i === 0;
      let text = '';
      row.forEach((cell, j) => {
        const width = this._maxes[j];
        let clen = (this as any).strWidth(cell);

        if (j !== 0) {
          text += ' ';
        }

        // Pad cell to match column width
        while (clen < width) {
          if (this.__align === 'center') {
            cell = ' ' + cell + ' ';
            clen += 2;
          } else if (this.__align === 'left') {
            cell = cell + ' ';
            clen += 1;
          } else if (this.__align === 'right') {
            cell = ' ' + cell;
            clen += 1;
          }
        }

        // Trim if we went too far
        if (clen > width) {
          if (this.__align === 'center') {
            cell = cell.substring(1);
            clen--;
          } else if (this.__align === 'left') {
            cell = cell.slice(0, -1);
            clen--;
          } else if (this.__align === 'right') {
            cell = cell.substring(1);
            clen--;
          }
        }

        text += cell;
      });

      // Add content to header or as list item
      if (isHeader) {
        this._header.setContent(text);
      } else {
        (this as any).addItem(text);
      }
    });

    (this._header as any).setFront();

    // Try to find our old item if it still exists.
    const selIndex = this.ritems.indexOf(sel);
    if (selIndex !== -1) {
      this.select(selIndex);
    } else if (this.items.length === original.length) {
      this.select(selected);
    } else {
      this.select(Math.min(selected, this.items.length - 1));
    }
  }

  /**
   * Override select method to skip header
   */
  select(i: number): void {
    if (i === 0) {
      i = 1;
    }
    if (i <= this.childBase) {
      this.setScroll(this.childBase - 1);
    }
    return super.select(i);
  }

  /**
   * Override render method to handle borders
   */
  render(): any {
    // Call parent render method
    const coords = super.render() as unknown as Coords;
    if (!coords) return coords;

    this._calculateMaxes();
    if (!this._maxes) return coords;

    const lines = this.screen.lines;
    const xi = coords.xi;
    const yi = coords.yi;

    const battr = (this as any).sattr(this.style.border);
    const height = coords.yl - coords.yi - ((this as any).ibottom || 0);

    const border = this.border || this.options.border;
    if (!border || this.options.noCellBorders) return coords;

    // Draw border with correct angles
    for (let ry = 0; ry < height + 1; ry++) {
      if (!lines[yi + ry]) break;

      let rx = 0;
      this._maxes.slice(0, -1).forEach((max) => {
        rx += max;
        if (!lines[yi + ry] || !lines[yi + ry][xi + rx + 1]) return;

        // Top borders
        if (ry === 0) {
          rx++;
          lines[yi + ry][xi + rx][0] = battr;
          lines[yi + ry][xi + rx][1] = '\u252c'; // '┬'

          if (border !== true && typeof border !== 'boolean' &&
              (border as Border).top === false) {
            lines[yi + ry][xi + rx][1] = '\u2502'; // '│'
          }

          lines[yi + ry].dirty = true;
        }
        // Bottom borders
        else if (ry === height) {
          rx++;
          lines[yi + ry][xi + rx][0] = battr;
          lines[yi + ry][xi + rx][1] = '\u2534'; // '┴'

          if (border !== true && typeof border !== 'boolean' &&
              (border as Border).bottom === false) {
            lines[yi + ry][xi + rx][1] = '\u2502'; // '│'
          }

          lines[yi + ry].dirty = true;
        }
        // Middle borders
        else {
          rx++;
        }
      });
    }

    // Draw internal borders
    for (let ry = 1; ry < height; ry++) {
      if (!lines[yi + ry]) break;

      let rx = 0;
      this._maxes.slice(0, -1).forEach((max) => {
        rx += max;
        if (!lines[yi + ry] || !lines[yi + ry][xi + rx + 1]) return;

        if (this.options.fillCellBorders !== false) {
          const lbg = lines[yi + ry][xi + rx][0] & 0x1ff;
          rx++;
          lines[yi + ry][xi + rx][0] = (battr & ~0x1ff) | lbg;
        } else {
          rx++;
          lines[yi + ry][xi + rx][0] = battr;
        }

        lines[yi + ry][xi + rx][1] = '\u2502'; // '│'
        lines[yi + ry].dirty = true;
      });
    }

    return coords;
  }
}