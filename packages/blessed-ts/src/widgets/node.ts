/**
 * blessed-ts - A TypeScript implementation of the blessed terminal library
 * Node Class - 기본 UI 노드 요소
 */

import { EventEmitter } from 'events';
import type { Node as NodeInterface, NodeOptions, Position, Screen, Style } from '../types';

/**
 * 노드 클래스 - 모든 UI 요소의 기본 클래스
 */
export class Node extends EventEmitter implements NodeInterface {
  type: string = 'node';
  name: string;
  parent: NodeInterface | null = null;
  screen: Screen;
  children: NodeInterface[] = [];
  data: any = {};
  index: number = 0;
  position: Position = { xi: 0, xl: 0, yi: 0, yl: 0 };
  width: number | string = 0;
  height: number | string = 0;
  left: number | string = 0;
  top: number | string = 0;
  right: number | string = 'auto';
  bottom: number | string = 'auto';
  clickable: boolean = false;
  focusable: boolean = false;
  focused: boolean = false;
  hidden: boolean = false;
  visible: boolean = true;
  draggable: boolean = false;
  detached: boolean = false;
  fixed: boolean = false;
  destroyed: boolean = false;
  atop: boolean = false;
  style: Style = {};

  // 내부 포지션 캐시
  lpos?: Position;

  constructor(options: NodeOptions = {}) {
    super();

    // 필요한 옵션이 있는지 확인
    if (!options.screen) {
      throw new Error('Node requires a screen.');
    }

    this.screen = options.screen;
    this.name = options.name || '';

    // 부모가 있다면 해당 부모에 추가
    if (options.parent) {
      this.parent = options.parent;
      this.parent.append(this);
    }

    // 위치 및 크기 설정
    if (options.left !== undefined) this.left = options.left;
    if (options.top !== undefined) this.top = options.top;
    if (options.right !== undefined) this.right = options.right;
    if (options.bottom !== undefined) this.bottom = options.bottom;
    if (options.width !== undefined) this.width = options.width;
    if (options.height !== undefined) this.height = options.height;

    // 기타 옵션 설정
    if (options.focusable !== undefined) this.focusable = options.focusable;
    if (options.clickable !== undefined) this.clickable = options.clickable;
    if (options.draggable !== undefined) this.draggable = options.draggable;
    if (options.hidden !== undefined) this.hidden = options.hidden;
    if (options.visible !== undefined) this.visible = options.visible;
    if (options.fixed !== undefined) this.fixed = options.fixed;
    if (options.style !== undefined) this.style = { ...this.style, ...options.style };

    // 자식 노드 설정
    if (options.children) {
      options.children.forEach(child => this.append(child));
    }
  }

  /**
   * 자식 노드를 앞에 추가
   */
  prepend(node: NodeInterface): void {
    if (node.parent) {
      node.parent.remove(node);
    }

    node.parent = this;
    this.children.unshift(node);
    this.emit('adopt', node);
  }

  /**
   * 자식 노드를 뒤에 추가
   */
  append(node: NodeInterface): void {
    if (node.parent) {
      node.parent.remove(node);
    }

    node.parent = this;
    this.children.push(node);
    this.emit('adopt', node);
  }

  /**
   * 자식 노드 제거
   */
  remove(node: NodeInterface): void {
    const index = this.children.indexOf(node);
    if (index !== -1) {
      this.children.splice(index, 1);
      node.parent = null;
      this.emit('remove', node);
    }
  }

  /**
   * 자식 노드를 특정 위치에 삽입
   */
  insert(node: NodeInterface, i: number): void {
    if (node.parent) {
      node.parent.remove(node);
    }

    node.parent = this;
    this.children.splice(i, 0, node);
    this.emit('adopt', node);
  }

  /**
   * 특정 노드 앞에 삽입
   */
  insertBefore(node: NodeInterface, refNode: NodeInterface): void {
    const index = this.children.indexOf(refNode);
    if (index === -1) {
      this.append(node);
    } else {
      this.insert(node, index);
    }
  }

  /**
   * 특정 노드 뒤에 삽입
   */
  insertAfter(node: NodeInterface, refNode: NodeInterface): void {
    const index = this.children.indexOf(refNode);
    if (index === -1) {
      this.append(node);
    } else {
      this.insert(node, index + 1);
    }
  }

  /**
   * 부모로부터 분리
   */
  detach(): void {
    if (this.parent) {
      this.parent.remove(this);
    }
    this.detached = true;
    this.emit('detach');
  }

  /**
   * 자식 노드 삭제 (메모리 정리)
   */
  free(): void {
    this.children.forEach(child => {
      child.free();
    });
    this.children = [];
    this.emit('free');
  }

  /**
   * 노드 완전 제거
   */
  destroy(): void {
    this.detach();
    this.free();
    this.destroyed = true;
    this.emit('destroy');
  }

