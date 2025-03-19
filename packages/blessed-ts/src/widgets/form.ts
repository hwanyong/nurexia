/**
 * form.ts - form element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { Box, BoxOptions } from './box';
import { NodeType } from '../types';
import { Node } from './node';

/**
 * Form options interface
 */
export interface FormOptions extends BoxOptions {
  /**
   * Whether to auto-focus the next element on Enter
   */
  autoNext?: boolean;

  /**
   * Enable VI navigation keys (j/k)
   */
  vi?: boolean;

  /**
   * Enable keyboard navigation
   */
  keys?: boolean;
}

/**
 * Type for form element with additional properties needed for form functionality
 */
type FormElement = Box & {
  value?: any;
  name?: string;
  keyable?: boolean;
  visible?: boolean;
  focus?: () => void; // Override the Box focus method
  clearInput?: () => void;
  select?: (index: number) => void;
  uncheck?: () => void;
  setProgress?: (val: number) => void;
  refresh?: (dir: string) => void;
  write?: (text: string) => void;
  options?: {
    cwd?: string;
    [key: string]: any;
  };
};

/**
 * Form Class - Container for form elements
 */
export class Form extends Box {
  /**
   * Form specific properties
   */
  type: NodeType = 'form';
  submission: Record<string, any> | null = null;
  private _selected: FormElement | null = null;
  private _children: FormElement[] | null = null;
  private autoNext: boolean;
  private vi: boolean;

  /**
   * Form constructor
   */
  constructor(options: FormOptions = {}) {
    // Forms should ignore keys by default to let elements handle them
    options.ignoreKeys = true;
    super(options);

    this.autoNext = options.autoNext || false;
    this.vi = options.vi || false;

    if (options.keys) {
      this.setupKeys();
    }
  }

  /**
   * Set up key event handling
   */
  private setupKeys(): void {
    // Get the screen to listen for keys for this form
    (this.screen as any)._listenKeys?.(this);

    this.on('element keypress', (el: FormElement, ch: string, key: any) => {
      if ((key.name === 'tab' && !key.shift)
          || ((el.type as string) === 'textbox' && this.autoNext && key.name === 'enter')
          || key.name === 'down'
          || (this.vi && key.name === 'j')) {
        if ((el.type as string) === 'textbox' || (el.type as string) === 'textarea') {
          if (key.name === 'j') return;
          if (key.name === 'tab') {
            // Workaround, since we can't stop the tab from being added.
            el.emit('keypress', null, { name: 'backspace' });
          }
          el.emit('keypress', '\x1b', { name: 'escape' });
        }
        this.focusNext();
        return;
      }

      if ((key.name === 'tab' && key.shift)
          || key.name === 'up'
          || (this.vi && key.name === 'k')) {
        if ((el.type as string) === 'textbox' || (el.type as string) === 'textarea') {
          if (key.name === 'k') return;
          el.emit('keypress', '\x1b', { name: 'escape' });
        }
        this.focusPrevious();
        return;
      }

      if (key.name === 'escape') {
        this.focus();
        return;
      }
    });
  }

  /**
   * Refresh the internal list of focusable children
   * @private
   */
  _refresh(): void {
    // Only rebuild the list if it doesn't exist
    if (!this._children) {
      const out: FormElement[] = [];

      const collectFocusableElements = (el: Node) => {
        const element = el as FormElement;
        if (element.keyable) out.push(element);
        (el.children || []).forEach(collectFocusableElements);
      };

      this.children.forEach(collectFocusableElements);

      this._children = out;
    }
  }

  /**
   * Check if there are any visible focusable elements
   * @private
   */
  _visible(): boolean {
    if (!this._children) return false;
    return this._children.some(el => el.visible);
  }

