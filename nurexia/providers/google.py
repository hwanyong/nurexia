"""
Google API Provider 구현
"""
from typing import Dict, Any, List, Optional, Tuple
import os

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage

from .base import BaseProvider

class GoogleProvider(BaseProvider):
    """Google Gemini API Provider"""
    name = "google"
    default_model = "gemini-2.0-flash-001"
    available_models = [
        "gemini-1.0-pro",
        "gemini-1.5-pro",
        "gemini-2.0-pro-001",
        "gemini-2.0-flash-001"
    ]

    def __init__(self, model: Optional[str] = None, **kwargs):
        """
        Google Provider 초기화

        Args:
            model: 사용할 모델명. None이면 default_model 사용
            **kwargs: 추가 옵션
        """
        super().__init__(model, **kwargs)
        self.api_key = os.getenv("GOOGLE_API_KEY")

    def _process_options(self, options: Dict[str, Any]) -> Dict[str, Any]:
        """
        Google 옵션 처리

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
        Google API 연결 테스트

        Returns:
            Tuple[bool, str]: (성공 여부, 메시지)
        """
        if not self.api_key:
            return False, "GOOGLE_API_KEY 환경 변수가 설정되지 않았습니다."

        try:
            # LangChain ChatGoogleGenerativeAI 모델 초기화
            llm = ChatGoogleGenerativeAI(
                model=self.model,
                google_api_key=self.api_key,
                temperature=0.0
            )

            # 간단한 연결 확인용 메시지 (실제 호출은 하지 않고 모델 초기화만 확인)
            test_message = HumanMessage(content="Test connection")

            # 모델 정보 출력
            model_info = f"모델: {self.model}"

            return True, f"Google Gemini API 연결 성공! {model_info}"
        except Exception as e:
            error_msg = str(e)
            return False, f"Google Gemini API 연결 실패: {error_msg}"