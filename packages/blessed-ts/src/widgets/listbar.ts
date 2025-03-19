/**
 * listbar.ts - listbar element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { merge, generateTags } from '../helpers';
import { Style } from '../types';
import { Box, BoxOptions } from './box';
import { Element } from './element';
import { NodeType } from '../types';

/**
 * Command interface for ListBar items
 */
export interface ListBarCommand {
  prefix?: string;
  text: string;
  keys?: string[];
  callback?: () => void;
  element?: Box;
}

/**
 * ListBar options interface
 */
export interface ListBarOptions extends BoxOptions {
  items?: string[] | ListBarCommand[] | Record<string, ListBarCommand | (() => void)>;
  commands?: string[] | ListBarCommand[] | Record<string, ListBarCommand | (() => void)>;
  autoCommandKeys?: boolean;
  mouse?: boolean;
  keys?: boolean;
  vi?: boolean;
}

/**
 * ListBar Class - Horizontal list bar with items
 */
export class ListBar extends Box {
  /**
   * ListBar specific properties
   */
  type: NodeType = 'listbar';
  items: Box[] = [];
  ritems: string[] = [];
  commands: ListBarCommand[] = [];
  leftBase: number = 0;
  leftOffset: number = 0;
  private mouse: boolean;
  private keys: boolean;
  private vi: boolean;
  private autoCommandKeys: boolean;
  private _: Record<string, Box> = {}; // For direct access to elements

  // Additional properties that might be used
  ileft: number = 0;
  itop: number = 0;
  iwidth: number = 0;

  /**
   * ListBar constructor
   */
  constructor(options: ListBarOptions = {}) {
    super(options);

    // ListBar 전용 속성 설정
    this.mouse = options.mouse || false;
    this.keys = options.keys !== false;
    this.vi = options.vi || false;
    this.autoCommandKeys = options.autoCommandKeys || false;

    if (!this.style.selected) {
      this.style.selected = {};
    }

    if (!this.style.item) {
      this.style.item = {};
    }

    if (options.commands || options.items) {
      this.setItems(options.commands || options.items || []);
    }

    this.setupKeys(options);
    this.setupAutoCommandKeys();
    this.setupFocusHandler();
  }

  /**
   * Get selected item index
   */
  get selected(): number {
    return this.leftBase + this.leftOffset;
  }

  /**
   * Setup keyboard navigation
   */
  private setupKeys(options: ListBarOptions): void {
    if (!this.keys) return;

    this.on('keypress', (ch, key) => {
      if (key.name === 'left'
          || (this.vi && key.name === 'h')
          || (key.shift && key.name === 'tab')) {
        this.moveLeft();
        if (this.screen) this.screen.emit('render');
        // Stop propagation if we're in a form.
        if (key.name === 'tab') return false;
        return;
      }
      if (key.name === 'right'
          || (this.vi && key.name === 'l')
          || key.name === 'tab') {
        this.moveRight();
        if (this.screen) this.screen.emit('render');
        // Stop propagation if we're in a form.
        if (key.name === 'tab') return false;
        return;
      }
      if (key.name === 'enter'
          || (this.vi && key.name === 'k' && !key.shift)) {
        const item = this.items[this.selected];
        this.emit('action', item, this.selected);
        this.emit('select', item, this.selected);
        if ((item as any)['_']?.cmd?.callback) {
          (item as any)['_'].cmd.callback();
        }
        if (this.screen) this.screen.emit('render');
        return;
      }
      if (key.name === 'escape' || (this.vi && key.name === 'q')) {
        this.emit('action');
        this.emit('cancel');
        return;
      }
    });
  }

  /**
   * Setup auto command keys (numbers 1-9,0)
   */
  private setupAutoCommandKeys(): void {
    if (!this.autoCommandKeys || !this.screen) return;

    this.screen.on('keypress', (ch) => {
      if (/^[0-9]$/.test(ch)) {
        let i = +ch - 1;
        if (i === -1) i = 9;
        return this.selectTab(i);
      }
    });
  }

  /**
   * Setup focus handler
   */
  private setupFocusHandler(): void {
    this.on('focus', () => {
      this.select(this.selected);
    });
  }

