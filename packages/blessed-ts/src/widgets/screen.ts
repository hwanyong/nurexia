/**
 * screen.ts - screen node for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import * as path from 'path';
import * as fs from 'fs';
import * as cp from 'child_process';

import { Node, NodeOptions } from './node';
import { Element, ElementOptions } from './element';
import { Program, ProgramOptions } from '../program/program';
import { Tput } from '../program/tput';
import { NodeType, Style } from '../types';

/**
 * Extended ProgramOptions with screen-specific additions
 */
export interface ScreenProgramOptions extends ProgramOptions {
  resizeTimeout?: number;
  forceUnicode?: boolean;
}

/**
 * Screen options interface
 */
export interface ScreenOptions extends Omit<ElementOptions, 'input'> {
  program?: Program;
  input?: NodeJS.ReadableStream;
  output?: NodeJS.WritableStream;
  log?: string;
  debug?: boolean;
  dump?: boolean;
  terminal?: string;
  term?: string;
  resizeTimeout?: number;
  forceUnicode?: boolean;
  tabSize?: number;
  autoPadding?: boolean;
  ignoreLocked?: string[];
  fullUnicode?: boolean;
  smartCSR?: boolean;
  fastCSR?: boolean;
  useBCE?: boolean;
  cursor?: {
    artificial: boolean;
    shape: string;
    blink: boolean;
    color: string;
  };
}

/**
 * Screen Class - Base screen element that manages rendering and program state
 */
export class Screen extends Node {
  /**
   * Screen properties
   */
  type: NodeType = 'screen';
  program: Program;
  tput: Tput;
  _unicode: boolean;
  fullUnicode: boolean;
  autoPadding: boolean;
  tabc: string;
  dockBorders: boolean;
  ignoreLocked: string[];
  dattr: number;
  renders: number;

  ileft: number;
  itop: number;
  iright: number;
  ibottom: number;

  private _listenedEmitters: Node[] = [];

  // Cursor properties
  cursor: {
    artificial: boolean;
    shape: string;
    blink: boolean;
    color: string;
    _state: boolean;
    _hidden: boolean;
  };

  // CSR (Change Scroll Region) optimization flags
  smartCSR: boolean;
  fastCSR: boolean;
  useBCE: boolean;

  // Focused element
  focused: Element | null = null;

  /**
   * Screen constructor
   */
  constructor(options: ScreenOptions = {}) {
    super(options);

    // Initialize program if not provided
    this.program = options.program || new Program({
      input: options.input,
      output: options.output,
      log: options.log,
      debug: options.debug,
      dump: options.dump,
      terminal: options.terminal || options.term,
      tput: true,
      buffer: true,
      zero: true
    });

    // Setup tput
    if (typeof this.program.setupTput === 'function') {
      this.program.setupTput();
    }

    this.program.useBuffer = true;
    this.program.zero = true;

    // Add extended properties to Program
    (this.program as any).options = (this.program as any).options || {};
    if (options.resizeTimeout !== undefined) {
      (this.program as any).options.resizeTimeout = options.resizeTimeout;
    }

    // Initialize tput
    this.tput = (this.program as any).tput;
    if (options.forceUnicode !== undefined && this.tput) {
      (this.tput as any).features = (this.tput as any).features || {};
      (this.tput as any).features.unicode = options.forceUnicode;
      (this.tput as any).unicode = options.forceUnicode;
    }

    // Set screen options
    this.autoPadding = options.autoPadding !== false;
    this.tabc = Array((options.tabSize || 4) + 1).join(' ');
    this.dockBorders = options.dockBorders || false;
    this.ignoreLocked = options.ignoreLocked || [];

    // Unicode support
    this._unicode = this.tput ?
      ((this.tput as any).unicode || ((this.tput as any).numbers && (this.tput as any).numbers.U8 === 1)) :
      false;
    this.fullUnicode = !!(options.fullUnicode && this._unicode);

    // Default display attribute (white on black)
    this.dattr = ((0 << 18) | (0x1ff << 9)) | 0x1ff;

    // Rendering state
    this.renders = 0;

    // Smart CSR (change scroll region) optimization
    this.smartCSR = options.smartCSR !== false;
    this.fastCSR = !!options.fastCSR;
    this.useBCE = !!options.useBCE;

    // Cursor state
    this.cursor = {
      artificial: options.cursor?.artificial || false,
      shape: options.cursor?.shape || 'block',
      blink: options.cursor?.blink || false,
      color: options.cursor?.color || '',
      _state: false,
      _hidden: true
    };

    // Inner position values
    this.ileft = 0;
    this.itop = 0;
    this.iright = 0;
    this.ibottom = 0;

    // Set this screen as its own screen
    this.screen = this as any;

    // Set up event handlers
    this._setupEvents();
  }

  /**
   * Setup program event handlers
   */
  private _setupEvents(): void {
    // Mouse events
    this.program.on('mouse', (data) => {
      this.emit('mouse', data);
    });

    // Key events
    this.program.on('keypress', (ch, key) => {
      this.emit('keypress', ch, key);

      // Handle focus
      if (this.focused) {
        this.focused.emit('keypress', ch, key);
      }
    });

    // Resize events
    this.program.on('resize', () => {
      this.emit('resize');
      this.render();
    });
  }

  /**
   * Render the screen
   */
  render(): this {
    // Increment render count
    this.renders++;

    // Clear the screen buffer
    this.program.clear();

    // Render all child elements
    this.children.forEach((child) => {
      if (child instanceof Element && !child.hidden) {
        // TODO: Implement actual rendering logic
      }
    });

    // Write screen buffer to output
    this.program.flush();

    return this;
  }

  /**
   * Focus a specific element
   */
  focusElement(el: Element): this {
    if (this.focused === el) return this;

    // Blur previously focused element
    if (this.focused) {
      this.focused.emit('blur');
    }

    // Focus new element
    this.focused = el;
    this.focused.emit('focus');

    return this;
  }

  /**
   * Clear the screen and render
   */
  clearScreen(): this {
    this.program.clear();
    this.render();
    return this;
  }

  /**
   * Destroy the screen
   */
  destroy(): void {
    this.program.clear();
    this.program.flush();

    // Reset terminal (property may not exist yet in Program class)
    if (typeof (this.program as any).reset === 'function') {
      (this.program as any).reset();
    }

    // Destroy program
    if (typeof (this.program as any).destroy === 'function') {
      (this.program as any).destroy();
    }

    super.destroy();
  }
}