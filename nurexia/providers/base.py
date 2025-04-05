"""
모든 AI Provider의 기본 인터페이스 정의.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional, Union

class BaseProvider(ABC):
    """모든 AI Provider의 기본 인터페이스"""
    name: str
    default_model: str
    available_models: List[str]

    def __init__(self, model: Optional[str] = None, **kwargs):
        """
        Provider 초기화

        Args:
            model: 사용할 모델명. None이면 default_model 사용
            **kwargs: 추가 옵션
        """
        self.model = model or self.default_model
        self.options = self._process_options(kwargs)

    @abstractmethod
    def _process_options(self, options: Dict[str, Any]) -> Dict[str, Any]:
        """
        Provider 옵션 처리

        Args:
            options: 처리할 옵션

        Returns:
            처리된 옵션
        """
        pass

    @abstractmethod
    def generate(self, prompt: str, options: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        텍스트 생성

        Args:
            prompt: 입력 프롬프트
            options: 생성 옵션

        Returns:
            생성 결과
        """
        pass