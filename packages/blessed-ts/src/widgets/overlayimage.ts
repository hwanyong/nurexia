/**
 * overlayimage.ts - w3m image element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { existsSync } from 'fs';
import { spawn, execSync, execFileSync } from 'child_process';
import { findFile } from '../helpers';
import { Box, BoxOptions } from './box';
import { Node } from './node';
import { NodeType } from '../types';
import { Program } from '../program/program';

/**
 * OverlayImage Options Interface
 */
export interface OverlayImageOptions extends BoxOptions {
  w3m?: string;
  search?: boolean;
  file?: string;
  img?: string;
  autofit?: boolean;
}

/**
 * PixelRatio interface
 */
interface PixelRatio {
  tw: number;
  th: number;
}

/**
 * Size interface
 */
interface Size {
  raw: string;
  width: number;
  height: number;
}

/**
 * Props interface
 */
interface Props {
  aleft: number;
  atop: number;
  width: number;
  height: number;
}

/**
 * LastSize interface
 */
interface LastSize {
  tw: number;
  th: number;
  width: number;
  height: number;
  aleft: number;
  atop: number;
}

/**
 * OverlayImage Class
 * Uses w3mimgdisplay to render images in the terminal
 */
export class OverlayImage extends Box {
  /**
   * OverlayImage properties
   */
  type: NodeType = 'overlay-image';
  file?: string;

  // Override in subclass to allow undefined value
  shrink = false;

  // Position properties
  aleft = 0;
  atop = 0;

  // Private properties
  private _lastFile?: string;
  private _noImage = false;
  private _settingImage = false;
  private _queue: [string, ((err: Error | null, success?: boolean) => void) | undefined][] = [];
  private _needsRatio = false;
  private _ratio?: PixelRatio;
  private _props?: Props;
  private _lastSize?: LastSize;
  private _drag?: boolean;

  // Static properties
  static w3mdisplay = '/usr/lib/w3m/w3mimgdisplay';
  static hasW3MDisplay: boolean | null = null;

  // Check if we're in a Node.js environment with child_process
  private _hasExecSync = typeof execSync === 'function';

  /**
   * OverlayImage constructor
   */
  constructor(options: OverlayImageOptions = {}) {
    super(options);

    if (!(this instanceof Node)) {
      return new OverlayImage(options);
    }

    if (options.w3m) {
      OverlayImage.w3mdisplay = options.w3m;
    }

    if (OverlayImage.hasW3MDisplay === null) {
      if (existsSync(OverlayImage.w3mdisplay)) {
        OverlayImage.hasW3MDisplay = true;
      } else if (options.search !== false) {
        const file = findFile('/usr', 'w3mimgdisplay')
                || findFile('/lib', 'w3mimgdisplay')
                || findFile('/bin', 'w3mimgdisplay');
        if (file) {
          OverlayImage.hasW3MDisplay = true;
          OverlayImage.w3mdisplay = file;
        } else {
          OverlayImage.hasW3MDisplay = false;
        }
      }
    }

    this.on('hide', () => {
      this._lastFile = this.file;
      this.clearImage();
    });

    this.on('show', () => {
      if (!this._lastFile) return;
      this.setImage(this._lastFile);
    });

    this.on('detach', () => {
      this._lastFile = this.file;
      this.clearImage();
    });

    this.on('attach', () => {
      if (!this._lastFile) return;
      this.setImage(this._lastFile);
    });

    // Subscribe to screen events
    if (this.screen) {
      this.screen.on('resize', () => {
        this._needsRatio = true;
      });

      this.screen.on('render', () => {
        // Access program through screen if it's available
        const program = (this.screen as any).program as Program | undefined;
        if (program && typeof program.flush === 'function') {
          program.flush();
        }
        if (!this._noImage && this.file) {
          this.setImage(this.file);
        }
      });
    }

    if (options.file || options.img) {
      this.setImage(options.file || options.img);
    }
  }

  /**
   * Subscribe to screen events
   */
  onScreenEvent(event: string, listener: (...args: any[]) => void): void {
    if (this.screen) {
      this.screen.on(event, listener);
    }
  }

