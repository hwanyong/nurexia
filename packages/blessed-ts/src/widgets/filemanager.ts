/**
 * filemanager.ts - file manager element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { List, ListOptions } from './list';
import { NodeType } from '../types';
import * as path from 'path';
import * as fs from 'fs';
import * as helpers from '../helpers';

/**
 * FileManager options interface
 */
export interface FileManagerOptions extends ListOptions {
  cwd?: string;
  label?: string;
}

/**
 * File data structure for internal use
 */
interface FileData {
  name: string;
  text: string;
  dir: boolean;
}

/**
 * FileManager Class - File system browser widget
 */
export class FileManager extends List {
  /**
   * FileManager specific properties
   */
  type: NodeType = 'file-manager';
  cwd: string;
  file: string;
  value: string;
  // For TypeScript access to private members
  protected _label: any;

  // For TypeScript access
  declare hide: () => void;
  declare show: () => void;

  /**
   * FileManager constructor
   */
  constructor(options: FileManagerOptions = {}) {
    options.parseTags = true;

    super(options);

    this.cwd = options.cwd || process.cwd();
    this.file = this.cwd;
    this.value = this.cwd;

    if (options.label && options.label.includes('%path')) {
      this._label?.setContent(options.label.replace('%path', this.cwd));
    }

    this.on('select', (item: { content: string }) => {
      const value = item.content.replace(/\{[^{}]+\}/g, '').replace(/@$/, '');
      const file = path.resolve(this.cwd, value);

      fs.stat(file, (err, stat) => {
        if (err) {
          return this.emit('error', err, file);
        }

        this.file = file;
        this.value = file;

        if (stat.isDirectory()) {
          this.emit('cd', file, this.cwd);
          this.cwd = file;

          if (options.label && options.label.includes('%path')) {
            this._label?.setContent(options.label.replace('%path', file));
          }

          this.refresh();
        } else {
          this.emit('file', file);
        }
      });
    });
  }

  /**
   * Refresh directory contents
   */
  refresh(cwdOrCallback?: string | ((err?: Error) => void), callback?: (err?: Error) => void): void {
    let cwd: string | undefined;
    let cb: ((err?: Error) => void) | undefined;

    if (typeof cwdOrCallback === 'function') {
      cb = cwdOrCallback;
    } else {
      cwd = cwdOrCallback;
      cb = callback;
    }

    if (cwd) this.cwd = cwd;
    else cwd = this.cwd;

    fs.readdir(cwd, (err, list) => {
      if (err && err.code === 'ENOENT') {
        this.cwd = cwd !== process.env.HOME
          ? process.env.HOME || '/'
          : '/';
        return this.refresh(cb);
      }

      if (err) {
        if (cb) return cb(err);
        return this.emit('error', err, cwd);
      }

      const dirs: FileData[] = [];
      const files: FileData[] = [];

      list.unshift('..');

      list.forEach((name) => {
        const f = path.resolve(cwd as string, name);
        let stat;

        try {
          stat = fs.lstatSync(f);
        } catch (e) {
          // Ignore errors
        }

        if ((stat && stat.isDirectory()) || name === '..') {
          dirs.push({
            name,
            text: '{light-blue-fg}' + name + '{/light-blue-fg}/',
            dir: true
          });
        } else if (stat && stat.isSymbolicLink()) {
          files.push({
            name,
            text: '{light-cyan-fg}' + name + '{/light-cyan-fg}@',
            dir: false
          });
        } else {
          files.push({
            name,
            text: name,
            dir: false
          });
        }
      });

      const sortedDirs = helpers.asort(dirs);
      const sortedFiles = helpers.asort(files);

      const items = sortedDirs.concat(sortedFiles).map(data => data.text);

      this.setItems(items);
      this.select(0);
      this.screen.render();

      this.emit('refresh');

      if (cb) cb();
    });
  }

  /**
   * Pick a file and return to callback
   */
  pick(cwdOrCallback?: string | ((err?: Error, file?: string) => void), callback?: (err?: Error, file?: string) => void): void {
    let cwd: string | undefined;
    let cb: ((err?: Error, file?: string) => void) | undefined;

    if (typeof cwdOrCallback === 'function') {
      cb = cwdOrCallback;
    } else {
      cwd = cwdOrCallback;
      cb = callback;
    }

    if (!cb) {
      throw new Error('Callback is required for pick method');
    }

    const focused = this.screen.focused === this;
    const hidden = this.hidden;

    const resume = () => {
      this.off('file', onfile);
      this.off('cancel', oncancel);

      if (hidden) {
        this.hide();
      }

      if (!focused) {
        this.screen.restoreFocus();
      }

      this.screen.render();
    };

    const onfile = (file: string) => {
      resume();
      return cb!(undefined, file);
    };

    const oncancel = () => {
      resume();
      return cb!();
    };

    this.on('file', onfile);
    this.on('cancel', oncancel);

    this.refresh(cwd, (err) => {
      if (err) return cb!(err);

      if (hidden) {
        this.show();
      }

      if (!focused) {
        this.screen.saveFocus();
        this.focus();
      }

      this.screen.render();
    });
  }

  /**
   * Reset to original directory
   */
  reset(cwdOrCallback?: string | ((err?: Error) => void), callback?: (err?: Error) => void): void {
    let cwd: string | undefined;
    let cb: ((err?: Error) => void) | undefined;

    if (typeof cwdOrCallback === 'function') {
      cb = cwdOrCallback;
    } else {
      cwd = cwdOrCallback;
      cb = callback;
    }

    this.cwd = cwd || (this.options as FileManagerOptions).cwd || process.cwd();
    this.refresh(cb);
  }
}