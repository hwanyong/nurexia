/**
 * tput.ts - parse and compile terminfo caps to javascript.
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * https://github.com/chjj/blessed
 */

import * as path from 'path';
import * as fs from 'fs';
import * as cp from 'child_process';

/**
 * Type definitions
 */
export interface TputOptions {
  terminal?: string;
  term?: string;
  debug?: boolean;
  padding?: boolean;
  extended?: boolean;
  printf?: boolean;
  termcap?: boolean;
  terminfoPrefix?: string;
  terminfoFile?: string;
  termcapFile?: string;
}

interface TerminfoData {
  names: string[];
  bools: boolean[];
  numbers: number[];
  strings: string[];
  extBools: boolean[];
  extNumbers: number[];
  extStrings: string[];
}

/**
 * Tput class - Parse and compile terminfo capabilities
 */
export class Tput {
  static ipaths: string[] = [
    process.env.TERMINFO || '',
    ...(process.env.TERMINFO_DIRS || '').split(':'),
    (process.env.HOME || '') + '/.terminfo',
    '/usr/share/terminfo',
    '/usr/share/lib/terminfo',
    '/usr/lib/terminfo',
    '/usr/local/share/terminfo',
    '/usr/local/share/lib/terminfo',
    '/usr/local/lib/terminfo',
    '/usr/local/ncurses/lib/terminfo',
    '/lib/terminfo'
  ];

  options: TputOptions;
  terminal: string;
  debug?: boolean;
  padding?: boolean;
  extended?: boolean;
  printf?: boolean;
  termcap?: boolean;
  error: Error | null = null;

  terminfoPrefix?: string;
  terminfoFile?: string;
  termcapFile?: string;

  private _terminfo?: TerminfoData;

  constructor(options: TputOptions | string = {}) {
    if (typeof options === 'string') {
      options = { terminal: options };
    }

    this.options = options;
    this.terminal = (options.terminal
      || options.term
      || process.env.TERM
      || (process.platform === 'win32' ? 'windows-ansi' : 'xterm')).toLowerCase();

    this.debug = options.debug;
    this.padding = options.padding;
    this.extended = options.extended;
    this.printf = options.printf;
    this.termcap = options.termcap;

    this.terminfoPrefix = options.terminfoPrefix;
    this.terminfoFile = options.terminfoFile;
    this.termcapFile = options.termcapFile;

    if (options.terminal || options.term) {
      this.setup();
    }
  }

  /**
   * Setup terminal capabilities
   */
  setup(): void {
    this.error = null;
    try {
      if (this.termcap) {
        try {
          this.injectTermcap();
        } catch (e) {
          if (this.debug) throw e;
          this.error = new Error('Termcap parse error.');
          this._useInternalCap(this.terminal);
        }
      } else {
        try {
          this.injectTerminfo();
        } catch (e) {
          if (this.debug) throw e;
          this.error = new Error('Terminfo parse error.');
          this._useInternalInfo(this.terminal);
        }
      }
    } catch (e) {
      if (this.debug) throw e;
      this.error = new Error('Terminfo not found.');
      this._useXtermInfo();
    }
  }

  /**
   * Check if terminal type matches
   */
  term(is: string): boolean {
    return this.terminal.indexOf(is) === 0;
  }

  /**
   * Debug logging
   */
  private _debug(...args: any[]): void {
    if (!this.debug) return;
    console.log(...args);
  }

  /**
   * Fallback methods
   */
  private _useVt102Cap(): void {
    this.injectTermcap('vt102');
  }

  private _useXtermCap(): void {
    this.injectTermcap(path.join(__dirname, '../usr/xterm.termcap'));
  }

  private _useXtermInfo(): void {
    this.injectTerminfo(path.join(__dirname, '../usr/xterm'));
  }

  private _useInternalInfo(name: string): void {
    name = path.basename(name);
    this.injectTerminfo(path.join(__dirname, '../usr', name));
  }

  private _useInternalCap(name: string): void {
    name = path.basename(name);
    this.injectTermcap(path.join(__dirname, '../usr', name + '.termcap'));
  }

