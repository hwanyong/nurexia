/**
 * log.ts - log element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import * as util from 'util';
import { ScrollableText, ScrollableTextOptions } from './scrollabletext';
import { NodeType } from '../types';

// Use setImmediate if available, otherwise use nextTick
const nextTick = global.setImmediate || process.nextTick.bind(process);

/**
 * Log options interface
 */
export interface LogOptions extends ScrollableTextOptions {
  scrollback?: number;
  scrollOnInput?: boolean;
}

/**
 * Log Class - Scrollable log output widget
 */
export class Log extends ScrollableText {
  /**
   * Log specific properties
   */
  type: NodeType = 'log';
  scrollback: number;
  scrollOnInput: boolean;
  private _userScrolled: boolean = false;

  // Store our own lines for tracking
  private _fakeLines: string[] = [];

  /**
   * Log constructor
   */
  constructor(options: LogOptions = {}) {
    super(options);

    this.scrollback = options.scrollback !== undefined
      ? options.scrollback
      : Infinity;
    this.scrollOnInput = !!options.scrollOnInput;

    this.on('set content', () => {
      if (!this._userScrolled || this.scrollOnInput) {
        nextTick(() => {
          this.setScrollPerc(100);
          this._userScrolled = false;
          this.screen.render();
        });
      }
    });
  }

  /**
   * Add a log line
   */
  log(...args: any[]): this {
    return this.add(...args);
  }

  /**
   * Add content to the log
   */
  add(...args: any[]): this {
    if (typeof args[0] === 'object') {
      args[0] = util.inspect(args[0], { depth: 20, colors: true });
    }
    const text = util.format(...args);
    this.emit('log', text);

    const ret = this.pushLine(text);

    if (this._fakeLines.length > this.scrollback) {
      this.shiftLine(0, Math.floor(this.scrollback / 3) || 1);
    }

    return ret;
  }

  /**
   * Push a line to the log
   */
  pushLine(line: string): this {
    const lines = line.split('\n');

    for (const l of lines) {
      this._fakeLines.push(l);
    }

    this.setContent(this._fakeLines.join('\n'));
    return this;
  }

  /**
   * Shift a line off the top of the log
   */
  shiftLine(n: number, amount: number = 1): string[] {
    if (n < 0) {
      n = this._fakeLines.length + n;
    }

    if (n < 0) {
      n = 0;
    }

    const removed = this._fakeLines.splice(n, amount);
    this.setContent(this._fakeLines.join('\n'));
    return removed;
  }

  /**
   * Override scroll method to track user scrolling
   */
  scroll(offset: number, always?: boolean): this {
    if (offset === 0) return super.scroll(offset, always);

    this._userScrolled = true;
    const ret = super.scroll(offset, always);

    if (this.getScrollPerc() === 100) {
      this._userScrolled = false;
    }

    return ret;
  }
}