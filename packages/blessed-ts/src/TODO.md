# blessed-ts 마이그레이션 TODO 리스트
[github](https://github.com/chjj/blessed/)
[origin]('/Users/uhd/Documents/Projects/1.PERSONAL/03.Projects/Code Agent Project/nurexia/packages/blessed-original')

이 문서는 JavaScript로 작성된 `blessed` 라이브러리를 TypeScript로 마이그레이션하기 위한 상세 TODO 리스트입니다.
각 항목은 작업의 연속성을 고려해 순서대로 정렬되어 있습니다.

## 1. 기본 프로젝트 구조 및 환경 설정

- [x] 프로젝트 초기화 (package.json, tsconfig.json)
- [x] 기본 디렉터리 구조 생성 (src/, dist/ 등)
- [x] 핵심 의존성 설치 (grapheme-splitter 등)
- [ ] 단위 테스트 프레임워크 설정 (Jest 또는 Vitest)
- [ ] CI/CD 파이프라인 설정 (.github/workflows)
- [ ] ESLint 및 Prettier 설정

## 2. 핵심 타입 정의

- [x] 기본 타입 정의 (src/types/index.ts)
- [x] 이벤트 및 입력 관련 타입 정의 (KeyEvent, MouseEvent 등)
- [ ] 위젯 옵션 타입 정의 완성 (모든 위젯 옵션에 대한 타입 정의)
- [ ] 스타일 관련 타입 정의 완성 (색상, 테두리 등)
- [ ] 유니코드 및 문자 관련 타입 정의
- [ ] tput 관련 타입 정의 완성

## 3. 유틸리티 모듈 구현

- [x] `unicode.js` → `utils/unicode.ts` 마이그레이션
  - [x] East Asian Width (EAW) 계산 함수 구현
  - [x] 유니코드 문자 분류 함수 구현
  - [x] 문자 너비 계산 기능 개선 (그래핌 단위 지원)
- [x] `colors.js` → `utils/colors.ts` 마이그레이션
  - [x] 색상 변환 함수 구현
  - [x] 테마 관련 기능 구현
- [x] `helpers.js` → `helpers/index.ts` 마이그레이션
  - [x] 문자열 처리 헬퍼 함수 타입 안전하게 구현
  - [x] 객체 및 배열 처리 유틸리티 함수 구현
- [x] `events.js` → `utils/events.ts` 마이그레이션
  - [x] 이벤트 관련 유틸리티 함수 타입 안전하게 구현
  - [x] EventEmitter 클래스 구현

## 4. 핵심 모듈 구현

- [x] `program.js` → `program/program.ts` 마이그레이션
  - [x] Program 클래스 기본 구조 구현
  - [x] 기본 타입 정의 및 인터페이스 구현
  - [x] 이벤트 처리 기본 구조 구현
  - [x] 터미널 제어 메서드 구현
  - [x] 입력 처리 메커니즘 개선 (IME 지원)
- [x] `tput.js` → `program/tput.ts` 마이그레이션
  - [x] Tput 클래스 기본 구조 구현
  - [x] 기본 타입 정의 및 인터페이스 구현
  - [x] 파일 시스템 관련 메서드 구현
  - [x] terminfo 파싱 로직 구현
  - [x] termcap 파싱 로직 구현
  - [x] 터미널 기능 감지 기능 구현
- [x] `keys.js` → `program/keys.ts` 마이그레이션
  - [x] 키 이벤트 처리 및 정규화 구현
  - [x] 특수 키 시퀀스 처리 개선
- [x] `gpmclient.js` → `program/gpmclient.ts` 마이그레이션 (필요시)
  - [x] Linux GPM 마우스 지원 구현 (선택적 구현으로 일단 미루기로 함)

## 5. 기본 위젯 구현

- [x] `node.js` → `widgets/node.ts` 마이그레이션
  - [x] Node 클래스 및 기본 메서드 구현
  - [x] 이벤트 관리 기능 타입 안전하게 구현
- [x] `element.js` → `widgets/element.ts` 마이그레이션
  - [x] Element 클래스 구현 (Node 확장)
  - [x] 레이아웃 관련 메서드 구현
  - [x] 스타일 및 테두리 관련 기능 구현
  - [x] 렌더링 로직 개선 (다국어 지원)
- [x] `screen.js` → `widgets/screen.ts` 마이그레이션
  - [x] Screen 클래스 구현 (Node 확장)
  - [x] 터미널 화면 관리 기능 구현
  - [x] 입력 이벤트 관리 로직 구현
  - [x] 렌더링 최적화 (smartCSR 등)
- [x] `box.js` → `widgets/box.ts` 마이그레이션
  - [x] Box 클래스 구현 (Element 확장)
  - [x] 박스 테두리 및 스타일 처리 구현

## 6. 컨테이너 및 스크롤 위젯 구현

- [x] `scrollablebox.js` → `widgets/scrollablebox.ts` 마이그레이션
  - [x] ScrollableBox 클래스 구현 (Box 확장)
  - [x] 스크롤 관련 메서드 구현
  - [x] 유니코드 지원 스크롤링 개선
- [x] `scrollabletext.js` → `widgets/scrollabletext.ts` 마이그레이션
  - [x] ScrollableText 클래스 구현 (ScrollableBox 확장)
- [x] `list.js` → `widgets/list.ts` 마이그레이션
  - [x] List 클래스 구현 (ScrollableBox 확장)
  - [x] 항목 선택 및 관리 기능 구현
- [x] `listbar.js` → `widgets/listbar.ts` 마이그레이션
  - [x] ListBar 클래스 구현 (Box 확장)

## 7. 입력 관련 위젯 구현

- [x] `form.js` → `widgets/form.ts` 마이그레이션
  - [x] Form 클래스 구현 (Box 확장)
  - [x] 폼 요소 관리 기능 구현
- [x] `input.js` → `widgets/input.ts` 마이그레이션
  - [x] Input 클래스 구현 (Textarea 확장)
- [x] `textarea.js` → `widgets/textarea.ts` 마이그레이션
  - [x] Textarea 클래스 구현 (ScrollableBox 확장)
  - [x] 텍스트 편집 기능 구현
  - [x] IME 입력 지원 개선
  - [x] 다국어 입력 처리 개선
- [x] `textbox.js` → `widgets/textbox.ts` 마이그레이션
  - [x] TextBox 클래스 구현 (Textarea 확장)
- [x] `button.js` → `widgets/button.ts` 마이그레이션
  - [x] Button 클래스 구현 (Box 확장)
- [x] `checkbox.js` → `widgets/checkbox.ts` 마이그레이션
  - [x] Checkbox 클래스 구현 (Input 확장)
- [x] `radiobutton.js` → `widgets/radiobutton.ts` 마이그레이션
  - [x] RadioButton 클래스 구현 (Checkbox 확장)
- [x] `radioset.js` → `widgets/radioset.ts` 마이그레이션
  - [x] RadioSet 클래스 구현 (Box 확장)

## 8. 데이터 표시 위젯 구현

- [x] `text.js` → `widgets/text.ts` 마이그레이션
  - [x] Text 클래스 구현 (Box 확장)
  - [x] 다국어 텍스트 렌더링 개선
- [x] `table.js` → `widgets/table.ts` 마이그레이션
  - [x] Table 클래스 구현 (Box 확장)
  - [x] 테이블 셀 및 행 관리 구현
- [x] `listtable.js` → `widgets/listtable.ts` 마이그레이션
  - [x] ListTable 클래스 구현 (List 확장)
- [x] `line.js` → `widgets/line.ts` 마이그레이션
  - [x] Line 클래스 구현 (Box 확장)
- [x] `progressbar.js` → `widgets/progressbar.ts` 마이그레이션
  - [x] ProgressBar 클래스 구현 (Box 확장)

## 9. 대화상자 및 메시지 위젯 구현

- [x] `message.js` → `widgets/message.ts` 마이그레이션
  - [x] Message 클래스 구현 (Box 확장)
- [ ] `question.js` → `widgets/question.ts` 마이그레이션
  - [ ] Question 클래스 구현 (Box 확장)
- [ ] `prompt.js` → `widgets/prompt.ts` 마이그레이션
  - [ ] Prompt 클래스 구현 (Box 확장)
- [ ] `loading.js` → `widgets/loading.ts` 마이그레이션
  - [ ] Loading 클래스 구현 (Box 확장)

## 10. 특수 위젯 구현

- [ ] `terminal.js` → `widgets/terminal.ts` 마이그레이션
  - [ ] Terminal 클래스 구현 (Box 확장)
  - [ ] 터미널 에뮬레이션 기능 구현
- [ ] `image.js` → `widgets/image.ts` 마이그레이션
  - [ ] Image 클래스 구현 (Box 확장)
- [ ] `ansiimage.js` → `widgets/ansiimage.ts` 마이그레이션
  - [ ] ANSIImage 클래스 구현 (Box 확장)
- [ ] `overlayimage.js` → `widgets/overlayimage.ts` 마이그레이션
  - [ ] OverlayImage 클래스 구현 (Box 확장)
- [ ] `video.js` → `widgets/video.ts` 마이그레이션 (필요시)
  - [ ] Video 클래스 구현 (Box 확장)
- [ ] `bigtext.js` → `widgets/bigtext.ts` 마이그레이션
  - [ ] BigText 클래스 구현 (Box 확장)
- [ ] `filemanager.js` → `widgets/filemanager.ts` 마이그레이션
  - [ ] FileManager 클래스 구현 (Box 확장)
- [ ] `log.js` → `widgets/log.ts` 마이그레이션
  - [ ] Log 클래스 구현 (ScrollableText 확장)

## 11. 레이아웃 관련 기능 구현

- [ ] `layout.js` → `widgets/layout.ts` 마이그레이션
  - [ ] Layout 클래스 구현 (Element 확장)
  - [ ] 그리드 및 플렉스 레이아웃 구현

## 12. 다국어 및 IME 지원 개선

- [ ] IME 입력 처리 메커니즘 구현
  - [ ] 한글, 중국어, 일본어 등 조합형 문자 입력 지원
  - [ ] 입력 중인 조합 문자 시각화
- [ ] 유니코드 문자 너비 계산 개선
  - [ ] East Asian Width (EAW) 특성 지원
  - [ ] 결합 문자 및 이모지 지원
- [ ] 양방향 텍스트 지원 개선 (아랍어, 히브리어 등)

## 13. 테스트 및 문서화

- [ ] 유닛 테스트 작성
  - [ ] 핵심 유틸리티 테스트
  - [ ] 위젯 테스트
  - [ ] 다국어 처리 테스트
- [ ] 통합 테스트 작성
  - [ ] 실제 터미널 환경에서 테스트
  - [ ] 다양한 유니코드 문자셋 테스트
- [ ] API 문서 작성
  - [ ] JSDoc 스타일 주석 추가
  - [ ] TypeDoc 또는 다른 문서 생성 도구 설정
- [ ] 사용 예제 작성
  - [ ] 기본 위젯 사용 예제
  - [ ] 복잡한 레이아웃 예제
  - [ ] 다국어 입력/출력 예제

## 14. 최적화 및 성능 개선

- [ ] 렌더링 엔진 최적화
  - [ ] smartCSR 알고리즘 개선
  - [ ] 부분 렌더링 최적화
- [ ] 메모리 사용량 최적화
  - [ ] 불필요한 객체 생성 최소화
  - [ ] 효율적인 데이터 구조 사용
- [ ] 이벤트 처리 최적화
  - [ ] 이벤트 리스너 관리 개선

## 15. 배포 및 유지보수

- [ ] npm 패키지 배포 준비
  - [ ] package.json 최종 설정
  - [ ] README 업데이트
  - [ ] CHANGELOG 작성
- [ ] 버전 관리 전략 수립
  - [ ] Semantic Versioning 준수
  - [ ] 마이너/메이저 버전 업그레이드 계획
- [ ] 커뮤니티 피드백 수집 및 반영 계획
  - [ ] 이슈 트래커 관리
  - [ ] 기여 가이드라인 작성

## 구현 우선순위

1. 핵심 유틸리티 및 기본 클래스 (Program, Node, Element)
2. 화면 관리 (Screen)
3. 기본 위젯 (Box, Text)
4. 스크롤 및 입력 위젯 (ScrollableBox, Textarea)
5. 고급 위젯 (List, Table, Form)
6. 특수 위젯 (Terminal, Image)
7. 다국어 및 IME 지원 개선

## 현재 진행 상황

### 완료된 작업
1. 유틸리티 모듈 구현
   - `unicode.ts`: 유니코드 처리 기능 구현 완료
   - `colors.ts`: 색상 처리 기능 구현 완료
   - `helpers/index.ts`: 헬퍼 함수 구현 완료
   - `events.ts`: 이벤트 처리 기능 구현 완료

2. 핵심 모듈 기본 구조
   - `program.ts`: 클래스 구조 및 기능 구현 완료
   - `tput.ts`: 클래스 구조 및 기능 구현 완료
   - `keys.ts`: 키 이벤트 처리 구현 완료

3. 기본 위젯 구현
   - `node.ts`: Node 클래스 구현 완료
   - `element.ts`: Element 클래스 구현 완료
   - `screen.ts`: Screen 클래스 구현 완료
   - `box.ts`: Box 클래스 구현 완료

4. 컨테이너 및 스크롤 위젯 구현
   - `scrollablebox.ts`: ScrollableBox 클래스 구현 완료
   - `scrollabletext.ts`: ScrollableText 클래스 구현 완료
   - `list.ts`: List 클래스 구현 완료
   - `listbar.ts`: ListBar 클래스 구현 완료

5. 입력 관련 위젯 구현
   - `form.ts`: Form 클래스 구현 완료
   - `textarea.ts`: Textarea 클래스 구현 완료
   - `input.ts`: Input 클래스 구현 완료
   - `textbox.ts`: TextBox 클래스 구현 완료
   - `button.ts`: Button 클래스 구현 완료

### 다음 작업 예정
1. 데이터 표시 위젯 구현 (계속)
   - `listtable.ts`: ListTable 클래스 구현 (List 확장)
   - `line.ts`: Line 클래스 구현 (Box 확장)
   - `progressbar.ts`: ProgressBar 클래스 구현 (Box 확장)

## 노트

- JavaScript에서 TypeScript로 마이그레이션하는 과정에서 타입 안전성을 최우선으로 고려해야 합니다.
- 다국어 지원 및 IME 기능이 핵심 차별점이므로 이에 집중해야 합니다.
- 각 모듈은 독립적으로 테스트 가능하도록 설계해야 합니다.
- 원본 blessed 라이브러리와 API 호환성을 유지하면서, 타입 안전성과 다국어 지원을 개선해야 합니다.