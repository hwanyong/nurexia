/**
 * System Monitor Modal Component
 */

import blessed from 'blessed';
import blessedContrib from 'blessed-contrib';

// Create a modal version of the system monitor that can be toggled
export const createSystemMonitorModal = (screen: blessed.Widgets.Screen) => {
  const systemMonitorModal = blessedContrib.line({
    top: 'center',
    left: 'center',
    width: 50,
    height: 15,
    border: {
      type: 'line'
    },
    style: {
      line: "yellow",
      text: "green",
      baseline: "black"
    },
    label: ' System Monitor ',
    xLabelPadding: 3,
    xPadding: 5,
    showLegend: true,
    wholeNumbersOnly: false,
    // Make the modal draggable
    draggable: true,
    hidden: true // Hidden by default
  });

  // System Monitor dummy data
  const systemMonitorData = [{
    title: 'CPU Usage',
    x: ['t1', 't2', 't3', 't4'],
    y: [5, 1, 7, 5],
    style: {
      line: 'red'
    }
  }, {
    title: 'Memory Usage',
    x: ['t1', 't2', 't3', 't4'],
    y: [2, 4, 9, 8],
    style: { line: 'yellow' }
  }, {
    title: 'Disk Usage',
    x: ['t1', 't2', 't3', 't4'],
    y: [22, 7, 12, 1],
    style: { line: 'blue' }
  }];

  // Set initial data
  systemMonitorModal.setData(systemMonitorData);

  // Function to toggle the system monitor modal
  const toggleSystemMonitorModal = () => {
    // Toggle visibility
    systemMonitorModal.hidden = !systemMonitorModal.hidden;

    // When shown, bring to front and set the latest data
    if (!systemMonitorModal.hidden) {
      systemMonitorModal.setFront();
      systemMonitorModal.setData(systemMonitorData);
      systemMonitorModal.focus();
    }

    screen.render();
  };

  return {
    modal: systemMonitorModal,
    toggle: toggleSystemMonitorModal,
    updateData: (data: any) => {
      systemMonitorModal.setData(data);
      screen.render();
    }
  };
};