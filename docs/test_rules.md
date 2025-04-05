# Nurexia 테스트 규칙

## 테스트 환경 설정

테스트 실행 전 일관된 환경을 조성하려면 다음 절차를 따르세요:

```bash
# 깨끗한 가상 환경 생성
python3 -m venv .venv --clear

# 가상 환경 활성화
source .venv/bin/activate  # Linux/MacOS
# .venv\Scripts\activate   # Windows

# 개발 모드로 패키지 설치
python -m pip install -e .

# 외부 관리형 환경 오류 발생 시 다음 옵션 사용
# python -m pip install -e . --break-system-packages
```

## 테스트 방법

```bash
$ nurexia [options]
```

- 현재 프로젝트는 터미널 명령어로 실행되도록 설계됨
- 테스트는 반드시 실제 터미널 명령어로 수행해야 함
- 테스트 결과는 실제 사용자 환경의 출력으로 검증해야 함

### 권장 테스트 케이스

#### 기본 기능 테스트
```bash
# 기본 모드 테스트
nurexia

# 모드 옵션 테스트
nurexia -m agent
nurexia -m chat
nurexia --mode edit

# 작업 디렉터리 옵션 테스트
nurexia -ws /tmp
nurexia --workspace .
```

#### Provider 및 모델 테스트
```bash
# Provider 테스트
nurexia -pv anthropic
nurexia -pv openai
nurexia -pv huggingface
nurexia -pv google
nurexia -pv ollama

# 모델 테스트
nurexia -pv anthropic -md claude-3-7-sonnet-20250219
nurexia -pv openai -md gpt-4-turbo
nurexia --provider huggingface --model HuggingFaceH4/zephyr-7b-beta
```

#### 유틸리티 옵션 테스트
```bash
# 환경 변수 출력
nurexia --show-env

# 연결 테스트
nurexia --test-connection -pv anthropic
nurexia --test-connection -pv openai
```

#### 프롬프트 및 출력 테스트
```bash
# 기본 프롬프트 테스트
nurexia -p "안녕하세요"
nurexia -p "Hello, world!"

# 출력 형식 테스트
nurexia -p "안녕하세요" -o text
nurexia -p "안녕하세요" -o json
nurexia -p "안녕하세요" -o markdown

# 온도 조절 테스트
nurexia -p "창의적인 시를 써줘" -t 0.2
nurexia -p "창의적인 시를 써줘" -t 1.5

# 스트리밍 출력 테스트
nurexia -p "안녕하세요" --stream-mode
nurexia -p "긴 이야기를 들려줘" --stream-mode -pv openai

# 상세 로깅 테스트
nurexia -p "안녕하세요" -v
```

#### 복합 옵션 테스트
```bash
# 기본 복합 옵션
nurexia -m edit -ws /path/to/dir

# 고급 복합 옵션
nurexia -m chat -pv openai -md gpt-4-turbo -p "코딩 문제를 해결해줘" -t 0.5 -o json
nurexia -p "파이썬으로 피보나치 수열 구현" --stream-mode -pv anthropic -v

# 유효하지 않은 모델 테스트
nurexia -pv anthropic -md invalid-model -p "안녕하세요"

# 유효하지 않은 provider 테스트
nurexia -pv invalid-provider -p "안녕하세요"

# 유효하지 않은 온도 테스트
nurexia -p "안녕하세요" -t 3.0
```

## 금지된 테스트 방법

1. 다음과 같은 모듈 직접 호출 방식은 사용하지 마세요:

```bash
python -m nurexia.cli
python -m nurexia.cli -m agent
python -m nurexia.cli -ws /Users
```

**이유**: 모듈 직접 호출은 실제 명령행 도구의 동작과 환경을 정확히 반영하지 않습니다.

2. expert로 임의로 환경 변수 추가 금지
```bash
export PATH="$PWD/.test_env/bin:$PATH" && nurexia
```

## 테스트 매트릭스

다음은 주요 옵션 조합에 대한 테스트 매트릭스입니다:

| 모드  | Provider  | 모델            | 프롬프트 | 출력형식 | 스트리밍 | 기타 옵션      |
|-------|-----------|-----------------|---------|---------|----------|---------------|
| chat  | anthropic | default         | O       | text    | X        | -             |
| chat  | openai    | gpt-4-turbo     | O       | json    | X        | -t 0.5        |
| agent | anthropic | default         | O       | markdown| X        | -v            |
| edit  | openai    | default         | O       | text    | O        | -             |
| chat  | huggingface| zephyr-7b-beta | O       | json    | X        | -ws /tmp      |
| chat  | anthropic | default         | O       | text    | O        | -v            |

## 스트리밍 지원 테스트

스트리밍을 지원하는 Provider와 지원하지 않는 Provider에 대해 --stream-mode 옵션의 동작을
각각 확인하세요:

- 지원 Provider: anthropic, openai, ollama, google
- 미지원 Provider: huggingface

## 오류 처리 테스트

다음 오류 케이스에 대한 동작을 확인하세요:

1. 올바르지 않은 API 키 또는 누락된 API 키
2. 존재하지 않는 모델 이름 지정
3. 존재하지 않는 Provider 이름 지정
4. 범위를 벗어난 온도값 (0-2 외의 값)
5. 존재하지 않는 작업 디렉토리 지정