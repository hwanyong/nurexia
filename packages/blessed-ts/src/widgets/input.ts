/**
 * input.ts - input element for blessed-ts
 * Copyright (c) 2013-2015, Christopher Jeffrey and contributors (MIT License).
 * Copyright (c) 2025 blessed-ts contributors (MIT License).
 */

import { Textarea, TextareaOptions } from './textarea';
import { NodeType } from '../types';

/**
 * Input options interface
 */
export interface InputOptions extends TextareaOptions {
  // Input 특유의 옵션 추가 가능
}

/**
 * Input Class - Single-line input widget
 */
export class Input extends Textarea {
  /**
   * Input specific properties
   */
  type: NodeType = 'input';

  /**
   * Input constructor
   */
  constructor(options: InputOptions = {}) {
    super(options);
  }

  /**
   * 키 이벤트 리스너 오버라이드 - 싱글라인으로 제한
   */
  _listener(ch: string, key: any): void {
    // 엔터 키 입력 시 제출 처리 (Textarea와 다른 동작)
    if (key.name === 'enter' || key.name === 'return') {
      if (this._done) {
        return this._done(null, this.value);
      }
      return;
    }

    // 줄바꿈 문자는 무시
    if (ch === '\n' || ch === '\r' || ch === '\r\n') {
      return;
    }

    // 나머지는 Textarea의 리스너를 사용
    super._listener(ch, key);
  }

  /**
   * 값 설정 시 줄바꿈 문자 제거
   */
  setValue(value?: string): this {
    if (value != null) {
      // 줄바꿈 문자 제거
      value = value.replace(/\n/g, '');
    }
    return super.setValue(value);
  }
}