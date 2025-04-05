"""
HuggingFace API Provider 구현
"""
from typing import Dict, Any, List, Optional, Tuple
import os

from langchain_huggingface import HuggingFaceEndpoint
from langchain_core.messages import HumanMessage

from .base import BaseProvider

class HuggingFaceProvider(BaseProvider):
    """HuggingFace API Provider"""
    name = "huggingface"
    default_model = "HuggingFaceH4/zephyr-7b-beta"
    available_models = [
        "HuggingFaceH4/zephyr-7b-beta",
        "mistralai/Mistral-7B-Instruct-v0.1",
        "meta-llama/Llama-2-7b-chat-hf",
        "tiiuae/falcon-7b-instruct",
        "google/flan-t5-xxl"
    ]

    def __init__(self, model: Optional[str] = None, **kwargs):
        """
        HuggingFace Provider 초기화

        Args:
            model: 사용할 모델명. None이면 default_model 사용
            **kwargs: 추가 옵션
        """
        super().__init__(model, **kwargs)
        self.api_key = os.getenv("HUGGINGFACE_API_KEY")

    def _process_options(self, options: Dict[str, Any]) -> Dict[str, Any]:
        """
        HuggingFace 옵션 처리

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
        HuggingFace API 연결 테스트

        Returns:
            Tuple[bool, str]: (성공 여부, 메시지)
        """
        if not self.api_key:
            return False, "HUGGINGFACE_API_KEY 환경 변수가 설정되지 않았습니다."

        try:
            # LangChain HuggingFaceEndpoint 모델 초기화
            llm = HuggingFaceEndpoint(
                endpoint_url=f"https://api-inference.huggingface.co/models/{self.model}",
                huggingfacehub_api_token=self.api_key,
                task="text-generation",
            )

            # 모델 정보 출력
            model_info = f"모델: {self.model}"

            return True, f"HuggingFace API 연결 성공! {model_info}"
        except Exception as e:
            error_msg = str(e)
            return False, f"HuggingFace API 연결 실패: {error_msg}"