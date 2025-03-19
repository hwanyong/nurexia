/**
 * blessed-ts - Terminal Interface Program Module
 * 터미널 입출력 및 제어 시퀀스 관리
 */

import { EventEmitter } from 'events';
import { createInterface } from 'readline';

// 기본 색상 정의
const COLORS = {
  BLACK: 0,
  RED: 1,
  GREEN: 2,
  YELLOW: 3,
  BLUE: 4,
  MAGENTA: 5,
  CYAN: 6,
  WHITE: 7,
  DEFAULT: 9
};

/**
 * 프로그램 옵션 인터페이스
 */
export interface ProgramOptions {
  input?: NodeJS.ReadableStream;
  output?: NodeJS.WritableStream;
  terminal?: boolean;
  fullUnicode?: boolean;
  buffer?: boolean;
  usePty?: boolean;
  cursor?: {
    shape?: 'block' | 'underline' | 'line';
    blink?: boolean;
    color?: string;
  };
}

/**
 * Program 클래스
 * 터미널 입출력 및 제어 시퀀스 관리
 */
export class Program extends EventEmitter {
  input: NodeJS.ReadableStream;
  output: NodeJS.WritableStream;
  terminal: boolean;
  fullUnicode: boolean;
  buffer: boolean;

  // 커서 상태
  x: number = 0;
  y: number = 0;
  cursorHidden: boolean = false;
  cursorShape: string = 'block';
  cursorColor: string | null = null;
  cursorBlink: boolean = true;

  // 화면 크기
  cols: number = process.stdout.columns || 80;
  rows: number = process.stdout.rows || 24;

  constructor(options: ProgramOptions = {}) {
    super();

    this.input = options.input || process.stdin;
    this.output = options.output || process.stdout;
    this.terminal = options.terminal !== false;
    this.fullUnicode = options.fullUnicode === true;
    this.buffer = options.buffer !== false;

    // 커서 설정
    if (options.cursor) {
      if (options.cursor.shape) this.cursorShape = options.cursor.shape;
      if (options.cursor.blink !== undefined) this.cursorBlink = options.cursor.blink;
      if (options.cursor.color) this.cursorColor = options.cursor.color;
    }

    // 입력 이벤트 설정
    this._setupInput();

    // 화면 크기 이벤트 설정
    this._setupResize();
  }

  /**
   * 입력 이벤트 설정
   */
  private _setupInput(): void {
    if (!this.terminal) return;

    // 원시 모드 활성화
    this.input.setRawMode?.(true);

    // 입력 데이터 이벤트 처리
    this.input.on('data', (data: Buffer) => {
      this._parseInput(data);
    });
  }

  /**
   * 화면 크기 이벤트 설정
   */
  private _setupResize(): void {
    if (!this.terminal) return;

    // SIGWINCH 이벤트 처리 (화면 크기 변경)
    process.on('SIGWINCH', () => {
      this.cols = this.output.columns || 80;
      this.rows = this.output.rows || 24;
      this.emit('resize');
    });
  }

  /**
   * 입력 데이터 파싱
   */
  private _parseInput(data: Buffer): void {
    // ASCII 데이터 처리
    const str = data.toString('utf8');

    // 특수 키 시퀀스 파싱 (ESC 시퀀스 등)
    let key = this._parseKeySequence(str);

    // 키보드 이벤트 발생
    this.emit('keypress', str, key);
  }

  /**
   * 키 시퀀스 파싱
   */
  private _parseKeySequence(data: string): any {
    let key: any = {
      name: undefined,
      ctrl: false,
      meta: false,
      shift: false,
      sequence: data
    };

    // ESC 시퀀스 처리
    if (data === '\x1b') {
      key.name = 'escape';
      return key;
    }

    // 제어 문자 처리
    if (data <= '\x1a') {
      key.ctrl = true;
      key.name = String.fromCharCode(data.charCodeAt(0) + 'a'.charCodeAt(0) - 1);
      return key;
    }

    // 일반 문자 처리
    if (data.length === 1) {
      key.name = data;
      return key;
    }

    // ESC 시퀀스 분석
    if (data.startsWith('\x1b')) {
      // 방향키 및 기능키 처리
      if (data === '\x1b[A') key.name = 'up';
      else if (data === '\x1b[B') key.name = 'down';
      else if (data === '\x1b[C') key.name = 'right';
      else if (data === '\x1b[D') key.name = 'left';
      else if (data === '\x1b[3~') key.name = 'delete';
      else if (data === '\x1b[H') key.name = 'home';
      else if (data === '\x1b[F') key.name = 'end';
      else if (data === '\x1b[5~') key.name = 'pageup';
      else if (data === '\x1b[6~') key.name = 'pagedown';

      // F1-F12 키 처리
      else if (data === '\x1bOP') key.name = 'f1';
      else if (data === '\x1bOQ') key.name = 'f2';
      else if (data === '\x1bOR') key.name = 'f3';
      else if (data === '\x1bOS') key.name = 'f4';
      else if (data === '\x1b[15~') key.name = 'f5';
      // ... 더 많은 키 시퀀스 처리
    }

    return key;
  }

