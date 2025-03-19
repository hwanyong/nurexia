/**
 * bigtext.ts - bigtext element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { Box, BoxOptions } from './box';
import { Node } from './node';
import { NodeType } from '../types';

/**
 * Font glyph interface
 */
interface FontGlyph {
  map: string[];
}

/**
 * Font data interface
 */
interface FontData {
  width: number;
  height: number;
  glyphs: { [key: string]: FontGlyph };
}

/**
 * Font interface
 */
interface Font {
  [key: string]: number[][];
}

/**
 * BigText Options Interface
 */
export interface BigTextOptions extends BoxOptions {
  font?: string;
  fontBold?: string;
  fch?: string;
}

/**
 * Coordinates returned by Element's _render method
 */
interface RenderCoords {
  xi: number;
  xl: number;
  yi: number;
  yl: number;
}

/**
 * BigText Class
 * Renders large characters using terminal characters
 */
export class BigText extends Box {
  /**
   * BigText properties
   */
  type: NodeType = 'big-text';
  fch?: string;
  ratio: { width: number; height: number } = { width: 0, height: 0 };
  font: Font = {};
  fontBold: Font = {};
  text: string = '';
  content: string = '';

  // Element properties that we need to access
  ileft = 0;
  itop = 0;
  iright = 0;
  ibottom = 0;

  // Private properties
  private _shrinkWidth?: boolean;
  private _shrinkHeight?: boolean;

  /**
   * BigText constructor
   */
  constructor(options: BigTextOptions = {}) {
    super(options);

    if (!(this instanceof Node)) {
      return new BigText(options);
    }

    // Set default font paths if not provided
    options.font = options.font || join(__dirname, '../../usr/fonts/ter-u14n.json');
    options.fontBold = options.fontBold || join(__dirname, '../../usr/fonts/ter-u14b.json');

    this.fch = options.fch;
    this.font = this.loadFont(options.font);
    this.fontBold = this.loadFont(options.fontBold);

    if (this.style?.bold) {
      this.font = this.fontBold;
    }
  }

  /**
   * Load a font file
   */
  loadFont(filename: string): Font {
    const data = JSON.parse(readFileSync(filename, 'utf8')) as FontData;

    this.ratio.width = data.width;
    this.ratio.height = data.height;

    const convertLetter = (_ch: string, lines: string[]): number[][] => {
      // Trim excess lines
      while (lines.length > this.ratio.height) {
        lines.shift();
        lines.pop();
      }

      // Convert string lines to numerical data (0 or 1)
      const result = lines.map((line) => {
        const chars = line.split('');
        // Explicitly type as 0 | 1 to match the expected type
        return chars.map((ch): 0 | 1 => ch === ' ' ? 0 : 1);
      });

      // Pad to width
      for (let i = 0; i < result.length; i++) {
        while (result[i].length < this.ratio.width) {
          result[i].push(0);
        }
      }

      // Pad to height
      while (result.length < this.ratio.height) {
        const line: (0 | 1)[] = [];
        for (let i = 0; i < this.ratio.width; i++) {
          line.push(0);
        }
        result.push(line);
      }

      return result;
    };

    // Convert all glyphs to our format
    const font = Object.keys(data.glyphs).reduce((out: Font, ch) => {
      const lines = data.glyphs[ch].map;
      out[ch] = convertLetter(ch, lines);
      return out;
    }, {});

    // Remove space character (will be handled differently)
    delete font[' '];

    return font;
  }

  /**
   * Set content for the BigText
   */
  setContent(content: string): this {
    this.content = '';
    this.text = content || '';
    return this;
  }

  /**
   * Calculate element style attribute
   */
  sattr(style: any): number {
    // Using any here since this is a complex calculation inherited from Element
    return (this as any)._sattr ? (this as any)._sattr(style) : 0;
  }

  /**
   * Internal render method to calculate coordinates
   */
  _render(): RenderCoords | undefined {
    // Call parent's _render method if it exists
    return (Box.prototype as any)._render.call(this);
  }

  /**
   * Render the BigText
   */
  render(): { width: number; height: number } {
    // Auto-size width if not explicitly set
    if ((this.position as any).width == null || this._shrinkWidth) {
      (this.position as any).width = this.ratio.width * this.text.length + 1;
      this._shrinkWidth = true;
    }

    // Auto-size height if not explicitly set
    if ((this.position as any).height == null || this._shrinkHeight) {
      (this.position as any).height = this.ratio.height;
      this._shrinkHeight = true;
    }

    // Get render coordinates
    const coords = this._render();
    if (!coords) return { width: 0, height: 0 };

    // Get screen lines (with type assertion)
    const screenAny = this.screen as any;
    const lines = screenAny?.lines;
    if (!lines) return { width: 0, height: 0 };

    const left = coords.xi + this.ileft;
    const top = coords.yi + this.itop;
    const right = coords.xl - this.iright;
    const bottom = coords.yl - this.ibottom;

    // Calculate default attribute
    const dattr = this.sattr(this.style);
    const bg = dattr & 0x1ff;
    const fg = (dattr >> 9) & 0x1ff;
    const flags = (dattr >> 18) & 0x1ff;
    const attr = (flags << 18) | (bg << 9) | fg;

    // Render each character
    for (let x = left, i = 0; x < right; x += this.ratio.width, i++) {
      const ch = this.text[i];
      if (!ch) break;

      const map = this.font[ch];
      if (!map) continue;

      for (let y = top; y < Math.min(bottom, top + this.ratio.height); y++) {
        if (!lines[y]) continue;

        const mline = map[y - top];
        if (!mline) continue;

        for (let mx = 0; mx < this.ratio.width; mx++) {
          const mcell = mline[mx];
          if (mcell == null) break;

          if (this.fch && this.fch !== ' ') {
            lines[y][x + mx][0] = dattr;
            lines[y][x + mx][1] = mcell === 1 ? this.fch : this.ch;
          } else {
            lines[y][x + mx][0] = mcell === 1 ? attr : dattr;
            lines[y][x + mx][1] = mcell === 1 ? ' ' : this.ch;
          }
        }

        lines[y].dirty = true;
      }
    }

    return {
      width: (this.position as any).width || 0,
      height: (this.position as any).height || 0
    };
  }
}