  /**
   * Set items from commands object or array
   */
  setItems(commands: string[] | ListBarCommand[] | Record<string, ListBarCommand | (() => void)>): void {
    let commandsArray: ListBarCommand[] = [];

    if (!Array.isArray(commands)) {
      commandsArray = Object.keys(commands).reduce((obj: ListBarCommand[], key: string, i: number) => {
        const cmd = commands[key] as ListBarCommand | (() => void);
        let newCmd: ListBarCommand;

        if (typeof cmd === 'function') {
          newCmd = {
            callback: cmd as () => void,
            text: (cmd as Function).name || key
          };
        } else {
          newCmd = cmd as ListBarCommand;
        }

        if (newCmd.text == null) newCmd.text = key;
        if (newCmd.prefix == null) newCmd.prefix = (i + 1) + '';

        obj.push(newCmd);

        return obj;
      }, []);
    } else {
      commandsArray = commands as ListBarCommand[];
    }

    // Remove existing items
    this.items.forEach((el) => {
      if (typeof (el as any).destroy === 'function') {
        (el as any).destroy();
      }
    });

    this.items = [];
    this.ritems = [];
    this.commands = [];

    // Add new items
    commandsArray.forEach((cmd) => {
      this.add(cmd);
    });

    this.emit('set items');
  }

  /**
   * Add an item to the list
   */
  add(item: string | ListBarCommand | (() => void), callback?: () => void): void {
    const prev = this.items[this.items.length - 1];
    let drawn = 0;
    let cmd: ListBarCommand;

    if (!this.parent) {
      drawn = 0;
    } else {
      drawn = prev ? (prev['aleft'] as number) + (prev.width as number || 0) : 0;
      if (this.screen && (this.screen as any)['autoPadding'] === false) {
        drawn += this.ileft;
      }
    }

    // Initialize cmd with a default value to fix "used before assigned" error
    if (typeof item === 'object' && !Array.isArray(item) && item !== null) {
      cmd = item as ListBarCommand;
      if (cmd.prefix == null) cmd.prefix = (this.items.length + 1) + '';
    } else if (typeof item === 'string') {
      cmd = {
        prefix: (this.items.length + 1) + '',
        text: item,
        callback: callback
      };
    } else if (typeof item === 'function') {
      cmd = {
        prefix: (this.items.length + 1) + '',
        text: (item as Function).name || `fn${this.items.length + 1}`,
        callback: item as () => void
      };
    } else {
      // Fallback for any other case
      cmd = {
        text: `item${this.items.length + 1}`,
        prefix: (this.items.length + 1) + ''
      };
    }

    if (cmd.keys && cmd.keys[0]) {
      cmd.prefix = cmd.keys[0];
    }

    // Handle prefix style
    const prefixStyle = (this.style as any).prefix || { fg: 'lightblack' };
    const tagsResult = generateTags(prefixStyle);
    const tags = typeof tagsResult === 'string' ? { open: '', close: '' } : tagsResult;

    const title = (cmd.prefix != null ? tags.open + cmd.prefix + tags.close + ':' : '') + cmd.text;

    const len = ((cmd.prefix != null ? cmd.prefix + ':' : '') + cmd.text).length;

    const options: BoxOptions = {
      screen: this.screen as any,
      top: 0,
      left: drawn + 1,
      height: 1,
      content: title,
      width: len + 2,
      align: 'center',
      autoFocus: false,
      tags: true,
      mouse: true,
      style: merge({}, this.style.item || {}),
      noOverflow: true
    };

    if (this.screen && (this.screen as any)['autoPadding'] === false) {
      options.top = (options.top as number) + this.itop;
      options.left = (options.left as number) + this.ileft;
    }

    // Create the item element with dynamic styles
    const self = this;
    const styleProps = ['bg', 'fg', 'bold', 'underline', 'blink', 'inverse', 'invisible'];

    styleProps.forEach((name) => {
      (options.style as any)[name] = function(this: any) {
        const attr = self.items[self.selected] === this.parent
          ? self.style.selected?.[name]
          : self.style.item?.[name];
        if (typeof attr === 'function') return attr(this.parent);
        return attr;
      };
    });

    const el = new Box(options);

    // Store references
    this._[cmd.text] = el;
    cmd.element = el;
    (el as any)['_'] = (el as any)['_'] || {};
    (el as any)['_'].cmd = cmd;

    this.ritems.push(cmd.text);
    this.items.push(el);
    this.commands.push(cmd);
    this.append(el);

    // Attach command callback
    if (cmd.callback) {
      if (cmd.keys && this.screen) {
        (this.screen as any).key(cmd.keys, () => {
          this.emit('action', el, this.selected);
          this.emit('select', el, this.selected);
          if ((el as any)['_']?.cmd?.callback) {
            (el as any)['_'].cmd.callback();
          }
          this.select(el);
          if (this.screen) this.screen.emit('render');
        });
      }
    }

    // Select first item automatically
    if (this.items.length === 1) {
      this.select(0);
    }

    // Attach mouse handler
    if (this.mouse) {
      el.on('click', () => {
        this.emit('action', el, this.selected);
        this.emit('select', el, this.selected);
        if ((el as any)['_']?.cmd?.callback) {
          (el as any)['_'].cmd.callback();
        }
        this.select(el);
        if (this.screen) this.screen.emit('render');
      });
    }

    this.emit('add item');
  }