  /**
   * Get the next focusable element
   */
  next(): FormElement | null {
    this._refresh();

    if (!this._visible()) return null;

    if (!this._selected) {
      this._selected = this._children?.[0] || null;
      if (!this._selected?.visible) return this.next();
      if ((this.screen as any).focused !== this._selected) return this._selected;
    }

    const i = this._children?.indexOf(this._selected) || -1;
    if (i === -1 || !this._children?.[i + 1]) {
      this._selected = this._children?.[0] || null;
      if (!this._selected?.visible) return this.next();
      return this._selected;
    }

    this._selected = this._children?.[i + 1] || null;
    if (!this._selected?.visible) return this.next();
    return this._selected;
  }

  /**
   * Get the previous focusable element
   */
  previous(): FormElement | null {
    this._refresh();

    if (!this._visible()) return null;

    if (!this._selected) {
      this._selected = this._children?.[this._children.length - 1] || null;
      if (!this._selected?.visible) return this.previous();
      if ((this.screen as any).focused !== this._selected) return this._selected;
    }

    const i = this._children?.indexOf(this._selected) || -1;
    if (i === -1 || !this._children?.[i - 1]) {
      this._selected = this._children?.[this._children.length - 1] || null;
      if (!this._selected?.visible) return this.previous();
      return this._selected;
    }

    this._selected = this._children?.[i - 1] || null;
    if (!this._selected?.visible) return this.previous();
    return this._selected;
  }

  /**
   * Focus the next element
   */
  focusNext(): void {
    const next = this.next();
    if (next && next.focus) next.focus();
  }

  /**
   * Focus the previous element
   */
  focusPrevious(): void {
    const previous = this.previous();
    if (previous && previous.focus) previous.focus();
  }

  /**
   * Reset the selected element
   */
  resetSelected(): void {
    this._selected = null;
  }

  /**
   * Focus the first element
   */
  focusFirst(): void {
    this.resetSelected();
    this.focusNext();
  }

  /**
   * Focus the last element
   */
  focusLast(): void {
    this.resetSelected();
    this.focusPrevious();
  }

  /**
   * Submit the form
   */
  submit(): Record<string, any> {
    const out: Record<string, any> = {};

    const collectValues = (el: Node) => {
      const element = el as FormElement;
      if (element.value != null) {
        const name = element.name || element.type;
        if (Array.isArray(out[name])) {
          out[name].push(element.value);
        } else if (out[name]) {
          out[name] = [out[name], element.value];
        } else {
          out[name] = element.value;
        }
      }
      (el.children || []).forEach(collectValues);
    };

    this.children.forEach(collectValues);

    this.emit('submit', out);

    return this.submission = out;
  }

  /**
   * Cancel the form
   */
  cancel(): void {
    this.emit('cancel');
  }

  /**
   * Reset the form elements
   */
  reset(): void {
    const resetElement = (el: Node) => {
      const element = el as FormElement;
      const elementType = element.type as string;

      switch (elementType) {
        case 'screen':
        case 'box':
        case 'text':
        case 'line':
        case 'scrollable-box':
          break;
        case 'list':
          element.select?.(0);
          return;
        case 'form':
          break;
        case 'input':
          break;
        case 'textbox':
        case 'textarea':
          element.clearInput?.();
          return;
        case 'button':
          delete element.value;
          break;
        case 'progress-bar':
          element.setProgress?.(0);
          break;
        case 'file-manager':
          if (element.options?.cwd) {
            element.refresh?.(element.options.cwd);
          }
          return;
        case 'checkbox':
          element.uncheck?.();
          return;
        case 'radio-set':
          break;
        case 'radio-button':
          element.uncheck?.();
          return;
        case 'prompt':
        case 'question':
        case 'message':
        case 'info':
        case 'loading':
          break;
        case 'list-bar':
          //element.select?.(0);
          break;
        case 'dir-manager':
          if (element.options?.cwd) {
            element.refresh?.(element.options.cwd);
          }
          return;
        case 'terminal':
          element.write?.('');
          return;
        case 'image':
          //element.clearImage?.();
          return;
      }
      (el.children || []).forEach(resetElement);
    };

    this.children.forEach(resetElement);

    this.emit('reset');
  }
}