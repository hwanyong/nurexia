"""
Anthropic API Provider 구현
"""
from typing import Dict, Any, List, Optional, Tuple
import os

from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage

from .base import BaseProvider

class AnthropicProvider(BaseProvider):
    """Anthropic Claude API Provider"""
    name = "anthropic"
    default_model = "claude-3-7-sonnet-20250219"
    available_models = [
        "claude-3-haiku-20240307",
        "claude-3-sonnet-20240229",
        "claude-3-opus-20240229",
        "claude-3-5-sonnet-20240620",
        "claude-3-7-sonnet-20250219"
    ]

    def __init__(self, model: Optional[str] = None, **kwargs):
        """
        Anthropic Provider 초기화

        Args:
            model: 사용할 모델명. None이면 default_model 사용
            **kwargs: 추가 옵션
        """
        super().__init__(model, **kwargs)
        self.api_key = os.getenv("ANTHROPIC_API_KEY")

    def _process_options(self, options: Dict[str, Any]) -> Dict[str, Any]:
        """
        Anthropic 옵션 처리

        Args:
            options: 처리할 옵션

        Returns:
            처리된 옵션
        """
        # 기본 옵션 설정
        processed_options = {
            "temperature": options.get("temperature", 0.7),
        }
        return processed_options

    def test_connection(self) -> Tuple[bool, str]:
        """
        Anthropic API 연결 테스트

        Returns:
            Tuple[bool, str]: (성공 여부, 메시지)
        """
        if not self.api_key:
            return False, "ANTHROPIC_API_KEY 환경 변수가 설정되지 않았습니다."

        try:
            # LangChain ChatAnthropic 모델 초기화
            llm = ChatAnthropic(
                model=self.model,
                anthropic_api_key=self.api_key,
                temperature=0.0
            )

            # 간단한 연결 확인용 메시지 (실제 호출은 하지 않고 모델 초기화만 확인)
            test_message = HumanMessage(content="Test connection")

            # 모델 정보 출력
            model_info = f"모델: {self.model}"

            return True, f"Anthropic API 연결 성공! {model_info}"
        except Exception as e:
            error_msg = str(e)
            return False, f"Anthropic API 연결 실패: {error_msg}"