/**
 * colors.ts - color-related functions for blessed-ts.
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 *
 * TypeScript implementation of the colors.js module from blessed
 */

/**
 * Type definitions
 */
export type RGB = [number, number, number];
export type ColorValue = number | string | RGB;

interface ColorCache {
  [key: number]: number;
}

/**
 * Match an RGB color to the closest terminal color
 */
export function match(r1: number | string | RGB, g1?: number, b1?: number): number {
  if (typeof r1 === 'string') {
    const hex = r1;
    if (hex[0] !== '#') {
      return -1;
    }
    const rgb = hexToRGB(hex);
    r1 = rgb[0];
    g1 = rgb[1];
    b1 = rgb[2];
  } else if (Array.isArray(r1)) {
    b1 = r1[2];
    g1 = r1[1];
    r1 = r1[0];
  }

  if (g1 === undefined || b1 === undefined) {
    return -1;
  }

  const hash = (r1 << 16) | (g1 << 8) | b1;

  if (_cache[hash] != null) {
    return _cache[hash];
  }

  let ldiff = Infinity;
  let li = -1;
  let i = 0;
  let c: RGB;
  let r2: number;
  let g2: number;
  let b2: number;
  let diff: number;

  for (; i < vcolors.length; i++) {
    c = vcolors[i];
    r2 = c[0];
    g2 = c[1];
    b2 = c[2];

    diff = colorDistance(r1, g1, b1, r2, g2, b2);

    if (diff === 0) {
      li = i;
      break;
    }

    if (diff < ldiff) {
      ldiff = diff;
      li = i;
    }
  }

  return (_cache[hash] = li);
}

/**
 * Convert RGB values to hex color string
 */
export function RGBToHex(r: number | RGB, g?: number, b?: number): string {
  if (Array.isArray(r)) {
    b = r[2];
    g = r[1];
    r = r[0];
  }

  if (g === undefined || b === undefined) {
    throw new Error('Invalid RGB values');
  }

  function hex(n: number): string {
    let h = n.toString(16);
    if (h.length < 2) h = '0' + h;
    return h;
  }

  return '#' + hex(r) + hex(g) + hex(b);
}

/**
 * Convert hex color string to RGB values
 */
export function hexToRGB(hex: string): RGB {
  if (hex.length === 4) {
    hex = hex[0]
      + hex[1] + hex[1]
      + hex[2] + hex[2]
      + hex[3] + hex[3];
  }

  const col = parseInt(hex.substring(1), 16);
  const r = (col >> 16) & 0xff;
  const g = (col >> 8) & 0xff;
  const b = col & 0xff;

  return [r, g, b];
}

/**
 * Calculate the color distance between two RGB colors
 *
 * As it happens, comparing how similar two colors are is really hard. Here is
 * one of the simplest solutions, which doesn't require conversion to another
 * color space, posted on stackoverflow[1]. Maybe someone better at math can
 * propose a superior solution.
 * [1] http://stackoverflow.com/questions/1633828
 */
function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
  return Math.pow(30 * (r1 - r2), 2)
    + Math.pow(59 * (g1 - g2), 2)
    + Math.pow(11 * (b1 - b2), 2);
}

/**
 * Mix two terminal colors
 *
 * This might work well enough for a terminal's colors: treat RGB as XYZ in a
 * 3-dimensional space and go midway between the two points.
 */
export function mixColors(c1: number, c2: number, alpha?: number): number {
  if (c1 === 0x1ff) c1 = 0;
  if (c2 === 0x1ff) c2 = 0;
  if (alpha == null) alpha = 0.5;

  const rgb1 = vcolors[c1];
  let r1 = rgb1[0];
  let g1 = rgb1[1];
  let b1 = rgb1[2];

  const rgb2 = vcolors[c2];
  const r2 = rgb2[0];
  const g2 = rgb2[1];
  const b2 = rgb2[2];

  r1 += ((r2 - r1) * alpha) | 0;
  g1 += ((g2 - g1) * alpha) | 0;
  b1 += ((b2 - b1) * alpha) | 0;

  return match([r1, g1, b1]);
}

/**
 * Blend two attributes
 */
