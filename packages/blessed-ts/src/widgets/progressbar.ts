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
}

// Interface for position
interface ScreenPosition {
  xi: number;
  xl: number;
  yi: number;
  yl: number;
}

// Interface for screen
interface Screen {
  render(): void;
  fillRegion(attr: number, ch: string, xi: number, xl: number, yi: number, yl: number): void;
  lines: any[];
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
  screen: Screen;
  iwidth: number;
  iheight: number;
  content: string;
  lpos?: ScreenPosition;

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
            this.screen.render();
          }
          return;
        }

        if (key.name === forward[0] || (options.vi && key.name === forward[1])) {
          this.progress(5);
          if (this.screen) {
            this.screen.render();
          }
          return;
        }
      });
    }

    // Handle mouse interaction
    if (options.mouse) {
      this.on('click', (data: { x: number, y: number }) => {
        if (!this.lpos) return;

        let p: number;

        if (this.orientation === 'horizontal') {
          const x = data.x - this.lpos.xi;
          const m = (this.lpos.xl - this.lpos.xi) - this.iwidth;
          p = Math.floor(x / m * 100);
        } else {
          const y = data.y - this.lpos.yi;
          const m = (this.lpos.yl - this.lpos.yi) - this.iheight;
          p = Math.floor(y / m * 100);
        }

        this.setProgress(p);
      });
    }
  }

  /**
   * Custom render method for progress bar
   */
  render(): Position | undefined {
    const ret = this._render();
    if (!ret) return;

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

    const dattr = this.sattr(this.style.bar);

    this.screen.fillRegion(dattr, this.pch, xi, xl, yi, yl);

    if (this.content) {
      const line = this.screen.lines[yi];
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