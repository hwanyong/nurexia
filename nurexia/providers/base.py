"""
모든 AI Provider의 기본 인터페이스 정의.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional, Union, Tuple

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
    def test_connection(self) -> Tuple[bool, str]:
        """
        Provider API 연결 테스트

        Returns:
            Tuple[bool, str]: (성공 여부, 메시지)
                - 성공: (True, "연결 성공 메시지")
                - 실패: (False, "오류 메시지")
        """
        pass