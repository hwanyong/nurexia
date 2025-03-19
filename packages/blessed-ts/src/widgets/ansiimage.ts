/**
 * ansiimage.ts - render PNGS/GIFS as ANSI for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import * as cp from 'child_process';
import * as colors from '../utils/colors';
import { Box, BoxOptions } from './box';
import { NodeType } from '../types';

/**
 * ANSIImage options interface
 */
export interface ANSIImageOptions extends BoxOptions {
  /**
   * Path to the image file
   */
  file?: string;

  /**
   * Enable animation for GIFs
   */
  animate?: boolean;

  /**
   * ASCII output instead of ANSI colors
   */
  ascii?: boolean;

  /**
   * Animation speed
   */
  speed?: number;

  /**
   * Scale factor for the image
   */
  scale?: number;
}

/**
 * TNG module interface (from vendor/tng)
 */
interface TNGImage {
  cellmap: any[][];
  frames?: any[];
  play: (callback: (bmp: any, cellmap: any[][]) => void) => void;
  pause: () => void;
  stop: () => void;
  renderElement: (cellmap: any[][], element: any) => void;
}

/**
 * ANSIImage Class - Renders PNG or GIF files as ANSI colored text
 */
export class ANSIImage extends Box {
  /**
   * Widget type
   */
  type: NodeType = 'ansi-image';

  /**
   * ANSIImage-specific properties
   */
  file: string | null = null;
  img: TNGImage | null = null;
  cellmap: any[][] | null = null;
  scale: number;
  _noFill: boolean = true;

  /**
   * ANSIImage constructor
   */
  constructor(options: ANSIImageOptions = {}) {
    // Always shrink to the image size by default
    options.shrink = options.shrink !== false;

    super(options);

    this.scale = options.scale || 1.0;
    this.options.animate = options.animate !== false;

    if (options.file) {
      this.setImage(options.file);
    }

    // Prevent image from blending with itself if there are alpha channels
    const self = this;
    this.screen.on('prerender', function() {
      const lpos = self.lpos;
      if (!lpos) return;
      (self.screen as any).clearRegion(lpos.xi, lpos.xl, lpos.yi, lpos.yl);
    });

    this.on('destroy', function() {
      self.stop();
    });
  }

  /**
   * Download an image from a URL using curl or wget
   */
  static curl(url: string): Buffer {
    try {
      return cp.execFileSync('curl',
        ['-s', '-A', '', url],
        { stdio: ['ignore', 'pipe', 'ignore'] });
    } catch (e) {
      // Fall through to try wget
    }

    try {
      return cp.execFileSync('wget',
        ['-U', '', '-O', '-', url],
        { stdio: ['ignore', 'pipe', 'ignore'] });
    } catch (e) {
      // Fall through to error
    }

    throw new Error('curl or wget failed.');
  }

  /**
   * Set the image to render
   */
  setImage(file: string | Buffer): void {
    this.file = typeof file === 'string' ? file : null;

    let imageData: string | Buffer = file;

    // Handle URLs by downloading with curl/wget
    if (typeof file === 'string' && /^https?:/.test(file)) {
      imageData = ANSIImage.curl(file);
    }

    let width = this.position.width;
    let height = this.position.height;

    if (width != null) {
      width = typeof this.width === 'number' ? this.width : undefined;
    }

    if (height != null) {
      height = typeof this.height === 'number' ? this.height : undefined;
    }

    try {
      this.setContent('');

      // Load tng from vendor directory
      const tng = require('../../vendor/tng');

      this.img = tng(imageData, {
        colors: colors,
        width: width,
        height: height,
        scale: this.scale,
        ascii: (this.options as ANSIImageOptions).ascii,
        speed: (this.options as ANSIImageOptions).speed,
        filename: this.file
      });

      if (width == null || height == null) {
        if (typeof this.img.cellmap[0].length === 'number') {
          this.width = this.img.cellmap[0].length;
        }
        if (typeof this.img.cellmap.length === 'number') {
          this.height = this.img.cellmap.length;
        }
      }

      if (this.img.frames && (this.options as ANSIImageOptions).animate) {
        this.play();
      } else {
        this.cellmap = this.img.cellmap;
      }
    } catch (e) {
      this.setContent('Image Error: ' + (e as Error).message);
      this.img = null;
      this.cellmap = null;
    }
  }

  /**
   * Start animation for animated GIFs
   */
  play(): void {
    if (!this.img) return;
    const self = this;
    this.img.play(function(bmp, cellmap) {
      self.cellmap = cellmap;
      self.screen.render();
    });
  }

  /**
   * Pause animation
   */
  pause(): void {
    if (!this.img) return;
    this.img.pause();
  }

  /**
   * Stop animation
   */
  stop(): void {
    if (!this.img) return;
    this.img.stop();
  }

  /**
   * Clear the current image
   */
  clearImage(): void {
    this.stop();
    this.setContent('');
    this.img = null;
    this.cellmap = null;
  }

  /**
   * Render the image
   */
  render(): any {
    const coords = this._render();
    if (!coords) return;

    if (this.img && this.cellmap) {
      this.img.renderElement(this.cellmap, this);
    }

    return coords;
  }

  /**
   * Internal render method
   */
  _render(): any {
    return super.render();
  }
}