  /**
   * Get safe width and height values
   */
  private _getDimensions(): { width: number; height: number } {
    // Access width and height via getters or from position
    let width = 0;
    let height = 0;

    try {
      // Try to use accessor methods first
      const boxAny = this as any;
      if (typeof boxAny.getWidth === 'function') {
        width = boxAny.getWidth() || 1;
      } else if ((this.position as any)?.width) {
        width = (this.position as any).width;
      } else {
        width = 1; // Default fallback
      }

      if (typeof boxAny.getHeight === 'function') {
        height = boxAny.getHeight() || 1;
      } else if ((this.position as any)?.height) {
        height = (this.position as any).height;
      } else {
        height = 1; // Default fallback
      }
    } catch (e) {
      // Fallback to defaults if any error
      width = 1;
      height = 1;
    }

    return { width, height };
  }

  /**
   * Spawn a child process
   */
  spawn(
    file: string,
    args: string[],
    opt: Record<string, any> = {},
    callback?: (err: Error | null, success?: boolean) => void
  ) {
    const ps = spawn(file, args, opt);

    ps.on('error', (err) => {
      if (!callback) return;
      return callback(err, false);
    });

    ps.on('exit', (code) => {
      if (!callback) return;
      if (code !== 0) return callback(new Error(`Exit Code: ${code}`), false);
      return callback(null, code === 0);
    });

    return ps;
  }

  /**
   * Set image to display
   */
  setImage(
    img?: string,
    callback?: (err: Error | null, success?: boolean) => void
  ) {
    if (this._settingImage) {
      this._queue.push([img!, callback]);
      return;
    }
    this._settingImage = true;

    const reset = () => {
      this._settingImage = false;
      const item = this._queue.shift();
      if (item) {
        this.setImage(item[0], item[1]);
      }
    };

    if (OverlayImage.hasW3MDisplay === false) {
      reset();
      if (!callback) return;
      return callback(new Error('W3M Image Display not available.'), false);
    }

    if (!img) {
      reset();
      if (!callback) return;
      return callback(new Error('No image.'), false);
    }

    this.file = img;

    return this.getPixelRatio((err, ratio) => {
      if (err) {
        reset();
        if (!callback) return;
        return callback(err, false);
      }

      return this.renderImage(img, ratio, (err, success) => {
        if (err) {
          reset();
          if (!callback) return;
          return callback(err, false);
        }

        if (this.shrink || this.options.autofit) {
          this.shrink = false;
          this.options.autofit = true;
          return this.imageSize((err, size) => {
            if (err) {
              reset();
              if (!callback) return;
              return callback(err, false);
            }

            if (this._lastSize
                && ratio!.tw === this._lastSize.tw
                && ratio!.th === this._lastSize.th
                && size.width === this._lastSize.width
                && size.height === this._lastSize.height
                && this.aleft === this._lastSize.aleft
                && this.atop === this._lastSize.atop) {
              reset();
              if (!callback) return;
              return callback(null, success);
            }

            this._lastSize = {
              tw: ratio!.tw,
              th: ratio!.th,
              width: size.width,
              height: size.height,
              aleft: this.aleft,
              atop: this.atop
            };

            // Set position properties directly
            if (!this.position) {
              this.position = { left: 0, right: 0, top: 0, bottom: 0 };
            }

            // Add width and height properties to position
            (this.position as any).width = Math.floor(size.width / ratio!.tw);
            (this.position as any).height = Math.floor(size.height / ratio!.th);

            this._noImage = true;
            // Call render on screen if available
            if (this.screen) {
              const screenAny = this.screen as any;
              if (typeof screenAny.render === 'function') {
                screenAny.render();
              }
            }
            this._noImage = false;

            reset();
            return this.renderImage(img, ratio, callback);
          });
        }

        reset();
        if (!callback) return;
        return callback(null, success);
      });
    });
  }

