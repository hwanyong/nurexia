"""
모든 AI Provider의 기본 인터페이스 정의.
"""
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional, Union, Tuple, AsyncIterator

class BaseProvider(ABC):
    """모든 AI Provider의 기본 인터페이스"""
    name: str
    default_model: str
    available_models: List[str]
    supports_streaming: bool = False  # 스트리밍 지원 여부 (기본값: False)

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

    @abstractmethod
    async def chat(self, messages: List[Dict[str, str]], options: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        대화형 응답 생성

        Args:
            messages: 대화 메시지 목록
            options: 추가 옵션

        Returns:
            응답 결과
        """
        pass

    async def stream_chat(self, messages: List[Dict[str, str]], options: Optional[Dict[str, Any]] = None) -> AsyncIterator[str]:
        """
        스트리밍 대화형 응답 생성 (기본 구현: 미지원)

        Args:
            messages: 대화 메시지 목록
            options: 추가 옵션

        Yields:
            응답 청크

        Raises:
            NotImplementedError: 지원하지 않는 기능 사용 시
        """
        raise NotImplementedError(f"{self.__class__.__name__} Provider는 스트리밍을 지원하지 않습니다.")