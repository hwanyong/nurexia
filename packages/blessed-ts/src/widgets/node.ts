/**
 * node.ts - base Node element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { EventEmitter } from '../utils/events';
import { Program } from '../program/program';

/**
 * Type definitions
 */
export interface NodeOptions {
  parent?: Node;
  screen?: Node;
  children?: Node[];
  [key: string]: any;
}

/**
 * Extended type for Screen to support _listenedEmitters
 */
interface ScreenNode extends Node {
  _listenedEmitters?: Node[];
}

/**
 * Node class - Base for all elements
 */
export class Node {
  /**
   * Static variables
   */
  static nodeId: number = 0;
  static idPrefix: string = 'blessed-node-';

  /**
   * Node properties
   */
  type: string = 'node';
  options: NodeOptions;
  parent: Node | null = null;
  screen: ScreenNode | null = null;
  children: Node[] = [];
  data: { [key: string]: any } = {};
  index: number = -1;
  position: { left: number; right: number; top: number; bottom: number } = {
    left: 0, right: 0, top: 0, bottom: 0
  };
  private _id: string;
  private _emitter: EventEmitter;

  /**
   * Constructor
   */
  constructor(options: NodeOptions = {}) {
    this._id = Node.idPrefix + (Node.nodeId++);
    this._emitter = new EventEmitter();
    this.options = options;

    if (options.parent) {
      this.parent = options.parent;
      if (!options.screen) {
        this.screen = this.parent.screen as ScreenNode;
      }
    }

    if (options.screen) {
      this.screen = options.screen as ScreenNode;
    }

    if (Array.isArray(options.children)) {
      options.children.forEach((child) => this.append(child));
    }
  }

  /**
   * Get node ID
   */
  get id(): string {
    return this._id;
  }

  /**
   * Set node ID
   */
  set id(value: string) {
    this._id = value;
  }

  /**
   * Append a child node
   */
  append(element: Node): void {
    if (element.parent) {
      element.unshiftEmitter();
      element.parent.remove(element);
    }

    element.parent = this;
    element.screen = this.screen;

    this.children.push(element);
    element.index = this.children.length - 1;

    element.pushEmitter();

    // Bubble up events
    const target = this;
    element._emitter.on('*', (type: string, ...args: any[]) => {
      if (type === 'newListener' || type === 'removeListener') return;
      if (target.listeners(type).length > 0) {
        target.emit(type, element, ...args);
      }
    });

    if (this.screen) {
      this.screen.emit('adopt', element);
    }

    // Notify parent of append
    this.emit('append', element);
  }

  /**
   * Push emitter to the front
   */
  pushEmitter(): void {
    if (!this.screen) return;
    if (!this.screen._listenedEmitters) {
      this.screen._listenedEmitters = [];
    }
    this.screen._listenedEmitters.push(this);
  }

  /**
   * Remove emitter from the front
   */
  unshiftEmitter(): void {
    if (!this.screen) return;
    if (!this.screen._listenedEmitters) {
      this.screen._listenedEmitters = [];
    }
    const i = this.screen._listenedEmitters.indexOf(this);
    if (i !== -1) this.screen._listenedEmitters.splice(i, 1);
  }

  /**
   * Remove a child node
   */
  remove(element: Node): void {
    if (element.parent !== this) return;

    // Find element index
    const i = this.children.indexOf(element);
    if (i === -1) return;

    element.unshiftEmitter();
    element.parent = null;
    element.screen = null;

    this.children.splice(i, 1);

    // Update indices for all siblings
    this.children.slice(i).forEach((el) => {
      el.index--;
    });

    this.emit('remove', element);
  }

  /**
   * Destroy node
   */
  destroy(): void {
    // Remove from parent
    if (this.parent) {
      this.parent.remove(this);
    }

    // Destroy children
    while (this.children.length > 0) {
      this.children[0].destroy();
    }

    // Stop all event listeners
    this.removeAllListeners();
    this._emitter.removeAllListeners();

    // Notify of destroy
    if (this.screen) {
      this.screen.emit('destroy', this);
    }

    // Clean up references
    this.parent = null;
    this.screen = null;
    this.children = [];
  }

  /**
   * Get absolute coordinates relative to the screen
   */
  absolutePosition(): { left: number; right: number; top: number; bottom: number } {
    let x = this.position.left;
    let y = this.position.top;
    let node = this.parent;

    while (node) {
      x += node.position.left;
      y += node.position.top;
      node = node.parent;
    }

    return {
      left: x,
      top: y,
      right: this.position.right,
      bottom: this.position.bottom
    };
  }

  /**
   * Add an event listener
   */
  on(event: string, listener: (...args: any[]) => void): this {
    this._emitter.on(event, listener);
    return this;
  }

  /**
   * Add a one-time event listener
   */
  once(event: string, listener: (...args: any[]) => void): this {
    this._emitter.once(event, listener);
    return this;
  }

  /**
   * Remove an event listener
   */
  off(event: string, listener: (...args: any[]) => void): this {
    this._emitter.off(event, listener);
    return this;
  }

  /**
   * Emit an event
   */
  emit(event: string, ...args: any[]): boolean {
    return this._emitter.emit(event, ...args);
  }

  /**
   * Remove all listeners for an event
   */
  removeAllListeners(event?: string): this {
    this._emitter.removeAllListeners(event);
    return this;
  }

  /**
   * Bubble an event up to the parent
   */
  bubble(event: string, ...args: any[]): boolean {
    const result = this.emit(event, ...args);
    if (this.parent) {
      this.parent.bubble(event, ...args);
    }
    return result;
  }

  /**
   * Get listeners for an event
   */
  listeners(event: string): ((...args: any[]) => void)[] {
    return this._emitter.listeners(event);
  }

  /**
   * Set user data
   */
  setData(key: string, value: any): void {
    this.data[key] = value;
  }

  /**
   * Get user data
   */
  getData(key: string): any {
    return this.data[key];
  }

  /**
   * Execute a function for each descendant node
   * @param fn The function to execute for each descendant
   * @returns boolean indicating if traversal was stopped early
   */
  forDescendants(fn: (el: Node) => boolean | void): boolean {
    let stopped = false;

    const iterate = (node: Node): boolean => {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];

        // Call the function for this child
        const ret = fn(child);

        // If the function returned false, stop traversal
        if (ret === false) {
          stopped = true;
          return false;
        }

        // Traverse this child's descendants
        if (iterate(child) === false) {
          return false;
        }
      }

      return true;
    };

    iterate(this);
    return !stopped;
  }
}