  /**
   * Read terminfo data
   */
  readTerminfo(term?: string): TerminfoData {
    term = term || this.terminal;
    const file = path.normalize(this._prefix(term));

    try {
      const data = fs.readFileSync(file);
      const info = this.parseTerminfo(data, file);

      if (this.debug) {
        this._terminfo = info;
      }

      return info;
    } catch (e) {
      // Return a minimal default terminfo if file not found
      if (this.debug) {
        console.error(`Failed to read terminfo file: ${file}`, e);
      }

      // Return minimal default terminfo
      return {
        names: [term],
        bools: [],
        numbers: [],
        strings: [],
        extBools: [],
        extNumbers: [],
        extStrings: []
      };
    }
  }

  /**
   * Get terminfo prefix
   */
  private _prefix(term?: string): string {
    if (term) {
      if (term.includes(path.sep)) {
        return term;
      }
      if (this.terminfoFile) {
        return this.terminfoFile;
      }
    }

    const paths = [...Tput.ipaths];

    if (this.terminfoPrefix) {
      paths.unshift(this.terminfoPrefix);
    }

    // Try exact matches
    const file = this._tprefix(paths, term);
    if (file) return file;

    // Try similar matches
    const similarFile = this._tprefix(paths, term, true);
    if (similarFile) return similarFile;

    throw new Error('Terminfo directory not found.');
  }

  /**
   * Find terminfo prefix
   */
  private _tprefix(prefix: string | string[], term?: string, soft: boolean = false): string | undefined {
    if (!prefix) return undefined;

    if (Array.isArray(prefix)) {
      for (const p of prefix) {
        const file = this._tprefix(p, term, soft);
        if (file) return file;
      }
      return undefined;
    }

    const find = (word: string): string | undefined => {
      let file: string;

      file = path.resolve(prefix, word[0]);
      try {
        fs.statSync(file);
        return file;
      } catch (e) {
        // Ignore
      }

      const ch = word[0].charCodeAt(0).toString(16).padStart(2, '0');
      file = path.resolve(prefix, ch);
      try {
        fs.statSync(file);
        return file;
      } catch (e) {
        // Ignore
      }

      return undefined;
    };

    if (!term) {
      try {
        const dir = fs.readdirSync(prefix).filter(file =>
          file.length !== 1 && !/^[0-9a-fA-F]{2}$/.test(file)
        );
        if (!dir.length) {
          return prefix;
        }
      } catch (e) {
        // Ignore
      }
      return undefined;
    }

    return find(term);
  }

