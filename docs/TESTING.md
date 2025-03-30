# Nurexia 테스트 참고 사항

테스트가 필요한 경우 아래 정보를 참고하세요.

## 개발 환경 설정
```bash
# 가상 환경 설정 및 개발 모드 설치
python3 -m venv venv && source venv/bin/activate && pip install -e .
pip install pytest pytest-cov
```

## 테스트 실행
```bash
# 모든 테스트 실행
pytest

# 특정 테스트 실행
pytest tests/test_cli.py
```

## 테스트 커버리지 확인
```bash
pytest --cov=nurexia tests/
```