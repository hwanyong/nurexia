/**
 * table.ts - table element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { Box, BoxOptions } from './box';
import { NodeType, Position } from '../types';

/**
 * Table options interface
 */
export interface TableOptions extends BoxOptions {
  rows?: string[][];
  data?: string[][];
  pad?: number;
  noCellBorders?: boolean;
  fillCellBorders?: boolean;
  align?: 'left' | 'center' | 'right';
}

/**
 * Table Class - Data table display element
 */
export class Table extends Box {
  /**
   * Table specific properties
   */
  type: NodeType = 'table';
  rows: string[][] = [];
  pad: number;
  align: 'left' | 'center' | 'right';
  _maxes: number[] = [];
  detached?: boolean;

  /**
   * Table constructor
   */
  constructor(options: TableOptions = {}) {
    // Set default options
    options.shrink = options.shrink !== false;

    // Tables don't use custom height by default (would require extra padding)
    delete options.height;

    // Initialize style objects to prevent errors
    options.style = options.style || {};
    options.style.border = options.style.border || {};
    options.style.header = options.style.header || {};
    options.style.cell = options.style.cell || {};

    // Default align is center
    options.align = options.align || 'center';

    // Call parent constructor
    super(options);

    // Set table specific properties
    this.pad = options.pad != null ? options.pad : 2;
    this.align = options.align;

    // Set initial data
    this.setTableData(options.rows || options.data || []);

    // Handle events
    this.on('attach', () => {
      this.setContent('');
      this.setTableData(this.rows);
    });

    this.on('resize', () => {
      this.setContent('');
      this.setTableData(this.rows);
      if (this.screen) {
        (this.screen as any).render();
      }
    });
  }

  /**
   * Calculate maximum width for each column
   */
  _calculateMaxes(): number[] | undefined {
    const maxes: number[] = [];

    if (this.detached) return undefined;

    // Calculate maximum width for each column
    this.rows.forEach((row) => {
      row.forEach((cell, i) => {
        const clen = this.strWidth(cell);
        if (!maxes[i] || maxes[i] < clen) {
          maxes[i] = clen;
        }
      });
    });

    // Calculate total width
    let total = maxes.reduce((total, max) => total + max, 0);
    total += maxes.length + 1;

    // Handle width constraints
    const currentWidth = typeof this.width === 'number' ? this.width : 0;
    if (currentWidth && currentWidth < total) {
      this.width = undefined; // Clear the width
    }

    if (this.width !== undefined) {
      const missing = currentWidth - total;
      const w = Math.floor(missing / maxes.length);
      const wr = missing % maxes.length;

      // Distribute extra width among columns
      for (let i = 0; i < maxes.length; i++) {
        if (i === maxes.length - 1) {
          maxes[i] = maxes[i] + w + wr;
        } else {
          maxes[i] = maxes[i] + w;
        }
      }
    } else {
      // Add padding to each column
      for (let i = 0; i < maxes.length; i++) {
        maxes[i] = maxes[i] + this.pad;
      }
    }

    return this._maxes = maxes;
  }

  /**
   * Set table rows/data
   */
  setRows(rows?: string[][]): void {
    this.setTableData(rows);
  }

  /**
   * Override setData to avoid conflicts with Node.setData
   */
  override setData(key: string, value: any): void {
    if (typeof key === 'object' && Array.isArray(key)) {
      // Handle case where setData is called with rows data
      this.setTableData(key as string[][]);
    } else {
      // Call parent method for normal data setting
      super.setData(key, value);
    }
  }

  /**
   * Set table data
   */
  setTableData(rows?: string[][]): void {
    let text = '';
    const align = this.align;

    this.rows = rows || [];

    this._calculateMaxes();

    if (!this._maxes) return;

    // Generate text content for the table
    this.rows.forEach((row, i) => {
      const isFooter = i === this.rows.length - 1;

      row.forEach((cell, i) => {
        const width = this._maxes[i];
        let clen = this.strWidth(cell);

        if (i !== 0) {
          text += ' ';
        }

        // Pad cell content to match column width
        while (clen < width) {
          if (align === 'center') {
            cell = ' ' + cell + ' ';
            clen += 2;
          } else if (align === 'left') {
            cell = cell + ' ';
            clen += 1;
          } else if (align === 'right') {
            cell = ' ' + cell;
            clen += 1;
          }
        }

        // Trim if cell content exceeds column width
        if (clen > width) {
          if (align === 'center') {
            cell = cell.substring(1);
            clen--;
          } else if (align === 'left') {
            cell = cell.slice(0, -1);
            clen--;
          } else if (align === 'right') {
            cell = cell.substring(1);
            clen--;
          }
        }

        text += cell;
      });

      if (!isFooter) {
        text += '\n\n';
      }
    });

    // Save align value, set content, restore align value
    const tempAlign = this.align;
    delete (this as any).align;
    this.setContent(text);
    this.align = tempAlign;
  }

  /**
   * Render the table
   * Note: The full border drawing and cell rendering will be implemented
   * when the rendering engine is ready
   */
  render(): any {
    // Call parent render method
    return super.render();
  }

  /**
   * Helper method to calculate string display width
   * This is a placeholder until the actual method is implemented
   */
  strWidth(str: string): number {
    return str.length;
  }
}