  /**
   * Parse terminfo data
   */
  private parseTerminfo(data: Buffer, file: string): TerminfoData {
    const header = {
      dataSize: 0,
      headerSize: 12,
      magicNumber: 0x432,
      namesSize: 0,
      boolCount: 0,
      numCount: 0,
      strCount: 0,
      strTableSize: 0,
      extBoolCount: 0,
      extNumCount: 0,
      extStrCount: 0,
      extStrTableSize: 0
    };

    // Check magic number
    let magic = (data[1] << 8) | data[0];
    let h = header.headerSize;

    if (magic !== header.magicNumber) {
      // Try little endian
      magic = (data[0] << 8) | data[1];
      if (magic !== header.magicNumber) {
        throw new Error(`Invalid magic number in ${file}`);
      }
      h = ((data[3] << 8) | data[2]) || header.headerSize;
    } else {
      // Big endian
      h = ((data[2] << 8) | data[3]) || header.headerSize;
    }

    // Parse header
    header.namesSize = (data[5] << 8) | data[4];
    header.boolCount = (data[7] << 8) | data[6];
    header.numCount = (data[9] << 8) | data[8];
    header.strCount = (data[11] << 8) | data[10];
    header.strTableSize = (data[13] << 8) | data[12];

    // Dynamic header size
    if (h > header.headerSize) {
      header.extBoolCount = data[h - 6] | (data[h - 5] << 8);
      header.extNumCount = data[h - 4] | (data[h - 3] << 8);
      header.extStrCount = data[h - 2] | (data[h - 1] << 8);
    }

    // Calculate data size
    header.dataSize = h
      + header.namesSize
      + header.boolCount
      + header.numCount * 2
      + header.strCount * 2
      + header.strTableSize;

    if (data.length < header.dataSize) {
      throw new Error(`Truncated terminfo data in ${file}`);
    }

    // Extended data
    if (data.length > header.dataSize) {
      if (h <= header.headerSize) {
        throw new Error(`Extended terminfo data in ${file} without extended header`);
      }

      header.extStrTableSize = ((data[header.dataSize + 1] << 8) | data[header.dataSize]) || 0;
      header.dataSize += 2 + header.extBoolCount
        + header.extNumCount * 2
        + header.extStrCount * 2
        + header.extStrTableSize;
    }

    // Parse terminfo data
    const result: TerminfoData = {
      names: [],
      bools: [],
      numbers: [],
      strings: [],
      extBools: [],
      extNumbers: [],
      extStrings: []
    };

    // Parse terminal name section
    const namesEnd = h + header.namesSize - 1;
    const names = data.subarray(h, namesEnd);
    const nameStr = names.toString('utf8');
    result.names = nameStr.split('|').filter(Boolean);

    // Parse boolean flags section
    let i = 0;
    let p = h + header.namesSize;
    for (; i < header.boolCount; i++) {
      result.bools.push(data[p++] !== 0);
    }

    // Null byte alignment
    p += (header.boolCount + h + header.namesSize) % 2;

    // Parse numbers section
    for (i = 0; i < header.numCount; i++) {
      const num = data[p++] << 8 | data[p++];
      result.numbers.push(num === 0xffff ? -1 : num);
    }

    // Parse string offsets
    let stringOffsets: number[] = [];
    for (i = 0; i < header.strCount; i++) {
      const offset = data[p++] << 8 | data[p++];
      stringOffsets.push(offset);
      result.strings.push(offset === 0xffff ? '' : '');
    }

    // Parse string table
    let tableStart = p;
    for (i = 0; i < header.strCount; i++) {
      const offset = stringOffsets[i];
      if (offset === 0xffff) continue;

      let pos = tableStart + offset;
      let str = '';
      while (data[pos] !== 0) {
        str += String.fromCharCode(data[pos++]);
      }
      result.strings[i] = str;
    }

    // Parse extended sections
    if (header.extBoolCount || header.extNumCount || header.extStrCount) {
      // Skip to extended section
      p = header.dataSize - (2 + header.extBoolCount
        + header.extNumCount * 2
        + header.extStrCount * 2
        + header.extStrTableSize);

      // Skip 2 bytes for extended string table size
      p += 2;

      // Parse extended booleans
      for (i = 0; i < header.extBoolCount; i++) {
        result.extBools.push(data[p++] !== 0);
      }

      // Null byte alignment
      p += (header.extBoolCount + p) % 2;

      // Parse extended numbers
      for (i = 0; i < header.extNumCount; i++) {
        const num = data[p++] << 8 | data[p++];
        result.extNumbers.push(num === 0xffff ? -1 : num);
      }

      // Parse extended string offsets
      stringOffsets = [];
      for (i = 0; i < header.extStrCount; i++) {
        const offset = data[p++] << 8 | data[p++];
        stringOffsets.push(offset);
        result.extStrings.push(offset === 0xffff ? '' : '');
      }

      // Parse extended string table
      tableStart = p;
      for (i = 0; i < header.extStrCount; i++) {
        const offset = stringOffsets[i];
        if (offset === 0xffff) continue;

        let pos = tableStart + offset;
        let str = '';
        while (data[pos] !== 0) {
          str += String.fromCharCode(data[pos++]);
        }
        result.extStrings[i] = str;
      }
    }

    if (this.debug) {
      this._debug('Parsed terminfo for:', result.names[0]);
      this._debug('  Boolean capabilities:', result.bools.length);
      this._debug('  Numeric capabilities:', result.numbers.length);
      this._debug('  String capabilities:', result.strings.length);
      if (header.extBoolCount || header.extNumCount || header.extStrCount) {
        this._debug('  Extended Boolean capabilities:', result.extBools.length);
        this._debug('  Extended Numeric capabilities:', result.extNumbers.length);
        this._debug('  Extended String capabilities:', result.extStrings.length);
      }
    }

    return result;
  }

