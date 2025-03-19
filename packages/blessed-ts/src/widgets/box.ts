/**
 * box.ts - Box 위젯 컴포넌트
 *
 * 기본적인 사각형 컨테이너 요소. 대부분의 다른 UI 요소의 기반이 됨.
 */

import { Element } from './element';
import type { ElementOptions } from '../types';

/**
 * Box 위젯 옵션 타입
 */
export interface BoxOptions extends ElementOptions {
  // 추가 Box 전용 옵션이 필요하면 여기에 추가
}

/**
 * Box 위젯 클래스
 *
 * 기본적인 사각형 컨테이너 역할을 하는 요소입니다.
 * 테두리, 배경색, 패딩 등이 적용될 수 있습니다.
 */
export class Box extends Element {
  /**
   * Box 위젯 타입
   */
  type = 'box';

  /**
   * Box 위젯 생성자
   */
  constructor(options: BoxOptions = {}) {
    super(options);
  }
}