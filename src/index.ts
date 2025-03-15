/**
 * Nurexia - Main Entry Point
 */

// ESM 모듈 방식으로 내보내기 예시
export const greet = (name: string): string => {
  return `Hello, ${name}!`;
};

console.log(greet('World'));

// 기본 내보내기 예시
export default {
  greet
};