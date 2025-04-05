"""
Ollama API Provider 구현
"""
from typing import Dict, Any, List, Optional, Tuple
import os

from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage

from .base import BaseProvider

class OllamaProvider(BaseProvider):
    """Ollama API Provider"""
    name = "ollama"
    default_model = "gemma3:12b"
    available_models = [
        "gemma:2b",
        "gemma:7b",
        "gemma3:12b",
        "llama2:7b",
        "llama2:13b",
        "llama3:8b",
        "llama3:70b",
        "mistral:7b",
        "mixtral:8x7b"
    ]

    def __init__(self, model: Optional[str] = None, **kwargs):
        """
        Ollama Provider 초기화

        Args:
            model: 사용할 모델명. None이면 default_model 사용
            **kwargs: 추가 옵션
        """
        super().__init__(model, **kwargs)
        self.host = os.getenv("OLLAMA_HOST", "http://localhost:11434")

    def _process_options(self, options: Dict[str, Any]) -> Dict[str, Any]:
        """
        Ollama 옵션 처리

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
        Ollama API 연결 테스트

        Returns:
            Tuple[bool, str]: (성공 여부, 메시지)
        """
        try:
            # LangChain ChatOllama 모델 초기화
            llm = ChatOllama(
                model=self.model,
                base_url=self.host,
                temperature=0.0
            )

            # 모델 정보 출력
            model_info = f"모델: {self.model}, 서버: {self.host}"

            return True, f"Ollama API 연결 성공! {model_info}"
        except Exception as e:
            error_msg = str(e)
            return False, f"Ollama API 연결 실패: {error_msg}"