export function blend(attr: number, attr2?: number, alpha?: number): number {
  let name: string | undefined;
  let i: number;
  let c: RGB;
  let nc: RGB;

  let bg = attr & 0x1ff;
  if (attr2 != null) {
    let bg2 = attr2 & 0x1ff;
    if (bg === 0x1ff) bg = 0;
    if (bg2 === 0x1ff) bg2 = 0;
    bg = mixColors(bg, bg2, alpha);
  } else {
    if (blend._cache[bg] != null) {
      bg = blend._cache[bg];
    } else if (bg >= 8 && bg <= 15) {
      bg -= 8;
    } else {
      name = ncolors[bg];
      if (name) {
        for (i = 0; i < ncolors.length; i++) {
          if (name === ncolors[i] && i !== bg) {
            c = vcolors[bg];
            nc = vcolors[i];
            if (nc[0] + nc[1] + nc[2] < c[0] + c[1] + c[2]) {
              blend._cache[bg] = i;
              bg = i;
              break;
            }
          }
        }
      }
    }
  }

  attr &= ~0x1ff;
  attr |= bg;

  let fg = (attr >> 9) & 0x1ff;
  if (attr2 != null) {
    let fg2 = (attr2 >> 9) & 0x1ff;
    if (fg === 0x1ff) {
      // XXX workaround
      fg = 248;
    } else {
      if (fg === 0x1ff) fg = 7;
      if (fg2 === 0x1ff) fg2 = 7;
      fg = mixColors(fg, fg2, alpha);
    }
  } else {
    if (blend._cache[fg] != null) {
      fg = blend._cache[fg];
    } else if (fg >= 8 && fg <= 15) {
      fg -= 8;
    } else {
      name = ncolors[fg];
      if (name) {
        for (i = 0; i < ncolors.length; i++) {
          if (name === ncolors[i] && i !== fg) {
            c = vcolors[fg];
            nc = vcolors[i];
            if (nc[0] + nc[1] + nc[2] < c[0] + c[1] + c[2]) {
              blend._cache[fg] = i;
              fg = i;
              break;
            }
          }
        }
      }
    }
  }

  attr &= ~(0x1ff << 9);
  attr |= fg << 9;

  return attr;
}

// Cache object for blend function
blend._cache = {} as ColorCache;

// Cache object for match function
const _cache: ColorCache = {};

/**
 * Reduce a color value to fit within a smaller color range
 */
export function reduce(color: number, total: number): number {
  if (color >= 16 && total <= 16) {
    color = ccolors[color];
  } else if (color >= 8 && total <= 8) {
    color -= 8;
  } else if (color >= 2 && total <= 2) {
    color %= 2;
  }
  return color;
}

/**
 * XTerm Colors
 * These were actually tough to track down. The xterm source only uses color
 * keywords. The X11 source needed to be examined to find the actual values.
 * They then had to be mapped to rgb values and then converted to hex values.
 */
export const xterm = [
  '#000000', // black
  '#cd0000', // red3
  '#00cd00', // green3
  '#cdcd00', // yellow3
  '#0000ee', // blue2
  '#cd00cd', // magenta3
  '#00cdcd', // cyan3
  '#e5e5e5', // gray90
  '#7f7f7f', // gray50
  '#ff0000', // red
  '#00ff00', // green
  '#ffff00', // yellow
  '#5c5cff', // rgb:5c/5c/ff
  '#ff00ff', // magenta
  '#00ffff', // cyan
  '#ffffff'  // white
];

/**
 * Seed all 256 colors. Assume xterm defaults.
 * Ported from the xterm color generation script.
 */
export const colors: string[] = (function () {
  const cols: string[] = [];
  const _cols: RGB[] = [];
  let r: number;
  let g: number;
  let b: number;
  let i: number;
  let l: number;

  function hex(n: number): string {
    const h = n.toString(16);
    if (h.length < 2) return '0' + h;
    return h;
  }

  function push(i: number, r: number, g: number, b: number): void {
    cols[i] = '#' + hex(r) + hex(g) + hex(b);
    _cols[i] = [r, g, b];
  }

  // 0 - 15
  xterm.forEach((c, i) => {
    const col = parseInt(c.substring(1), 16);
    push(i, (col >> 16) & 0xff, (col >> 8) & 0xff, col & 0xff);
  });

  // 16 - 231
  for (r = 0; r < 6; r++) {
    for (g = 0; g < 6; g++) {
      for (b = 0; b < 6; b++) {
        i = 16 + (r * 36) + (g * 6) + b;
        push(i,
          r ? (r * 40 + 55) : 0,
          g ? (g * 40 + 55) : 0,
          b ? (b * 40 + 55) : 0);
      }
    }
  }

  // 232 - 255 are grey.
  for (g = 0; g < 24; g++) {
    l = (g * 10) + 8;
    i = 232 + g;
    push(i, l, l, l);
  }

  // Export vcolors (RGB values)
  vcolors = _cols;

  return cols;
})();

/**
 * RGB values for each of the 256 colors
 */
export let vcolors: RGB[];

