/**
 * helpers.ts - helpers for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/chjj/blessed
 */

import * as fs from 'fs';
import { unicode } from '../utils/unicode';
import { Element } from '../widgets/element';
import { Screen } from '../widgets/screen';

/**
 * Type definitions
 */
export interface Style {
  [key: string]: string | boolean;
}

export interface TagResult {
  open: string;
  close: string;
}

/**
 * Helper functions
 */

/**
 * Merge two objects
 */
export function merge<T extends object>(a: T, b: Partial<T>): T {
  Object.keys(b).forEach((key) => {
    (a as any)[key] = b[key];
  });
  return a;
}

/**
 * Sort array of objects by name alphabetically
 */
export function asort<T extends { name: string }>(obj: T[]): T[] {
  return obj.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    let aChar = aName[0];
    let bChar = bName[0];

    if (aChar === '.' && bChar === '.') {
      aChar = aName[1];
      bChar = bName[1];
    }

    return aChar > bChar ? 1 : (aChar < bChar ? -1 : 0);
  });
}

/**
 * Sort array of objects by index in descending order
 */
export function hsort<T extends { index: number }>(obj: T[]): T[] {
  return obj.sort((a, b) => b.index - a.index);
}

/**
 * Find a file recursively starting from a directory
 */
export function findFile(start: string, target: string): string | null {
  const read = (dir: string): string | null => {
    let files: string[];
    let stat: fs.Stats | null;
    let out: string | null;

    if (dir === '/dev' || dir === '/sys'
        || dir === '/proc' || dir === '/net') {
      return null;
    }

    try {
      files = fs.readdirSync(dir);
    } catch (e) {
      files = [];
    }

    for (const file of files) {
      if (file === target) {
        return (dir === '/' ? '' : dir) + '/' + file;
      }

      try {
        stat = fs.lstatSync((dir === '/' ? '' : dir) + '/' + file);
      } catch (e) {
        stat = null;
      }

      if (stat && stat.isDirectory() && !stat.isSymbolicLink()) {
        out = read((dir === '/' ? '' : dir) + '/' + file);
        if (out) return out;
      }
    }

    return null;
  };

  return read(start);
}

/**
 * Escape text for tag-enabled elements
 */
export function escape(text: string): string {
  return text.replace(/[{}]/g, (ch) => {
    return ch === '{' ? '{open}' : '{close}';
  });
}

/**
 * Parse tags in text using Element's parseTags method
 *
 * Note: This function requires Element to have a parseTags method,
 * which needs to be implemented in Element.
 */
export function parseTags(text: string, screen?: Screen): string {
  if (!Element.prototype.parseTags) {
    // Fallback option if parseTags is not implemented yet
    return text;
  }

  return Element.prototype.parseTags.call(
    { parseTags: true, screen: screen || null },
    text
  );
}

/**
 * Generate opening and closing tags for a style
 */
export function generateTags(style?: Style, text?: string): string | TagResult {
  let open = '';
  let close = '';

  if (style) {
    Object.keys(style).forEach((key) => {
      const val = style[key];
      if (typeof val === 'string') {
        const normalizedVal = val
          .replace(/^light(?!-)/, 'light-')
          .replace(/^bright(?!-)/, 'bright-');
        open = `{${normalizedVal}-${key}}${open}`;
        close += `{/${normalizedVal}-${key}}`;
      } else if (val === true) {
        open = `{${key}}${open}`;
        close += `{/${key}}`;
      }
    });
  }

  if (text != null) {
    return open + text + close;
  }

  return {
    open,
    close
  };
}

/**
 * Convert attributes to binary using Element's sattr method
 *
 * Note: This function requires Element to have an sattr method,
 * which needs to be implemented in Element.
 */
export function attrToBinary(style: Style, element?: Element): number {
  // Fallback return value if sattr is not implemented yet
  return 0;
}

/**
 * Strip all tags from text
 */
export function stripTags(text: string): string {
  if (!text) return '';
  return text
    .replace(/{(\/?)([\w\-,;!#]*)}/g, '')
    .replace(/\x1b\[[\d;]*m/g, '');
}

/**
 * Clean tags from text and trim
 */
export function cleanTags(text: string): string {
  return stripTags(text).trim();
}

/**
 * Replace unicode characters with fallbacks
 */
export function dropUnicode(text: string): string {
  if (!text) return '';
  return text
    .replace(unicode.chars.all, '??')
    .replace(unicode.chars.combining || /./g, '')
    .replace(unicode.chars.surrogate, '?');
}