  /**
   * Render image to terminal
   */
  renderImage(
    img: string,
    ratio?: PixelRatio,
    callback?: (err: Error | null, success?: boolean) => void
  ) {
    if (this._hasExecSync) {
      const cb = callback || ((err, result) => result!);
      try {
        return cb(null, this.renderImageSync(img, ratio!));
      } catch (e) {
        return cb(e as Error, false);
      }
    }

    if (OverlayImage.hasW3MDisplay === false) {
      if (!callback) return;
      return callback(new Error('W3M Image Display not available.'), false);
    }

    if (!ratio) {
      if (!callback) return;
      return callback(new Error('No ratio.'), false);
    }

    // clearImage unsets these:
    const _file = this.file;
    const _lastSize = this._lastSize;
    return this.clearImage((err) => {
      if (err && callback) return callback(err, false);

      this.file = _file;
      this._lastSize = _lastSize;

      const opt = {
        stdio: 'pipe',
        env: process.env,
        cwd: process.env.HOME
      };

      const ps = this.spawn(OverlayImage.w3mdisplay, [], opt, (err, success) => {
        if (!callback) return;
        return err
          ? callback(err, false)
          : callback(null, success);
      });

      // Get width and height safely
      const { width, height } = this._getDimensions();

      const calculatedWidth = Math.floor(width * ratio.tw);
      const calculatedHeight = Math.floor(height * ratio.th);
      const aleft = Math.floor(this.aleft * ratio.tw);
      const atop = Math.floor(this.atop * ratio.th);

      const input = `0;1;${aleft};${atop};${calculatedWidth};${calculatedHeight};;;;;${img}\n4;\n3;\n`;

      this._props = {
        aleft,
        atop,
        width: calculatedWidth,
        height: calculatedHeight
      };

      ps.stdin!.write(input);
      ps.stdin!.end();
    });
  }

  /**
   * Clear the image from the terminal
   */
  clearImage(callback?: (err: Error | null, success?: boolean) => void) {
    if (this._hasExecSync) {
      const cb = callback || ((err, result) => result!);
      try {
        return cb(null, this.clearImageSync());
      } catch (e) {
        return cb(e as Error, false);
      }
    }

    if (OverlayImage.hasW3MDisplay === false) {
      if (!callback) return;
      return callback(new Error('W3M Image Display not available.'), false);
    }

    if (!this._props) {
      if (!callback) return;
      return callback(null, false);
    }

    const opt = {
      stdio: 'pipe',
      env: process.env,
      cwd: process.env.HOME
    };

    const ps = this.spawn(OverlayImage.w3mdisplay, [], opt, (err, success) => {
      if (!callback) return;
      return err
        ? callback(err, false)
        : callback(null, success);
    });

    let width = this._props.width + 2;
    let height = this._props.height + 2;
    let aleft = this._props.aleft;
    let atop = this._props.atop;

    if (this._drag) {
      aleft -= 10;
      atop -= 10;
      width += 10;
      height += 10;
    }

    const input = `6;${aleft};${atop};${width};${height}\n4;\n3;\n`;

    delete this.file;
    delete this._props;
    delete this._lastSize;

    ps.stdin!.write(input);
    ps.stdin!.end();
  }

  /**
   * Get image dimensions
   */
  imageSize(callback?: (err: Error | null, size: Size) => void) {
    const img = this.file;

    if (this._hasExecSync) {
      const cb = callback || ((err, result) => result!);
      try {
        return cb(null, this.imageSizeSync());
      } catch (e) {
        return cb(e as Error, {
          raw: '',
          width: 0,
          height: 0
        });
      }
    }

    if (OverlayImage.hasW3MDisplay === false) {
      if (!callback) return;
      return callback(new Error('W3M Image Display not available.'), {
        raw: '',
        width: 0,
        height: 0
      });
    }

    if (!img) {
      if (!callback) return;
      return callback(new Error('No image.'), {
        raw: '',
        width: 0,
        height: 0
      });
    }

    const opt = {
      stdio: 'pipe',
      env: process.env,
      cwd: process.env.HOME
    };

    const ps = this.spawn(OverlayImage.w3mdisplay, [], opt);

    let buf = '';

    ps.stdout!.setEncoding('utf8');

    ps.stdout!.on('data', (data) => {
      buf += data;
    });

    ps.on('error', (err) => {
      if (!callback) return;
      return callback(err, {
        raw: '',
        width: 0,
        height: 0
      });
    });

    ps.on('exit', () => {
      if (!callback) return;
      const size = buf.trim().split(/\s+/);
      return callback(null, {
        raw: buf.trim(),
        width: +size[0],
        height: +size[1]
      });
    });

    const input = `5;${img}\n`;

    ps.stdin!.write(input);
    ps.stdin!.end();
  }

