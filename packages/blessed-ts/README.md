# blessed-ts

TypeScript 기반 터미널 UI 라이브러리 with 향상된 다국어 지원

## 소개

blessed-ts는 [blessed](https://github.com/chjj/blessed) 라이브러리를 TypeScript로 재구현한 버전입니다. 주요 목표는 다음과 같습니다:

- 타입 안전성 제공 (TypeScript 사용)
- 다국어 및 비 ASCII 문자에 대한 향상된 지원
- 성능 최적화
- 현대적인 코드베이스 및 API

## 설치

```bash
npm install blessed-ts
```

## 기본 사용법

간단한 Hello World 예제:

```typescript
import blessedTs from 'blessed-ts';

// 스크린 생성
const screen = new blessedTs.Screen({
  smartCSR: true,
  title: 'blessed-ts example'
});

// 박스 생성
const box = new blessedTs.Box({
  parent: screen,
  top: 'center',
  left: 'center',
  width: '50%',
  height: '50%',
  content: '안녕하세요! Hello, world!',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: '#f0f0f0'
    }
  }
});

// 종료 키 설정
screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

// 스크린 렌더링
screen.render();
```

## 주요 컴포넌트

### 기본 위젯

- `Screen`: 모든 요소의 컨테이너
- `Box`: 기본 컨테이너 요소
- `Text`: 텍스트 표시 요소
- `List`: 목록 표시 및 상호작용 요소
- `Textarea`: 텍스트 입력 요소

### 다국어 지원

blessed-ts는 다음과 같은 문자 집합에 대한 향상된 지원을 제공합니다:

- 한글, 한자, 일본어 등 동아시아 문자
- 결합 문자 (악센트 표시 등)
- 이모지
- 기타 비 라틴 문자

문자 너비 계산, 위치 조정, 스크롤 등의 기능이 다국어 문자에 맞게 최적화되어 있습니다.

### 성능 최적화

- 효율적인 렌더링 알고리즘
- 메모리 사용량 최적화
- 터미널 업데이트 최소화

## 프로젝트 상태

현재 이 프로젝트는 개발 초기 단계입니다. [TODO 리스트](./src/TODO.md)를 참조하여 현재 구현 상태와 향후 계획을 확인할 수 있습니다.

## 라이센스

ISC