  /**
   * 출력 함수
   */
  write(data: string): void {
    this.output.write(data);
  }

  // === 커서 컨트롤 ===

  /**
   * 커서 위치로 이동
   */
  cup(y: number, x: number): void {
    this.x = x;
    this.y = y;
    this.write(`\x1b[${y + 1};${x + 1}H`);
  }

  /**
   * 커서를 위로 이동
   */
  cuu(n: number): void {
    this.y -= n;
    this.write(`\x1b[${n}A`);
  }

  /**
   * 커서를 아래로 이동
   */
  cud(n: number): void {
    this.y += n;
    this.write(`\x1b[${n}B`);
  }

  /**
   * 커서를 오른쪽으로 이동
   */
  cuf(n: number): void {
    this.x += n;
    this.write(`\x1b[${n}C`);
  }

  /**
   * 커서를 왼쪽으로 이동
   */
  cub(n: number): void {
    this.x -= n;
    this.write(`\x1b[${n}D`);
  }

  /**
   * 커서 보이기
   */
  showCursor(): void {
    this.cursorHidden = false;
    this.write('\x1b[?25h');
  }

  /**
   * 커서 숨기기
   */
  hideCursor(): void {
    this.cursorHidden = true;
    this.write('\x1b[?25l');
  }

  // === 화면 컨트롤 ===

  /**
   * 현재 위치에서 줄 삭제
   */
  el(n?: number): void {
    switch (n) {
      case 0:
        this.write('\x1b[0K'); // 커서 위치부터 라인 끝까지 삭제
        break;
      case 1:
        this.write('\x1b[1K'); // 커서 위치부터 라인 시작까지 삭제
        break;
      case 2:
        this.write('\x1b[2K'); // 전체 라인 삭제
        break;
      default:
        this.write('\x1b[K'); // 커서 위치부터 라인 끝까지 삭제
    }
  }

  /**
   * 화면 삭제
   */
  clear(): void {
    this.write('\x1b[2J');  // 전체 화면 삭제
    this.cup(0, 0);         // 커서를 원점으로 이동
  }

  /**
   * 특정 영역 삭제
   */
  eraseInDisplay(n?: number): void {
    switch (n) {
      case 0:
        this.write('\x1b[0J'); // 커서 위치부터 화면 끝까지 삭제
        break;
      case 1:
        this.write('\x1b[1J'); // 화면 시작부터 커서 위치까지 삭제
        break;
      case 2:
        this.write('\x1b[2J'); // 전체 화면 삭제
        break;
      default:
        this.write('\x1b[J'); // 커서 위치부터 화면 끝까지 삭제
    }
  }

  // === 그래픽 렌더링 ===

  /**
   * SGR (Select Graphic Rendition) 속성 설정
   */
  sgr(attr?: string): void {
    this.write(`\x1b[${attr || '0'}m`);
  }

  /**
   * 전경색 설정
   */
  setForeground(color: number | string): void {
    if (typeof color === 'number') {
      // 8색 또는 16색 모드
      if (color < 8) {
        this.write(`\x1b[3${color}m`);
      } else if (color < 16) {
        this.write(`\x1b[9${color - 8}m`);
      } else {
        // 256색 모드
        this.write(`\x1b[38;5;${color}m`);
      }
    } else if (color.startsWith('#')) {
      // RGB 색상
      const rgb = this._parseHexColor(color);
      this.write(`\x1b[38;2;${rgb.r};${rgb.g};${rgb.b}m`);
    }
  }

  /**
   * 배경색 설정
   */
  setBackground(color: number | string): void {
    if (typeof color === 'number') {
      // 8색 또는 16색 모드
      if (color < 8) {
        this.write(`\x1b[4${color}m`);
      } else if (color < 16) {
        this.write(`\x1b[10${color - 8}m`);
      } else {
        // 256색 모드
        this.write(`\x1b[48;5;${color}m`);
      }
    } else if (color.startsWith('#')) {
      // RGB 색상
      const rgb = this._parseHexColor(color);
      this.write(`\x1b[48;2;${rgb.r};${rgb.g};${rgb.b}m`);
    }
  }

  /**
   * 16진수 색상 파싱
   */
  private _parseHexColor(hex: string): { r: number, g: number, b: number } {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }
}