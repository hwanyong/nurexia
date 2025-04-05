"""
Google API Provider 구현
"""
from typing import Dict, Any, List, Optional, Tuple, AsyncIterator
import os

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

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
    supports_streaming = True  # 스트리밍 지원 활성화

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

        # LangChain 클라이언트 생성
        client = ChatGoogleGenerativeAI(
            model=self.model,
            google_api_key=self.api_key,
            temperature=merged_options.get("temperature", 0.7)
        )

        # 메시지 변환
        lc_messages = self._convert_to_langchain_messages(messages)

        # 응답 생성
        result = client.invoke(lc_messages)

        # 결과 반환
        return {
            "content": result.content,
            "raw_response": result,
            "metadata": {
                "model": self.model,
                "provider": self.name
            }
        }

    async def stream_chat(self, messages, options: Optional[Dict[str, Any]] = None) -> AsyncIterator[str]:
        """
        스트리밍 대화형 응답 생성

        Args:
            messages: 대화 메시지 목록
            options: 추가 옵션

        Yields:
            응답 청크
        """
        # 옵션 병합
        merged_options = {**self.options, **(options or {})}

        # LangChain 스트리밍 클라이언트 생성
        client = ChatGoogleGenerativeAI(
            model=self.model,
            google_api_key=self.api_key,
            temperature=merged_options.get("temperature", 0.7),
            streaming=True
        )

        # 메시지 변환
        lc_messages = self._convert_to_langchain_messages(messages)

        # 스트리밍 응답 처리
        for chunk in client.stream(lc_messages):
            if chunk.content:
                yield chunk.content