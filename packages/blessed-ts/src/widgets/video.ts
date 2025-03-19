/**
 * video.ts - video element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import * as cp from 'child_process';
import { Box, BoxOptions } from './box';
import { NodeType } from '../types';
import { Terminal, TerminalOptions } from './terminal';
import { Screen } from './screen';

/**
 * Video options interface
 */
export interface VideoOptions extends BoxOptions {
  file?: string;
  start?: number;
}

/**
 * Video Class - Displays video using mplayer or mpv with ASCII output
 */
export class Video extends Box {
  /**
   * Widget type
   */
  type: NodeType = 'video';

  /**
   * Video-specific properties
   */
  tty!: Terminal;
  now!: number;
  start!: number;

  // Internal properties inherited from Box/Element
  declare iwidth: number;
  declare iheight: number;
  declare tags: boolean;

  /**
   * Video constructor
   */
  constructor(options: VideoOptions = {}) {
    super(options);

    let shell: string;
    let args: string[];

    if (this.exists('mplayer')) {
      shell = 'mplayer';
      args = ['-vo', 'caca', '-quiet', options.file || ''];
    } else if (this.exists('mpv')) {
      shell = 'mpv';
      args = ['--vo', 'caca', '--really-quiet', options.file || ''];
    } else {
      this.tags = true;
      this.setContent('{red-fg}{bold}Error:{/bold} mplayer or mpv not installed.{/red-fg}');
      return;
    }

    const terminalOpts: TerminalOptions = {
      parent: this,
      left: 0,
      top: 0,
      width: typeof this.width === 'number' ? this.width - (this.iwidth || 0) : 0,
      height: typeof this.height === 'number' ? this.height - (this.iheight || 0) : 0,
      shell,
      args: args.slice()
    };

    this.now = Math.floor(Date.now() / 1000);
    this.start = options.start || 0;

    if (this.start) {
      if (shell === 'mplayer') {
        terminalOpts.args!.unshift('-ss', this.start.toString());
      } else if (shell === 'mpv') {
        terminalOpts.args!.unshift('--start', this.start.toString());
      }
    }

    const DISPLAY = process.env.DISPLAY;
    delete process.env.DISPLAY;
    this.tty = new Terminal(terminalOpts);
    process.env.DISPLAY = DISPLAY;

    this.on('click', () => {
      this.tty.pty.write('p');
    });

    // mplayer/mpv cannot resize itself in the terminal, so we have
    // to restart it at the correct start time.
    this.on('resize', () => {
      this.tty.destroy();

      const terminalOpts: TerminalOptions = {
        parent: this,
        left: 0,
        top: 0,
        width: typeof this.width === 'number' ? this.width - (this.iwidth || 0) : 0,
        height: typeof this.height === 'number' ? this.height - (this.iheight || 0) : 0,
        shell,
        args: args.slice()
      };

      const watched = Math.floor(Date.now() / 1000) - this.now;
      this.now = Math.floor(Date.now() / 1000);
      this.start += watched;

      if (shell === 'mplayer') {
        terminalOpts.args!.unshift('-ss', this.start.toString());
      } else if (shell === 'mpv') {
        terminalOpts.args!.unshift('--start', this.start.toString());
      }

      const DISPLAY = process.env.DISPLAY;
      delete process.env.DISPLAY;
      this.tty = new Terminal(terminalOpts);
      process.env.DISPLAY = DISPLAY;

      if (this.screen) {
        (this.screen as unknown as Screen).render();
      }
    });
  }

  /**
   * Check if a program exists in the system path
   */
  exists(program: string): boolean {
    try {
      return !!Number(
        cp.execSync(`type ${program} > /dev/null 2> /dev/null && echo 1`, {
          encoding: 'utf8'
        }).trim()
      );
    } catch (e) {
      return false;
    }
  }
}