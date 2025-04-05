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

```bash
# 기본 모드 테스트
nurexia

# 모드 옵션 테스트
nurexia -m agent
nurexia --mode edit

# 작업 디렉터리 옵션 테스트
nurexia -ws /path/to/dir
nurexia --workspace /path/to/dir

# 복합 옵션 테스트
nurexia -m edit -ws /path/to/dir
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