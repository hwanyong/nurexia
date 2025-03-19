/**
 * events.ts - event emitter for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/chjj/blessed
 */

/**
 * Type definitions
 */
type EventHandler = (...args: any[]) => any;
type EventHandlerWithListener = EventHandler & { listener?: EventHandler };
type EventHandlers = EventHandler | EventHandler[];

interface Events {
  [type: string]: EventHandlers;
}

/**
 * EventEmitter class
 */
export class EventEmitter {
  protected _events: Events = {};
  protected _maxListeners?: number;
  type?: string;
  parent?: EventEmitter;

  /**
   * Set the maximum number of listeners
   */
  setMaxListeners(n: number): void {
    this._maxListeners = n;
  }

  /**
   * Add a listener for a given event type
   */
  addListener(type: string, listener: EventHandler): this {
    if (!this._events[type]) {
      this._events[type] = listener;
    } else if (typeof this._events[type] === 'function') {
      this._events[type] = [this._events[type] as EventHandler, listener];
    } else {
      (this._events[type] as EventHandler[]).push(listener);
    }
    this._emit('newListener', [type, listener]);
    return this;
  }

  /**
   * Alias for addListener
   */
  on(type: string, listener: EventHandler): this {
    return this.addListener(type, listener);
  }

  /**
   * Remove a listener for a given event type
   */
  removeListener(type: string, listener: EventHandler): this {
    const handler = this._events[type];
    if (!handler) return this;

    if (typeof handler === 'function' || (Array.isArray(handler) && handler.length === 1)) {
      delete this._events[type];
      this._emit('removeListener', [type, listener]);
      return this;
    }

    if (Array.isArray(handler)) {
      for (let i = 0; i < handler.length; i++) {
        const currentHandler = handler[i] as EventHandlerWithListener;
        if (currentHandler === listener || currentHandler.listener === listener) {
          handler.splice(i, 1);
          this._emit('removeListener', [type, listener]);
          break;
        }
      }
    }

    return this;
  }

  /**
   * Alias for removeListener
   */
  off(type: string, listener: EventHandler): this {
    return this.removeListener(type, listener);
  }

  /**
   * Remove all listeners for a given event type
   */
  removeAllListeners(type?: string): this {
    if (type) {
      delete this._events[type];
    } else {
      this._events = {};
    }
    return this;
  }

  /**
   * Add a one-time listener for a given event type
   */
  once(type: string, listener: EventHandler): this {
    const on: EventHandlerWithListener = (...args: any[]) => {
      this.removeListener(type, on);
      return listener.apply(this, args);
    };
    on.listener = listener;
    return this.on(type, on);
  }

  /**
   * Get array of listeners for a given event type
   */
  listeners(type: string): EventHandler[] {
    const handler = this._events[type];
    if (!handler) return [];
    return typeof handler === 'function' ? [handler] : [...handler];
  }

  /**
   * Internal emit method
   */
  protected _emit(type: string, args: any[]): boolean {
    const handler = this._events[type];

    if (!handler) {
      if (type === 'error') {
        throw args[0];
      }
      return true;
    }

    if (typeof handler === 'function') {
      return handler.apply(this, args) !== false;
    }

    let ret = true;
    for (const fn of handler) {
      if (fn.apply(this, args) === false) {
        ret = false;
      }
    }

    return ret;
  }

  /**
   * Emit an event
   */
  emit(type: string, ...args: any[]): boolean {
    const params = [type, ...args];
    const el = this;

    this._emit('event', params);

    if (this.type === 'screen') {
      return this._emit(type, args);
    }

    if (this._emit(type, args) === false) {
      return false;
    }

    const elementType = 'element ' + type;
    args.unshift(this);

    let currentEl: EventEmitter | undefined = el;
    do {
      if (!currentEl._events[elementType]) continue;
      if (currentEl._emit(elementType, args) === false) {
        return false;
      }
    } while (currentEl = currentEl.parent);

    return true;
  }
}

// Export both the class and a named export for compatibility
export default EventEmitter;