  /**
   * 자식 노드 순회
   */
  forDescendants(iter: (node: NodeInterface) => boolean | void, s?: boolean): void {
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      const result = iter(child);

      if (result === false) {
        return;
      }

      if (s !== false) {
        child.forDescendants(iter, s);
      }
    }
  }

  /**
   * 상위 노드 순회
   */
  forAncestors(iter: (node: NodeInterface) => boolean | void): void {
    let parent = this.parent;
    while (parent) {
      const result = iter(parent);
      if (result === false) break;
      parent = parent.parent;
    }
  }

  /**
   * 조건에 맞는 자식 노드 수집
   */
  collectDescendants(test: (node: NodeInterface) => boolean): NodeInterface[] {
    const result: NodeInterface[] = [];

    this.forDescendants(node => {
      if (test(node)) {
        result.push(node);
      }
    });

    return result;
  }

  /**
   * 조건에 맞는 상위 노드 수집
   */
  collectAncestors(test: (node: NodeInterface) => boolean): NodeInterface[] {
    const result: NodeInterface[] = [];

    this.forAncestors(node => {
      if (test(node)) {
        result.push(node);
      }
    });

    return result;
  }

  /**
   * 자식 노드에게 이벤트 발생
   */
  emitDescendants(type: string | symbol, ...args: any[]): void {
    this.forDescendants(node => {
      node.emit(type, ...args);
    });
  }

  /**
   * 이름으로 자식 노드 가져오기
   */
  get(name: string, recursive?: boolean): NodeInterface | undefined {
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];
      if (child.name === name) {
        return child;
      }
    }

    if (recursive) {
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i];
        const node = child.get(name, true);
        if (node) {
          return node;
        }
      }
    }

    return undefined;
  }

  /**
   * 이름으로 자식 노드 설정
   */
  set(name: string, node: NodeInterface): void {
    node.name = name;
    this.append(node);
  }

  /**
   * 마지막 자식 노드 가져오기
   */
  getLastDescendant(): NodeInterface {
    let last: NodeInterface = this;

    while (last.children.length > 0) {
      last = last.children[last.children.length - 1];
    }

    return last;
  }

  /**
   * 자식 노드인지 확인
   */
  hasDescendant(node: NodeInterface): boolean {
    let result = false;

    this.forDescendants(child => {
      if (child === node) {
        result = true;
        return false;
      }
    });

    return result;
  }

  /**
   * 상위 노드인지 확인
   */
  hasAncestor(node: NodeInterface): boolean {
    let result = false;

    this.forAncestors(parent => {
      if (parent === node) {
        result = true;
        return false;
      }
    });

    return result;
  }

  /**
   * 포커스 가져오기
   */
  focus(): void {
    if (!this.focusable) return;

    if (this.screen.focused !== this) {
      this.screen.focused = this;
      this.screen.emit('focus', this);
      this.emit('focus');
    }
    this.focused = true;
  }

  /**
   * 포커스 제거
   */
  blur(): void {
    if (this.screen.focused === this) {
      this.screen.focused = null;
      this.screen.emit('blur', this);
      this.emit('blur');
    }
    this.focused = false;
  }

  /**
   * 인덱스 설정
   */
  setIndex(index: number): void {
    if (!this.parent) return;

    if (index < 0) {
      index = 0;
    } else if (index >= this.parent.children.length) {
      index = this.parent.children.length - 1;
    }

    if (this.parent.children[index] === this) return;

    this.parent.children.splice(this.parent.children.indexOf(this), 1);
    this.parent.children.splice(index, 0, this);
    this.index = index;
  }

  /**
   * 맨 앞으로 가져오기
   */
  setFront(): void {
    if (!this.parent) return;
    this.setIndex(this.parent.children.length - 1);
  }

  /**
   * 맨 뒤로 보내기
   */
  setBack(): void {
    if (!this.parent) return;
    this.setIndex(0);
  }

  /**
   * 라벨 설정
   */
  setLabel(args: any): void {
    // 구현은 상속 클래스에서 제공
  }

  /**
   * 라벨 제거
   */
  removeLabel(): void {
    // 구현은 상속 클래스에서 제공
  }

  /**
   * 호버 효과 설정
   */
  setHover(args: any): void {
    // 구현은 상속 클래스에서 제공
  }

  /**
   * 호버 효과 제거
   */
  removeHover(): void {
    // 구현은 상속 클래스에서 제공
  }

  /**
   * 마우스 이벤트 활성화
   */
  enableMouse(): void {
    this.clickable = true;
  }

  /**
   * 마우스 이벤트 비활성화
   */
  disableMouse(): void {
    this.clickable = false;
  }

  /**
   * 화면 좌표 계산 및 캐시
   */
  _getCoords(): Position | undefined {
    // 이미 계산된 좌표가 있으면 해당 좌표 사용
    if (this.lpos) return this.lpos;

    // 부모가 없으면 좌표 계산 불가
    if (!this.parent) return undefined;

    // 좌표 계산 로직
    // 실제 구현에서는 더 복잡한 계산이 필요하지만 여기서는 간단히 처리
    const parentPos = this.parent._getCoords();
    if (!parentPos) return undefined;

    let left = parentPos.xi;
    let top = parentPos.yi;
    let width = this.width as number;
    let height = this.height as number;

    // 'center' 등의 특수 위치 처리
    if (this.left === 'center') {
      left += Math.floor((parentPos.xl - parentPos.xi - width) / 2);
    } else if (typeof this.left === 'number') {
      left += this.left;
    }

    if (this.top === 'center') {
      top += Math.floor((parentPos.yl - parentPos.yi - height) / 2);
    } else if (typeof this.top === 'number') {
      top += this.top;
    }

    // 결과 좌표 계산
    const position: Position = {
      xi: left,
      yi: top,
      xl: left + width,
      yl: top + height
    };

    // 좌표 캐시 저장
    this.lpos = position;

    return position;
  }
}