# Nurexia 사용 가이드

이 문서는 Nurexia CLI 도구의 설치, 실행 및 테스트 방법에 대해 설명합니다.

## 설치 방법

로컬 개발 환경에서 Nurexia를 설치하려면 다음 명령을 실행하세요:

```bash
# 가상 환경 생성 (선택 사항)
python -m venv .venv --clear  # 깨끗한 가상 환경 생성
source .venv/bin/activate     # Linux/MacOS
# .venv\Scripts\activate      # Windows

# 개발 모드로 설치
python -m pip install -e .
```

### 외부 관리형 환경 문제 해결

최신 Python 버전(3.11+)에서 외부 관리형 환경 관련 오류가 발생할 경우 다음 방법을 사용하세요:

```bash
# 외부 관리형 환경 오류 발생 시
python -m pip install -e . --break-system-packages
```

## 실행 방법

Nurexia는 여러 가지 모드와 옵션으로 실행할 수 있습니다:

### 기본 모드 (Chat)

```bash
nurexia
```

또는

```bash
nurexia --mode chat
```

### Agent 모드

```bash
nurexia -m agent
```

### Edit 모드

```bash
nurexia --mode edit
```

### 작업 디렉터리 지정

```bash
# 특정 디렉터리를 작업 디렉터리로 지정
nurexia --workspace /경로/디렉터리
# 또는 짧은 옵션 사용
nurexia -ws /경로/디렉터리

# 모드와 함께 사용
nurexia -m edit -ws /경로/디렉터리
```

> 참고: 작업 디렉터리 옵션을 지정하지 않으면 현재 명령어를 실행한 디렉터리가 자동으로 작업 디렉터리로 사용됩니다.

### 도움말 보기

```bash
nurexia --help
```

## 테스트 방법

### 수동 테스트

다양한 모드로 실행하여 기능을 테스트할 수 있습니다:

```bash
# 각 모드 테스트
nurexia                 # Chat 모드 (기본값)
nurexia -m agent        # Agent 모드
nurexia --mode edit     # Edit 모드

# 도움말 테스트
nurexia --help
```

### 자동화된 테스트 (향후 구현 예정)

현재 자동화된 테스트는 구현되어 있지 않습니다. 향후 다음과 같은 테스트 스크립트를 실행할 수 있도록 개발할 예정입니다:

```bash
# 단위 테스트 실행 (향후 구현 예정)
# pytest tests/
```

## 문제 해결

설치 또는 실행 중 오류가 발생할 경우 다음을 확인하세요:

1. Python 가상 환경이 활성화되어 있는지 확인
2. 최신 버전의 패키지가 설치되어 있는지 확인 (`pip install -e .` 다시 실행)
3. 의존성 패키지(click)가 올바르게 설치되어 있는지 확인