  /**
   * Get terminal dimensions
   */
  termSize(callback?: (err: Error | null, size: Size) => void) {
    if (this._hasExecSync) {
      const cb = callback || ((err, result) => result!);
      try {
        return cb(null, this.termSizeSync());
      } catch (e) {
        return cb(e as Error, {
          raw: '',
          width: 0,
          height: 0
        });
      }
    }

    if (OverlayImage.hasW3MDisplay === false) {
      if (!callback) return;
      return callback(new Error('W3M Image Display not available.'), {
        raw: '',
        width: 0,
        height: 0
      });
    }

    const opt = {
      stdio: 'pipe',
      env: process.env,
      cwd: process.env.HOME
    };

    const ps = this.spawn(OverlayImage.w3mdisplay, ['-test'], opt);

    let buf = '';

    ps.stdout!.setEncoding('utf8');

    ps.stdout!.on('data', (data) => {
      buf += data;
    });

    ps.on('error', (err) => {
      if (!callback) return;
      return callback(err, {
        raw: '',
        width: 0,
        height: 0
      });
    });

    ps.on('exit', () => {
      if (!callback) return;

      if (!buf.trim()) {
        // Bug: w3mimgdisplay will sometimes
        // output nothing. Try again:
        return this.termSize(callback);
      }

      const size = buf.trim().split(/\s+/);

      return callback(null, {
        raw: buf.trim(),
        width: +size[0],
        height: +size[1]
      });
    });

    ps.stdin!.end();
  }

  /**
   * Get pixel ratio for terminal
   */
  getPixelRatio(callback?: (err: Error | null, ratio: PixelRatio) => void) {
    if (this._hasExecSync) {
      const cb = callback || ((err, result) => result!);
      try {
        return cb(null, this.getPixelRatioSync());
      } catch (e) {
        return cb(e as Error, { tw: 1, th: 1 });
      }
    }

    // We could cache this, but sometimes it's better
    // to recalculate to be pixel perfect.
    if (this._ratio && !this._needsRatio) {
      if (callback) return callback(null, this._ratio);
      return;
    }

    return this.termSize((err, dimensions) => {
      if (err && callback) return callback(err, { tw: 1, th: 1 });

      // Get screen width/height safely
      const screenWidth = (this.screen as any)?.width || 1;
      const screenHeight = (this.screen as any)?.height || 1;

      this._ratio = {
        tw: dimensions.width / screenWidth,
        th: dimensions.height / screenHeight
      };

      this._needsRatio = false;

      if (callback) return callback(null, this._ratio);
    });
  }

  /**
   * Render image synchronously
   */
  renderImageSync(img: string, ratio: PixelRatio): boolean {
    if (OverlayImage.hasW3MDisplay === false) {
      throw new Error('W3M Image Display not available.');
    }

    if (!ratio) {
      throw new Error('No ratio.');
    }

    // clearImage unsets these:
    const _file = this.file;
    const _lastSize = this._lastSize;

    this.clearImageSync();

    this.file = _file;
    this._lastSize = _lastSize;

    // Get width and height safely
    const { width, height } = this._getDimensions();

    const calculatedWidth = Math.floor(width * ratio.tw);
    const calculatedHeight = Math.floor(height * ratio.th);
    const aleft = Math.floor(this.aleft * ratio.tw);
    const atop = Math.floor(this.atop * ratio.th);

    const input = `0;1;${aleft};${atop};${calculatedWidth};${calculatedHeight};;;;;${img}\n4;\n3;\n`;

    this._props = {
      aleft,
      atop,
      width: calculatedWidth,
      height: calculatedHeight
    };

    try {
      execFileSync(OverlayImage.w3mdisplay, [], {
        env: process.env,
        encoding: 'utf8',
        input,
        timeout: 1000
      });
    } catch (e) {
      // Ignore errors
    }

    return true;
  }

