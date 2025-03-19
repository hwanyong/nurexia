/**
 * Box 위젯 테스트
 */

import blessedTs from '../';
import { assert } from 'chai';

describe('Box Widget Tests', () => {
  let screen: any;
  let box: any;

  beforeEach(() => {
    // 각 테스트마다 새로운 스크린 생성
    screen = new blessedTs.Screen({
      autoPadding: true,
      smartCSR: true,
      title: 'Test Screen'
    });

    // 기본 Box 위젯 생성
    box = new blessedTs.Box({
      parent: screen,
      top: 'center',
      left: 'center',
      width: '50%',
      height: '50%',
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: 'blue'
        }
      }
    });
  });

  afterEach(() => {
    // 테스트 완료 후 스크린 정리
    screen.destroy();
  });

  it('should create a box with correct properties', () => {
    assert.equal(box.type, 'box');
    assert.equal(typeof box.width, 'string');
    assert.equal(box.width, '50%');
    assert.equal(box.height, '50%');
  });

  it('should render box border correctly', () => {
    assert.isDefined(box.border);
    assert.equal(box.border.type, 'line');
    assert.isDefined(box.style.border);
    assert.equal(box.style.border.fg, 'blue');
  });

  it('should handle content setting', () => {
    const testContent = 'Test Content';
    box.setContent(testContent);
    assert.equal(box.content, testContent);
    assert.equal(box.getContent(), testContent);
  });

  it('should handle show/hide functionality', () => {
    assert.isFalse(box.hidden);
    box.hide();
    assert.isTrue(box.hidden);
    box.show();
    assert.isFalse(box.hidden);
  });

  it('should handle position changes', () => {
    box.top = 0;
    box.left = 0;
    assert.equal(box.top, 0);
    assert.equal(box.left, 0);
  });

  it('should handle unicode/multibyte characters', () => {
    const koreanText = '안녕하세요';
    box.setContent(koreanText);
    assert.equal(box.content, koreanText);

    // 한글의 표시 너비는 일반 ASCII보다 넓음
    const width = blessedTs.unicode.strWidth(koreanText);
    assert.isAbove(width, koreanText.length); // 한글은 2칸 너비
  });
});