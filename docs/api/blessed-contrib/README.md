# blessed-contrib API Documentation

This documentation provides a comprehensive reference for the blessed-contrib library (version 4.11.0), a collection of terminal interface widgets and utilities that extend the blessed terminal interface library.

## Overview

blessed-contrib provides a set of high-level widgets for creating dashboards, charts, and other visualizations in the terminal. It builds on top of the blessed library to offer more complex UI components.

## Table of Contents

1. [Installation](#installation)
2. [Basic Usage](#basic-usage)
3. [Layouts](#layouts)
   - [Grid](#grid)
   - [Carousel](#carousel)
4. [Widgets](#widgets)
   - [Charts](#charts)
   - [Maps](#maps)
   - [Other Widgets](#other-widgets)
5. [Utils](#utils)

## Installation

```bash
npm install blessed blessed-contrib
```

## Basic Usage

```javascript
const blessed = require('blessed');
const contrib = require('blessed-contrib');

// Create a screen object
const screen = blessed.screen();

// Create a grid
const grid = new contrib.grid({
  rows: 12,
  cols: 12,
  screen: screen
});

// Add a line chart
const line = grid.set(0, 0, 6, 6, contrib.line, {
  style: { line: "yellow", text: "green", baseline: "black" },
  xLabelPadding: 3,
  xPadding: 5,
  label: 'Network Latency (ms)'
});

// Render the screen
screen.render();
```

For detailed information on each component, refer to the specific documentation sections.

## Component Documentation

- [Layouts](./layouts/README.md)
- [Widgets](./widgets/README.md)
- [Utils](./utils/README.md)