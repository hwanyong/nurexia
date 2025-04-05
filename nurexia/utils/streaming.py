"""
스트리밍 출력 기능 구현 모듈
AI Provider로부터 스트리밍 응답을 받아 처리합니다.
"""

import asyncio
from typing import Dict, Any, List, Optional

import click

from ..providers import get_provider
from ..graph.state import GraphState, MessageRole


async def execute_streaming(state: GraphState):
    """스트리밍 모드로 AI 응답을 출력합니다.

    Args:
        state: 현재 Graph 상태
    """
    try:
        # Provider 인스턴스 생성
        provider_instance = get_provider(
            state.provider,
            state.model,
            **state.options
        )

        # 스트리밍 지원 확인
        if not provider_instance.supports_streaming:
            click.echo(f"\n{state.provider} Provider는 스트리밍을 지원하지 않습니다.")
            click.echo("비스트리밍 모드로 실행합니다...")

            # 일반 모드로 대체 실행
            messages = state.get_conversation_history()
            response = await provider_instance.chat(messages)
            click.echo(response["content"])
            return

        # 스트리밍 시작
        messages = state.get_conversation_history()

        async for chunk in provider_instance.stream_chat(messages):
            click.echo(chunk, nl=False)
        click.echo()  # 줄바꿈으로 마무리
    except Exception as e:
        click.echo(f"\nError during streaming: {str(e)}")
        if state.options.get("verbose", False):
            import traceback
            click.echo(traceback.format_exc())


def setup_streaming(provider: str, model: Optional[str], options: Dict[str, Any]):
    """스트리밍 설정을 구성합니다.

    Args:
        provider: AI Provider 이름
        model: 사용할 모델 이름
        options: 추가 옵션

    Returns:
        스트리밍 함수
    """
    # Provider 인스턴스 생성
    provider_instance = get_provider(provider, model, **options)

    # 스트리밍 지원 확인
    if not provider_instance.supports_streaming:
        async def fallback_streamer(messages):
            """스트리밍 미지원 시 대체 함수"""
            click.echo(f"\n{provider} Provider는 스트리밍을 지원하지 않습니다.")
            click.echo("비스트리밍 모드로 실행합니다...")

            response = await provider_instance.chat(messages)
            yield response["content"]

        return fallback_streamer

    # 스트리밍 옵션 추가
    updated_options = {**options, "stream": True}

    provider_instance = get_provider(provider, model, **updated_options)

    async def streamer(messages):
        """스트리밍 함수"""
        return provider_instance.stream_chat(messages)

    return streamer