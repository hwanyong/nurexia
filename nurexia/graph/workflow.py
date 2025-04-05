"""
LangGraph 워크플로우 정의
간단한 3단계 워크플로우(start → tmp_helloworld → end)를 구현합니다.
"""

from typing import Dict, Any, Tuple
import asyncio

from .state import GraphState, MessageRole


async def start_node(state: GraphState) -> Tuple[GraphState, str]:
    """시작 노드 - 워크플로우의 시작점"""
    # 입력을 받거나 초기 상태를 설정
    if state.messages:
        return state, "tmp_helloworld"
    else:
        state.error = "No input provided"
        return state, "end"


async def tmp_helloworld_node(state: GraphState) -> Tuple[GraphState, str]:
    """중간 처리 노드 - 'Hello World' 메시지 처리"""
    # 사용자 메시지 처리
    user_messages = [msg for msg in state.messages if msg.role == MessageRole.USER]

    if not user_messages:
        state.error = "No user messages found"
        return state, "end"

    # Provider를 사용하여 응답 생성 (예시)
    user_input = user_messages[-1].content

    # 간단한 처리 로직
    state.result = f"Hello, World! 입력받은 메시지: {user_input}"

    # 응답을 상태에 추가
    state.add_message(MessageRole.ASSISTANT, state.result)

    return state, "end"


async def end_node(state: GraphState) -> GraphState:
    """종료 노드 - 결과 반환"""
    # 최종 결과 처리
    return state


def create_workflow():
    """LangGraph 워크플로우 생성 - 간단한 3단계 구조"""
    # 간단한 비동기 함수로 구현된 워크플로우
    class SimpleWorkflow:
        async def ainvoke(self, state: GraphState) -> GraphState:
            # 시작 노드
            state, next_node = await start_node(state)

            # 다음 노드 실행
            if next_node == "tmp_helloworld":
                state, next_node = await tmp_helloworld_node(state)

            # 종료 노드
            if next_node == "end":
                state = await end_node(state)

            return state

    return SimpleWorkflow()