/**
 * Map higher colors to the first 8 colors.
 * This allows translation of high colors to low colors on 8-color terminals.
 */
export const ccolors: Record<number, number> = (function() {
  const _cols = vcolors.slice();
  const cols = colors.slice();
  let out: number[];

  // Temporarily reduce to 8 colors for mapping
  vcolors = vcolors.slice(0, 8);

  // Map 256 colors to 8 colors
  out = cols.map(c => match(c));

  // Restore original colors
  colors.length = 0;
  cols.forEach((c, i) => colors[i] = c);
  vcolors = _cols;

  return out as unknown as Record<number, number>;
})();

/**
 * Color name to color code mapping
 */
export const colorNames: Record<string, number> = {
  // special
  default: -1,
  normal: -1,
  bg: -1,
  fg: -1,
  // normal
  black: 0,
  red: 1,
  green: 2,
  yellow: 3,
  blue: 4,
  magenta: 5,
  cyan: 6,
  white: 7,
  // light
  lightblack: 8,
  lightred: 9,
  lightgreen: 10,
  lightyellow: 11,
  lightblue: 12,
  lightmagenta: 13,
  lightcyan: 14,
  lightwhite: 15,
  // bright
  brightblack: 8,
  brightred: 9,
  brightgreen: 10,
  brightyellow: 11,
  brightblue: 12,
  brightmagenta: 13,
  brightcyan: 14,
  brightwhite: 15,
  // alternate spellings
  grey: 8,
  gray: 8,
  lightgrey: 7,
  lightgray: 7,
  brightgrey: 7,
  brightgray: 7
};

/**
 * Convert a color value to a color code
 */
export function convert(color: ColorValue): number {
  if (typeof color === 'number') {
    // Already a color code
    return color;
  } else if (typeof color === 'string') {
    color = color.replace(/[\- ]/g, '');
    if (colorNames[color] != null) {
      color = colorNames[color];
    } else {
      color = match(color);
    }
  } else if (Array.isArray(color)) {
    color = match(color);
  } else {
    color = -1;
  }
  return color !== -1 ? color : 0x1ff;
}

// Color name mapping data
type ColorRange = number | [number, number];
interface ColorMapping {
  [key: string]: ColorRange[];
}

const colorMapping: ColorMapping = {
  blue: [
    4,
    12,
    [17, 21],
    [24, 27],
    [31, 33],
    [38, 39],
    45,
    [54, 57],
    [60, 63],
    [67, 69],
    [74, 75],
    81,
    [91, 93],
    [97, 99],
    [103, 105],
    [110, 111],
    117,
    [128, 129],
    [134, 135],
    [140, 141],
    [146, 147],
    153,
    165,
    171,
    177,
    183,
    189
  ],

  green: [
    2,
    10,
    22,
    [28, 29],
    [34, 36],
    [40, 43],
    [46, 50],
    [64, 65],
    [70, 72],
    [76, 79],
    [82, 86],
    [106, 108],
    [112, 115],
    [118, 122],
    [148, 151],
    [154, 158],
    [190, 194]
  ],

  cyan: [
    6,
    14,
    23,
    30,
    37,
    44,
    51,
    66,
    73,
    80,
    87,
    109,
    116,
    123,
    152,
    159,
    195
  ],

  red: [
    1,
    9,
    52,
    [88, 89],
    [94, 95],
    [124, 126],
    [130, 132],
    [136, 138],
    [160, 163],
    [166, 169],
    [172, 175],
    [178, 181],
    [196, 200],
    [202, 206],
    [208, 212],
    [214, 218],
    [220, 224]
  ],

  magenta: [
    5,
    13,
    53,
    90,
    96,
    127,
    133,
    139,
    164,
    170,
    176,
    182,
    201,
    207,
    213,
    219,
    225
  ],

  yellow: [
    3,
    11,
    58,
    [100, 101],
    [142, 144],
    [184, 187],
    [226, 230]
  ],

  black: [
    0,
    8,
    16,
    59,
    102,
    [232, 243]
  ],

  white: [
    7,
    15,
    145,
    188,
    231,
    [244, 255]
  ]
};

/**
 * Map of color codes to color names
 */
export const ncolors: string[] = [];

// Process the color mapping
Object.keys(colorMapping).forEach((name) => {
  colorMapping[name].forEach((offset) => {
    if (typeof offset === 'number') {
      ncolors[offset] = name;
      ccolors[offset] = colorNames[name];
      return;
    }

    for (let i = offset[0], l = offset[1]; i <= l; i++) {
      ncolors[i] = name;
      ccolors[i] = colorNames[name];
    }
  });
});