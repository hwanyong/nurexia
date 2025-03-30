# Nurexia 개발 가이드

## 개발 환경 설정

### 필수 요구사항
- Python 3.6+
- pip
- Git

### 로컬 개발 환경 설정
```bash
# 저장소 클론
git clone https://github.com/hwanyong/nurexia.git
cd nurexia

# 가상 환경 설정 및 개발 모드 설치
python3 -m venv venv && source venv/bin/activate && pip install -e .
```

**명령어 설명**:
- `python3 -m venv venv`: Python 가상 환경을 생성합니다. 이는 프로젝트별 독립적인 Python 환경을 만들어 의존성 충돌을 방지합니다.
- `source venv/bin/activate`: 생성된 가상 환경을 활성화합니다. Windows에서는 `venv\Scripts\activate`를 사용합니다.
- `pip install -e .`: 현재 프로젝트를 개발 모드로 설치합니다. `-e` 옵션은 "editable" 모드로, 소스 코드를 변경할 때마다 재설치 없이 변경사항이 즉시 반영됩니다.

### 개발 의존성 설치
```bash
pip install black isort mypy
```

## 프로젝트 구조
```
nurexia/
├── nurexia/           # 메인 패키지
│   ├── cli.py         # CLI 진입점
│   └── core/          # 핵심 기능
├── docs/              # 문서
├── tests/             # 테스트
└── setup.py           # 설치 스크립트
```

## 코드 스타일
- PEP 8 스타일 가이드 준수
- Type Hints 사용
- 문서화 주석(docstring) 작성

```bash
# 코드 포맷팅
black nurexia tests

# Import 정렬
isort nurexia tests
```

## 새 기능 추가 방법

1. 브랜치 생성:
   ```bash
   git checkout -b feature/my-new-feature
   ```

2. 코드 작성:
   - `nurexia/core/`에 기능 구현
   - `nurexia/cli.py`에 명령어 추가

3. 변경사항 커밋 및 푸시:
   ```bash
   git commit -m "기능 설명"
   git push origin feature/my-new-feature
   ```

## 배포 워크플로우

1. 버전 업데이트: `nurexia/__init__.py`의 `__version__` 수정
2. 변경 기록 작성: `CHANGELOG.md` 업데이트
3. 배포:
   ```bash
   python -m build
   python -m twine upload dist/*
   ```

## 문제 해결

### 일반적인 문제
- **CLI 명령 인식 오류**: `pip install -e .` 재실행
- **모듈 경로 오류**: `__init__.py` 파일 확인
- **의존성 문제**: 가상 환경 활성화 확인 및 의존성 재설치