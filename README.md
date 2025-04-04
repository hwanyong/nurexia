# Nurexia

Nurexia는 Python으로 작성된 CLI(Command Line Interface) 도구입니다. pip를 통해 설치하거나 웹에서 직접 다운로드하여 사용할 수 있습니다.

## 주요 기능

- 간단한 CLI 인터페이스
- 여러 모드 지원 (agent, edit, chat)
- 상태 관리 기능
- 시스템 정보 조회
- 확장 가능한 구조

## 설치 방법

### pip를 통한 설치

```bash
pip install nurexia
```

### 웹에서 직접 설치 (Unix/macOS)

```bash
curl -sSL https://raw.githubusercontent.com/hwanyong/nurexia/main/install.sh | bash
```

또는 wget을 사용:

```bash
wget -qO- https://raw.githubusercontent.com/hwanyong/nurexia/main/install.sh | bash
```

## 간단한 사용법

```bash
# 도움말 보기
nurexia --help

# 에이전트 모드 실행
nurexia -m agent

# 편집 모드 실행
nurexia -m edit

# 채팅 모드 실행
nurexia -m chat

# 상세 출력으로 실행
nurexia -m agent -v

# 현재 실행 상태 확인
nurexia state

# 상태 초기화
nurexia reset

# 시스템 정보 보기
nurexia system-info

# 시스템 정보를 JSON 형식으로 보기
nurexia system-info --format json
```

상세한 사용법은 [USAGE.md](USAGE.md)를 참조하세요.

## 상태 관리

Nurexia는 마지막 실행 모드와 설정을 `~/.nurexia/state.json` 파일에 저장하여 관리합니다. 이를 통해 다음 명령을 실행할 때 이전 상태를 유지할 수 있습니다.

- `nurexia state`: 현재 상태 확인
- `nurexia reset`: 상태 초기화

## 개발

개발 환경 설정 및 기여 방법은 [DEVELOPMENT.md](DEVELOPMENT.md)를 참조하세요.

### 로컬 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/hwanyong/nurexia.git
cd nurexia

# 가상 환경 생성 및 활성화, 패키지 설치
python3 -m venv venv && source venv/bin/activate && pip install -e .
```

### 테스트 실행

```bash
# 테스트 의존성 설치
pip install pytest pytest-cov

# 모든 테스트 실행
pytest

# 커버리지 보고서 생성
pytest --cov=nurexia tests/
```

상세한 테스트 방법은 [docs/TESTING.md](docs/TESTING.md)를 참조하세요.

## 라이선스

MIT