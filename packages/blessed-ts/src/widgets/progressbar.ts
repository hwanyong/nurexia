/**
 * progressbar.ts - progress bar element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { Box, BoxOptions } from './box';
import { NodeType, Position } from '../types';

/**
 * ProgressBar options interface
 */
export interface ProgressBarOptions extends BoxOptions {
  /**
   * Initial progress value (0-100)
   */
  filled?: number | string;

  /**
   * Character to use for the progress part
   */
  pch?: string;

  /**
   * Character to use for the background part (legacy)
   */
  bch?: string;

  /**
   * Character to use for the progress part (legacy)
   */
  ch?: string;

  /**
   * Foreground color for the bar
   */
  barFg?: string;

  /**
   * Background color for the bar
   */
  barBg?: string;

  /**
   * Bar orientation: 'horizontal' or 'vertical'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Enable keyboard navigation
   */
  keys?: boolean;

  /**
   * Enable vi-style key bindings
   */
  vi?: boolean;

  /**
   * Enable mouse interaction
   */
  mouse?: boolean;
}

// Interface for key events
interface KeyEvent {
  name: string;
  ctrl?: boolean;
  shift?: boolean;
}

// Interface for position
interface Coords {
  xi: number;
  xl: number;
  yi: number;
  yl: number;
  [key: string]: any;
}

/**
 * ProgressBar Class - Visual progress indicator
 */
export class ProgressBar extends Box {
  /**
   * ProgressBar specific properties
   */
  type: NodeType = 'progress-bar';
  filled: number = 0;
  value: number = 0;
  pch: string;
  orientation: 'horizontal' | 'vertical';
  content: string;

  // Use declared properties instead of redefining
  declare iwidth: number;
  declare iheight: number;

  /**
   * ProgressBar constructor
   */
  constructor(options: ProgressBarOptions = {}) {
    // Call parent constructor
    super(options);

    // Initialize filled value
    let initialFilled = 0;
    if (options.filled !== undefined) {
      if (typeof options.filled === 'string') {
        initialFilled = +options.filled.slice(0, -1);
      } else {
        initialFilled = options.filled;
      }
    }
    this.filled = initialFilled;
    this.value = this.filled;

    // Set progress character
    this.pch = options.pch || ' ';

    // Handle legacy character options
    if (options.ch) {
      this.pch = options.ch;
      this.ch = ' ';
    }
    if (options.bch) {
      this.ch = options.bch;
    }

    // Initialize style if needed
    if (!this.style.bar) {
      this.style.bar = {};
      this.style.bar.fg = options.barFg;
      this.style.bar.bg = options.barBg;
    }

    // Set orientation
    this.orientation = options.orientation || 'horizontal';

    // Handle keyboard navigation
    if (options.keys) {
      this.on('keypress', (ch: string, key: KeyEvent) => {
        let back: string[], forward: string[];

        if (this.orientation === 'horizontal') {
          back = ['left', 'h'];
          forward = ['right', 'l'];
        } else {
          back = ['down', 'j'];
          forward = ['up', 'k'];
        }

        if (key.name === back[0] || (options.vi && key.name === back[1])) {
          this.progress(-5);
          if (this.screen) {
            (this.screen as any).render();
          }
          return;
        }

        if (key.name === forward[0] || (options.vi && key.name === forward[1])) {
          this.progress(5);
          if (this.screen) {
            (this.screen as any).render();
          }
          return;
        }
      });
    }

    // Handle mouse interaction
    if (options.mouse) {
      this.on('click', (data: { x: number, y: number }) => {
        if (!(this as any).lpos) return;

        const lpos = (this as any).lpos as Coords;
        let p: number;

        if (this.orientation === 'horizontal') {
          const x = data.x - lpos.xi;
          const m = (lpos.xl - lpos.xi) - this.iwidth;
          p = Math.floor(x / m * 100);
        } else {
          const y = data.y - lpos.yi;
          const m = (lpos.yl - lpos.yi) - this.iheight;
          p = Math.floor(y / m * 100);
        }

        this.setProgress(p);
      });
    }
  }

  /**
   * Custom render method for progress bar
   */
  render(): any {
    // Call base render method
    const ret = (this as any)._render() as Coords;
    if (!ret) return ret;

    let xi = ret.xi;
    let xl = ret.xl;
    let yi = ret.yi;
    let yl = ret.yl;

    if (this.border) {
      xi++;
      yi++;
      xl--;
      yl--;
    }

    if (this.orientation === 'horizontal') {
      xl = xi + Math.floor((xl - xi) * (this.filled / 100));
    } else if (this.orientation === 'vertical') {
      yi = yi + Math.floor((yl - yi) - (((yl - yi) * (this.filled / 100))));
    }

    const dattr = (this as any).sattr(this.style.bar);

    (this.screen as any).fillRegion(dattr, this.pch, xi, xl, yi, yl);

    if (this.content) {
      const lines = (this.screen as any).lines;
      const line = lines[yi];
      if (line) {
        for (let i = 0; i < this.content.length; i++) {
          if (line[xi + i]) {
            line[xi + i][1] = this.content[i];
          }
        }
        line.dirty = true;
      }
    }

    return ret;
  }

  /**
   * Update progress value
   */
  progress(filled: number): void {
    this.filled += filled;

    if (this.filled < 0) {
      this.filled = 0;
    } else if (this.filled > 100) {
      this.filled = 100;
    }

    if (this.filled === 100) {
      this.emit('complete');
    }

    this.value = this.filled;
  }

  /**
   * Set progress to a specific value
   */
  setProgress(filled: number): void {
    this.filled = 0;
    this.progress(filled);
  }

  /**
   * Reset progress to zero
   */
  reset(): void {
    this.emit('reset');
    this.filled = 0;
    this.value = this.filled;
  }
}