  /**
   * Inject termcap data
   */
  private injectTermcap(file?: string): void {
    if (!file) {
      // Find termcap file
      const _file = this.termcapFile || process.env.TERMCAP;
      if (!_file || typeof _file !== 'string' || !_file.includes(':')) {
        try {
          file = '/etc/termcap';
          fs.accessSync(file, fs.constants.R_OK);
        } catch (e) {
          file = path.resolve(__dirname, '../usr/termcap');
        }
      } else if (_file.includes('/') || _file.includes(':')) {
        file = _file;
      }
    }

    if (!file) {
      throw new Error('Could not find termcap file.');
    }

    if (file.includes(':')) {
      // TERMCAP contains the termcap data itself
      return this._parseTermcap(file, this.terminal);
    }

    // Read the termcap file
    let data: string;
    try {
      data = fs.readFileSync(file, 'utf8');
    } catch (e) {
      if (this.debug) {
        console.error('Error reading termcap file:', e);
      }
      throw new Error(`Could not read termcap file: ${file}`);
    }

    return this._parseTermcap(data, this.terminal);
  }

  /**
   * Parse termcap data
   */
  private _parseTermcap(data: string, term: string): void {
    let entries: string[];
    let entry: string | undefined;
    let names: string[];
    let name: string;
    let caps: { [key: string]: string | boolean | number } = {};

    // Remove comments and empty lines
    data = data.replace(/^#[^\n]+\n/gm, '');
    data = data.replace(/\\\n[ \t]*/g, '');

    // Split entries
    entries = data.split(/\n+/);

    // Find the terminal entry
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i].trim();
      if (!e) continue;

      // Check if entry starts with terminal name
      names = e.split('|')[0].split('|');
      for (let j = 0; j < names.length; j++) {
        name = names[j].trim();
        if (name === term) {
          entry = e;
          break;
        }
      }
      if (entry) break;
    }

    if (!entry) {
      throw new Error(`No termcap entry for ${term}`);
    }