  /**
   * Alias methods for add
   */
  addItem(item: string | ListBarCommand | (() => void), callback?: () => void): void {
    this.add(item, callback);
  }

  appendItem(item: string | ListBarCommand | (() => void), callback?: () => void): void {
    this.add(item, callback);
  }

  /**
   * Custom rendering implementation
   */
  _renderListbar(): void {
    let drawn = 0;

    if (this.screen && (this.screen as any)['autoPadding'] === false) {
      drawn += this.ileft;
    }

    this.items.forEach((el, i) => {
      if (i < this.leftBase) {
        (el as any).hide();
      } else {
        (el as any)['rleft'] = drawn + 1;
        drawn += (el.width as number || 0) + 2;
        (el as any).show();
      }
    });
  }

  /**
   * Override render method
   */
  render(): { width: number; height: number } {
    this._renderListbar();
    return super.render();
  }

  /**
   * Select an item
   */
  select(offset: number | Box): void {
    if (typeof offset !== 'number') {
      offset = this.items.indexOf(offset as Box);
    }

    offset = offset as number;

    if (offset < 0) {
      offset = 0;
    } else if (offset >= this.items.length) {
      offset = this.items.length - 1;
    }

    if (!this.parent) {
      this.emit('select item', this.items[offset], offset);
      return;
    }

    // Access the _getCoords method
    const getCoords = (this as any)._getCoords;
    if (!getCoords) return;

    const lpos = getCoords.call(this);
    if (!lpos) return;

    const width = (lpos.xl - lpos.xi) - this.iwidth;
    let drawn = 0;
    let visible = 0;

    const el = this.items[offset];
    if (!el) return;

    this.items.forEach((item, i) => {
      if (i < this.leftBase) return;

      const itemGetCoords = (item as any)._getCoords;
      if (!itemGetCoords) return;

      const itemPos = itemGetCoords.call(item);
      if (!itemPos) return;

      if (itemPos.xl - itemPos.xi <= 0) return;

      drawn += (itemPos.xl - itemPos.xi) + 2;

      if (drawn <= width) visible++;
    });

    const diff = offset - (this.leftBase + this.leftOffset);
    if (offset > this.leftBase + this.leftOffset) {
      if (offset > this.leftBase + visible - 1) {
        this.leftOffset = 0;
        this.leftBase = offset;
      } else {
        this.leftOffset += diff;
      }
    } else if (offset < this.leftBase + this.leftOffset) {
      const absDiff = -diff;
      if (offset < this.leftBase) {
        this.leftOffset = 0;
        this.leftBase = offset;
      } else {
        this.leftOffset -= absDiff;
      }
    }

    this.emit('select item', el, offset);
  }

  /**
   * Remove an item
   */
  removeItem(child: number | Box): void {
    const i = typeof child !== 'number'
      ? this.items.indexOf(child as Box)
      : child;

    if (i !== -1 && this.items[i]) {
      const removedChild = this.items.splice(i, 1)[0];
      this.ritems.splice(i, 1);
      this.commands.splice(i, 1);
      this.remove(removedChild);
      if (i === this.selected) {
        this.select(i - 1);
      }
    }

    this.emit('remove item');
  }

  /**
   * Move selection by offset
   */
  move(offset: number): void {
    this.select(this.selected + offset);
  }

  /**
   * Move selection left
   */
  moveLeft(offset: number = 1): void {
    this.move(-offset);
  }

  /**
   * Move selection right
   */
  moveRight(offset: number = 1): void {
    this.move(offset);
  }

  /**
   * Select a tab by index
   */
  selectTab(index: number): void {
    const item = this.items[index];
    if (item) {
      if ((item as any)['_']?.cmd?.callback) {
        (item as any)['_'].cmd.callback();
      }
      this.select(index);
      if (this.screen) this.screen.emit('render');
    }
    this.emit('select tab', item, index);
  }
}