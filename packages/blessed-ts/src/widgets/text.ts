/**
 * text.ts - Text 위젯 컴포넌트
 *
 * 간단한 텍스트 표시 요소. 자동으로 크기가 조절되는 특성을 가짐.
 */

import { Element } from './element';
import type { ElementOptions } from '../types';

/**
 * Text 위젯 옵션 타입
 */
export interface TextOptions extends ElementOptions {
  // Text 전용 옵션이 필요하면 여기에 추가
  content?: string;
}

/**
 * Text 위젯 클래스
 *
 * 텍스트를 표시하는 단순한 요소입니다.
 * 기본적으로 컨텐츠 크기에 맞게 자동으로 크기가 조절됩니다.
 */
export class Text extends Element {
  /**
   * Text 위젯 타입
   */
  type = 'text';

  /**
   * Text 위젯 생성자
   */
  constructor(options: TextOptions = {}) {
    // Text 위젯은 기본적으로 축소 옵션 활성화
    options.shrink = options.shrink !== false;
    super(options);

    // 초기 컨텐츠 설정
    if (options.content) {
      this.setContent(options.content);
    }
  }
}