    // Parse entry capabilities
    const parts = entry.split(':');
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i].trim();
      if (!part) continue;

      if (i === 0) {
        // Terminal names (already processed)
        continue;
      }

      // Parse capability
      const match = /^([^#=]*)([#=]?)(.*)$/.exec(part);
      if (!match) continue;

      const key = match[1];
      const type = match[2];
      const value = match[3];

      if (!key) continue;

      if (!type) {
        // Boolean capability
        caps[key] = true;
      } else if (type === '=') {
        // String capability
        caps[key] = this._unescapeTermcap(value);
      } else if (type === '#') {
        // Numeric capability
        caps[key] = parseInt(value, 10);
      }
    }

    if (this.debug) {
      this._debug('Parsed termcap entry:', term);
      this._debug('  Capabilities:', Object.keys(caps).length);
    }

    // Convert termcap to terminfo
    this._convertCapabilities(caps);
  }

  /**
   * Unescape termcap string
   */
  private _unescapeTermcap(value: string): string {
    return value
      .replace(/\\E/g, '\x1b')
      .replace(/\\e/g, '\x1b')
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\b/g, '\b')
      .replace(/\\f/g, '\f')
      .replace(/\\s/g, ' ')
      .replace(/\\0(\d\d\d)/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
      .replace(/\\0/g, '\0')
      .replace(/\\\\/g, '\\')
      .replace(/\\\^/g, '^')
      .replace(/\^(.)/g, (_, ch) => String.fromCharCode(ch.charCodeAt(0) & 31));
  }

  /**
   * Convert termcap capabilities to terminfo
   */
  private _convertCapabilities(caps: { [key: string]: string | boolean | number }): void {
    // TODO: Implement proper termcap to terminfo conversion
    // For now, we'll just assign capabilities directly
    Object.assign(this, caps);
  }

  /**
   * Inject terminfo data
   */
  private injectTerminfo(file?: string): void {
    // Read and parse terminfo data
    const info = this.readTerminfo(file);

    // Assign capabilities to Tput instance
    this._assignCapabilities(info);
  }

  /**
   * Assign capabilities from parsed terminfo to Tput instance
   */
  private _assignCapabilities(info: TerminfoData): void {
    // Standard terminfo capability names
    const boolNames = [
      'auto_left_margin', 'auto_right_margin', 'no_esc_ctlc', 'ceol_standout_glitch',
      'eat_newline_glitch', 'erase_overstrike', 'generic_type', 'hard_copy',
      'has_meta_key', 'has_status_line', 'insert_null_glitch', 'memory_above',
      'memory_below', 'move_insert_mode', 'move_standout_mode', 'over_strike',
      'status_line_esc_ok', 'dest_tabs_magic_smso', 'tilde_glitch', 'transparent_underline',
      'xon_xoff', 'needs_xon_xoff', 'prtr_silent', 'hard_cursor',
      'non_rev_rmcup', 'no_pad_char', 'non_dest_scroll_region', 'can_change',
      'back_color_erase', 'hue_lightness_saturation', 'col_addr_glitch', 'cr_cancels_micro_mode',
      'has_print_wheel', 'row_addr_glitch', 'semi_auto_right_margin', 'cpi_changes_res',
      'lpi_changes_res', 'backspaces_with_bs', 'crt_no_scrolling', 'no_correctly_working_cr',
      'gnu_has_meta_key', 'linefeed_is_newline', 'has_hardware_tabs', 'return_does_clr_eol'
    ];

    const numNames = [
      'columns', 'init_tabs', 'lines', 'lines_of_memory', 'magic_cookie_glitch',
      'padding_baud_rate', 'virtual_terminal', 'width_status_line', 'num_labels',
      'label_height', 'label_width', 'max_attributes', 'maximum_windows',
      'max_colors', 'max_pairs', 'no_color_video', 'buffer_capacity',
      'dot_vert_spacing', 'dot_horz_spacing', 'max_micro_address', 'max_micro_jump',
      'micro_col_size', 'micro_line_size', 'number_of_pins', 'output_res_char',
      'output_res_line', 'output_res_horz_inch', 'output_res_vert_inch',
      'print_rate', 'wide_char_size', 'buttons', 'bit_image_entwining',
      'bit_image_type', 'magic_cookie_glitch_ul', 'carriage_return_delay',
      'new_line_delay', 'backspace_delay', 'horizontal_tab_delay', 'number_of_function_keys'
    ];

    const strNames = [
      'back_tab', 'bell', 'carriage_return', 'change_scroll_region', 'clear_all_tabs',
      'clear_screen', 'clr_eol', 'clr_eos', 'column_address', 'command_character',
      'cursor_address', 'cursor_down', 'cursor_home', 'cursor_invisible',
      'cursor_left', 'cursor_mem_address', 'cursor_normal', 'cursor_right',
      'cursor_to_ll', 'cursor_up', 'cursor_visible', 'delete_character',
      'delete_line', 'dis_status_line', 'down_half_line', 'enter_alt_charset_mode',
      'enter_blink_mode', 'enter_bold_mode', 'enter_ca_mode', 'enter_delete_mode',
      'enter_dim_mode', 'enter_insert_mode', 'enter_secure_mode', 'enter_protected_mode',
      'enter_reverse_mode', 'enter_standout_mode', 'enter_underline_mode',
      'erase_chars', 'exit_alt_charset_mode', 'exit_attribute_mode',
      'exit_ca_mode', 'exit_delete_mode', 'exit_insert_mode', 'exit_standout_mode',
      'exit_underline_mode', 'flash_screen', 'form_feed', 'from_status_line',
      'init_1string', 'init_2string', 'init_3string', 'init_file', 'insert_character',
      'insert_line', 'insert_padding', 'key_backspace', 'key_catab', 'key_clear',
      'key_ctab', 'key_dc', 'key_dl', 'key_down', 'key_eic', 'key_eol', 'key_eos',
      'key_f0', 'key_f1', 'key_f10', 'key_f2', 'key_f3', 'key_f4', 'key_f5',
      'key_f6', 'key_f7', 'key_f8', 'key_f9', 'key_home', 'key_ic', 'key_il',
      'key_left', 'key_ll', 'key_npage', 'key_ppage', 'key_right', 'key_sf',
      'key_sr', 'key_stab', 'key_up', 'keypad_local', 'keypad_xmit', 'lab_f0',
      'lab_f1', 'lab_f10', 'lab_f2', 'lab_f3', 'lab_f4', 'lab_f5', 'lab_f6',
      'lab_f7', 'lab_f8', 'lab_f9', 'meta_off', 'meta_on', 'newline', 'pad_char',
      'parm_dch', 'parm_delete_line', 'parm_down_cursor', 'parm_ich',
      'parm_index', 'parm_insert_line', 'parm_left_cursor', 'parm_right_cursor',
      'parm_rindex', 'parm_up_cursor', 'pkey_key', 'pkey_local', 'pkey_xmit',
      'print_screen', 'prtr_off', 'prtr_on', 'repeat_char', 'reset_1string',
      'reset_2string', 'reset_3string', 'reset_file', 'restore_cursor',
      'row_address', 'save_cursor', 'scroll_forward', 'scroll_reverse',
      'set_attributes', 'set_tab', 'set_window', 'tab', 'to_status_line',
      'underline_char', 'up_half_line', 'init_prog', 'key_a1', 'key_a3',
      'key_b2', 'key_c1', 'key_c3', 'prtr_non', 'char_padding', 'acs_chars',
      'plab_norm', 'key_btab', 'enter_xon_mode', 'exit_xon_mode', 'enter_am_mode',
      'exit_am_mode', 'xon_character', 'xoff_character', 'ena_acs', 'label_on',
      'label_off', 'key_beg', 'key_cancel', 'key_close', 'key_command',
      'key_copy', 'key_create', 'key_end', 'key_enter', 'key_exit', 'key_find',
      'key_help', 'key_mark', 'key_message', 'key_move', 'key_next', 'key_open',
      'key_options', 'key_previous', 'key_print', 'key_redo', 'key_reference',
      'key_refresh', 'key_replace', 'key_restart', 'key_resume', 'key_save',
      'key_suspend', 'key_undo', 'key_sbeg', 'key_scancel', 'key_scommand',
      'key_scopy', 'key_screate', 'key_sdc', 'key_sdl', 'key_select', 'key_send',
      'key_seol', 'key_sexit', 'key_sfind', 'key_shelp', 'key_shome', 'key_sic',
      'key_sleft', 'key_smessage', 'key_smove', 'key_snext', 'key_soptions',
      'key_sprevious', 'key_sprint', 'key_sredo', 'key_sreplace', 'key_sright',
      'key_srsume', 'key_ssave', 'key_ssuspend', 'key_sundo', 'req_for_input',
      'key_f11', 'key_f12', 'key_f13', 'key_f14', 'key_f15', 'key_f16', 'key_f17',
      'key_f18', 'key_f19', 'key_f20', 'key_f21', 'key_f22', 'key_f23', 'key_f24',
      'key_f25', 'key_f26', 'key_f27', 'key_f28', 'key_f29', 'key_f30', 'key_f31',
      'key_f32', 'key_f33', 'key_f34', 'key_f35', 'key_f36', 'key_f37', 'key_f38',
      'key_f39', 'key_f40', 'key_f41', 'key_f42', 'key_f43', 'key_f44', 'key_f45',
      'key_f46', 'key_f47', 'key_f48', 'key_f49', 'key_f50', 'key_f51', 'key_f52',
      'key_f53', 'key_f54', 'key_f55', 'key_f56', 'key_f57', 'key_f58', 'key_f59',
      'key_f60', 'key_f61', 'key_f62', 'key_f63', 'clr_bol', 'clear_margins',
      'set_left_margin', 'set_right_margin', 'label_format', 'set_clock',
      'display_clock', 'remove_clock', 'create_window', 'goto_window',
      'hangup', 'dial_phone', 'quick_dial', 'tone', 'pulse', 'flash_hook',
      'fixed_pause', 'wait_tone', 'user0', 'user1', 'user2', 'user3', 'user4',
      'user5', 'user6', 'user7', 'user8', 'user9', 'orig_pair', 'orig_colors',
      'initialize_color', 'initialize_pair', 'set_color_pair', 'set_foreground',
      'set_background', 'change_char_pitch', 'change_line_pitch', 'change_res_horz',
      'change_res_vert', 'define_char', 'enter_doublewide_mode', 'enter_draft_quality',
      'enter_italics_mode', 'enter_leftward_mode', 'enter_micro_mode',
      'enter_near_letter_quality', 'enter_normal_quality', 'enter_shadow_mode',
      'enter_subscript_mode', 'enter_superscript_mode', 'enter_upward_mode',
      'exit_doublewide_mode', 'exit_italics_mode', 'exit_leftward_mode',
      'exit_micro_mode', 'exit_shadow_mode', 'exit_subscript_mode',
      'exit_superscript_mode', 'exit_upward_mode', 'micro_column_address',
      'micro_down', 'micro_left', 'micro_right', 'micro_row_address', 'micro_up',
      'order_of_pins', 'parm_down_micro', 'parm_left_micro', 'parm_right_micro',
      'parm_up_micro', 'select_char_set', 'set_bottom_margin', 'set_bottom_margin_parm',
      'set_left_margin_parm', 'set_right_margin_parm', 'set_top_margin',
      'set_top_margin_parm', 'start_bit_image', 'start_char_set_def',
      'stop_bit_image', 'stop_char_set_def', 'subscript_characters',
      'superscript_characters', 'these_cause_cr', 'zero_motion', 'char_set_names',
      'key_mouse', 'mouse_info', 'req_mouse_pos', 'get_mouse', 'set_a_foreground',
      'set_a_background', 'pkey_plab', 'device_type', 'code_set_init',
      'set0_des_seq', 'set1_des_seq', 'set2_des_seq', 'set3_des_seq',
      'set_lr_margin', 'set_tb_margin', 'bit_image_repeat', 'bit_image_newline',
      'bit_image_carriage_return', 'color_names', 'define_bit_image_region',
      'end_bit_image_region', 'set_color_band', 'set_page_length', 'display_pc_char',
      'enter_pc_charset_mode', 'exit_pc_charset_mode', 'enter_scancode_mode',
      'exit_scancode_mode', 'pc_term_options', 'scancode_escape', 'alt_scancode_esc',
      'enter_horizontal_hl_mode', 'enter_left_hl_mode', 'enter_low_hl_mode',
      'enter_right_hl_mode', 'enter_top_hl_mode', 'enter_vertical_hl_mode',
      'set_a_attributes', 'set_pglen_inch', 'termcap_init2', 'termcap_reset',
      'linefeed_if_not_lf', 'backspace_if_not_bs', 'other_non_function_keys',
      'arrow_key_map', 'acs_ulcorner', 'acs_llcorner', 'acs_urcorner',
      'acs_lrcorner', 'acs_ltee', 'acs_rtee', 'acs_btee', 'acs_ttee',
      'acs_hline', 'acs_vline', 'acs_plus', 'memory_lock', 'memory_unlock',
      'box_chars_1'
    ];

    // Assign boolean capabilities
    for (let i = 0; i < boolNames.length && i < info.bools.length; i++) {
      if (info.bools[i]) {
        (this as any)[boolNames[i]] = true;
      }
    }

    // Assign numeric capabilities
    for (let i = 0; i < numNames.length && i < info.numbers.length; i++) {
      if (info.numbers[i] !== -1) {
        (this as any)[numNames[i]] = info.numbers[i];
      }
    }

    // Assign string capabilities
    for (let i = 0; i < strNames.length && i < info.strings.length; i++) {
      if (info.strings[i]) {
        (this as any)[strNames[i]] = info.strings[i];
      }
    }

    // Handle extended capabilities if available
    if (info.extBools.length > 0 || info.extNumbers.length > 0 || info.extStrings.length > 0) {
      // Extended capabilities would need their names
      // For now, we'll just assign them as ext0, ext1, etc.
      for (let i = 0; i < info.extBools.length; i++) {
        if (info.extBools[i]) {
          (this as any)[`ext_bool_${i}`] = true;
        }
      }

      for (let i = 0; i < info.extNumbers.length; i++) {
        if (info.extNumbers[i] !== -1) {
          (this as any)[`ext_num_${i}`] = info.extNumbers[i];
        }
      }

      for (let i = 0; i < info.extStrings.length; i++) {
        if (info.extStrings[i]) {
          (this as any)[`ext_str_${i}`] = info.extStrings[i];
        }
      }
    }

    if (this.debug) {
      this._debug('Assigned capabilities from terminfo:', info.names[0]);
    }
  }
}