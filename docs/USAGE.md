# Nurexia 사용 가이드

## 설치 방법

### pip를 통한 설치
```bash
pip install nurexia
```

### 원라이너 설치 (Unix/macOS)
```bash
curl -sSL https://raw.githubusercontent.com/hwanyong/nurexia/main/install.sh | bash
```

### 소스에서 직접 설치
```bash
# 저장소 클론
git clone https://github.com/hwanyong/nurexia.git
cd nurexia

# 설치
pip install .
```

## 기본 명령어

### 도움말 보기
```bash
nurexia --help
```

### 버전 정보 확인
```bash
nurexia --version
```

### 기본 인사 명령어
```bash
nurexia hello
```
출력: `Hello from Nurexia!`

### 특정 이름으로 인사하기
```bash
nurexia greet 홍길동
```
출력: `Hello, 홍길동!`

### 시스템 정보 확인하기
```bash
# 텍스트 형식 (기본)
nurexia system-info

# JSON 형식
nurexia system-info --format json
```

## 개발 환경 설정

```bash
# 저장소 클론
git clone https://github.com/hwanyong/nurexia.git
cd nurexia

# 가상 환경 설정 및 개발 모드 설치
python3 -m venv venv && source venv/bin/activate && pip install -e .
```

**명령어 설명**:
- `python3 -m venv venv`: Python 가상 환경을 생성합니다. 프로젝트별 독립적인 환경으로 의존성 충돌을 방지합니다.
- `source venv/bin/activate`: 가상 환경을 활성화합니다. Windows에서는 `venv\Scripts\activate`를 사용합니다.
- `pip install -e .`: 현재 프로젝트를 개발 모드로 설치합니다. `-e` 옵션(editable)은 코드 변경 시 재설치 없이 변경사항이 즉시 반영됩니다.

개발 모드로 설치하면 코드를 수정할 때마다 재설치할 필요 없이 변경 사항이 즉시 반영됩니다.

## 새 명령어 추가하기

1. `nurexia/cli.py` 파일에 새 명령어 함수 추가:

```python
@cli.command()
@click.argument("argument_name")
@click.option("--option-name", default="default_value", help="Option description")
def my_command(argument_name, option_name):
    """Command description for help text."""
    click.echo(f"결과: {argument_name}, {option_name}")
```

2. 필요한 경우 `nurexia/core/` 디렉토리에 관련 기능을 구현합니다.

## 배포 준비

릴리스 전 준비:

1. 버전 업데이트: `nurexia/__init__.py` 파일에서 `__version__` 값 수정
2. 변경 사항 문서화: `CHANGELOG.md` 파일 업데이트
3. 패키지 빌드 및 배포:
   ```bash
   python -m build
   python -m twine upload dist/*
   ```