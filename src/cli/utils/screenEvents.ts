/**
 * Screen Event Handlers
 */

import blessed from 'blessed';

/**
 * Configure screen event handlers
 * @param screen The blessed screen instance
 * @param callbacks Object containing callback functions for various events
 */
export const setupScreenEvents = (
  screen: blessed.Widgets.Screen,
  callbacks: {
    onExit?: () => void;
    onSystemMonitorToggle?: () => void;
    [key: string]: any;
  }
): void => {

  // Quit on Control-C
  screen.key(['C-c'], () => {
    if (callbacks.onExit) {
      callbacks.onExit();
    } else {
      process.exit(0);
    }
  });

  // F10 key toggles the system monitor modal
  screen.key(['f10'], () => {
    if (callbacks.onSystemMonitorToggle) {
      callbacks.onSystemMonitorToggle();
    }
  });

  // Add more key handlers as needed
};