  /**
   * Clear image synchronously
   */
  clearImageSync(): boolean {
    if (OverlayImage.hasW3MDisplay === false) {
      throw new Error('W3M Image Display not available.');
    }

    if (!this._props) {
      return false;
    }

    let width = this._props.width + 2;
    let height = this._props.height + 2;
    let aleft = this._props.aleft;
    let atop = this._props.atop;

    if (this._drag) {
      aleft -= 10;
      atop -= 10;
      width += 10;
      height += 10;
    }

    const input = `6;${aleft};${atop};${width};${height}\n4;\n3;\n`;

    delete this.file;
    delete this._props;
    delete this._lastSize;

    try {
      execFileSync(OverlayImage.w3mdisplay, [], {
        env: process.env,
        encoding: 'utf8',
        input,
        timeout: 1000
      });
    } catch (e) {
      // Ignore errors
    }

    return true;
  }

  /**
   * Get image size synchronously
   */
  imageSizeSync(): Size {
    const img = this.file;

    if (OverlayImage.hasW3MDisplay === false) {
      throw new Error('W3M Image Display not available.');
    }

    if (!img) {
      throw new Error('No image.');
    }

    let buf = '';
    const input = `5;${img}\n`;

    try {
      buf = execFileSync(OverlayImage.w3mdisplay, [], {
        env: process.env,
        encoding: 'utf8',
        input,
        timeout: 1000
      });
    } catch (e) {
      // Ignore errors
    }

    const size = buf.trim().split(/\s+/);

    return {
      raw: buf.trim(),
      width: +size[0],
      height: +size[1]
    };
  }

  /**
   * Get terminal size synchronously
   */
  termSizeSync(_?: any, recurse = 0): Size {
    if (OverlayImage.hasW3MDisplay === false) {
      throw new Error('W3M Image Display not available.');
    }

    let buf = '';

    try {
      buf = execFileSync(OverlayImage.w3mdisplay, ['-test'], {
        env: process.env,
        encoding: 'utf8',
        timeout: 1000
      });
    } catch (e) {
      // Ignore errors
    }

    if (!buf.trim()) {
      // Bug: w3mimgdisplay will sometimes
      // output nothing. Try again:
      if (++recurse === 5) {
        throw new Error('Term size not determined.');
      }
      return this.termSizeSync(_, recurse);
    }

    const size = buf.trim().split(/\s+/);

    return {
      raw: buf.trim(),
      width: +size[0],
      height: +size[1]
    };
  }

  /**
   * Get pixel ratio synchronously
   */
  getPixelRatioSync(): PixelRatio {
    // We could cache this, but sometimes it's better
    // to recalculate to be pixel perfect.
    if (this._ratio && !this._needsRatio) {
      return this._ratio;
    }
    this._needsRatio = false;

    const dimensions = this.termSizeSync();

    // Get screen width/height safely
    const screenWidth = (this.screen as any)?.width || 1;
    const screenHeight = (this.screen as any)?.height || 1;

    this._ratio = {
      tw: dimensions.width / screenWidth,
      th: dimensions.height / screenHeight
    };

    return this._ratio;
  }

  /**
   * Display image (delegate to screen)
   */
  displayImage(callback?: (err: Error | null, success?: boolean) => void) {
    if (!this.screen || !this.file) return;

    // Access the displayImage method on screen safely
    const screenAny = this.screen as any;
    if (typeof screenAny.displayImage === 'function') {
      return screenAny.displayImage(this.file, callback);
    }
  }
}