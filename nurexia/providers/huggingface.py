"""
HuggingFace API Provider 구현
"""
from typing import Dict, Any, List, Optional, Tuple
import os

from langchain_huggingface import HuggingFaceEndpoint
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

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
    supports_streaming = False  # 스트리밍 미지원

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

    def _convert_to_langchain_messages(self, messages):
        """
        메시지를 LangChain 형식으로 변환

        Args:
            messages: 변환할 메시지 목록

        Returns:
            LangChain 메시지 목록
        """
        result = []
        for msg in messages:
            # Message 클래스 객체인 경우
            if hasattr(msg, 'role') and hasattr(msg, 'content'):
                role = msg.role.value if hasattr(msg.role, 'value') else str(msg.role)
                if role == "user":
                    result.append(HumanMessage(content=msg.content))
                elif role == "assistant":
                    result.append(AIMessage(content=msg.content))
                elif role == "system":
                    result.append(SystemMessage(content=msg.content))
            # 딕셔너리인 경우
            elif isinstance(msg, dict) and 'role' in msg and 'content' in msg:
                if msg["role"] == "user":
                    result.append(HumanMessage(content=msg["content"]))
                elif msg["role"] == "assistant":
                    result.append(AIMessage(content=msg["content"]))
                elif msg["role"] == "system":
                    result.append(SystemMessage(content=msg["content"]))
        return result

    def _format_prompt_from_messages(self, messages):
        """
        메시지 목록을 HuggingFace 형식의 프롬프트로 변환

        Args:
            messages: 변환할 메시지 목록

        Returns:
            HuggingFace 형식의 프롬프트
        """
        prompt = ""
        for message in messages:
            if hasattr(message, 'role') and hasattr(message, 'content'):
                role = message.role.value if hasattr(message.role, 'value') else str(message.role)
                content = message.content
            elif isinstance(message, dict) and 'role' in message and 'content' in message:
                role = message["role"]
                content = message["content"]
            else:
                continue

            if role == "system":
                prompt += f"[SYSTEM] {content}\n"
            elif role == "user":
                prompt += f"[USER] {content}\n"
            elif role == "assistant":
                prompt += f"[ASSISTANT] {content}\n"

        prompt += "[ASSISTANT] "
        return prompt

    async def chat(self, messages, options: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        대화형 응답 생성

        Args:
            messages: 대화 메시지 목록
            options: 추가 옵션

        Returns:
            응답 결과
        """
        # 옵션 병합
        merged_options = {**self.options, **(options or {})}

        # HuggingFace 엔드포인트 클라이언트 생성
        client = HuggingFaceEndpoint(
            endpoint_url=f"https://api-inference.huggingface.co/models/{self.model}",
            huggingfacehub_api_token=self.api_key,
            task="text-generation",
            temperature=merged_options.get("temperature", 0.7),
            max_length=merged_options.get("max_length", 1024)
        )

        # 대부분의 HuggingFace 모델은 채팅 형식이 아닌 텍스트 생성 형식이므로 메시지를 프롬프트로 변환
        prompt = self._format_prompt_from_messages(messages)

        # 응답 생성
        result = client.invoke(prompt)

        # 결과 반환
        return {
            "content": result,
            "raw_response": result,
            "metadata": {
                "model": self.model,
                "provider": self.name
            }
        }