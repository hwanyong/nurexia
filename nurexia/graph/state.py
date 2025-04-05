"""
LangGraph 워크플로우 상태 모델
그래프 실행을 위한 상태 정보를 관리합니다.
"""

from typing import Dict, List, Any, Optional
from enum import Enum
from pydantic import BaseModel, Field


class MessageRole(str, Enum):
    """메시지 역할 정의"""
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"
    TOOL = "tool"


class Message(BaseModel):
    """대화 메시지 모델"""
    role: MessageRole
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)


class Action(BaseModel):
    """수행할 액션 정의"""
    name: str
    args: Dict[str, Any] = Field(default_factory=dict)


class ExecutionMode(str, Enum):
    """실행 모드 정의"""
    CHAT = "chat"
    AGENT = "agent"
    EDIT = "edit"


class GraphState(BaseModel):
    """LangGraph 워크플로우 상태 모델"""
    messages: List[Message] = Field(default_factory=list)
    current_node: str = "input"
    mode: str = "chat"
    action: Optional[Action] = None
    working_directory: str = "."
    provider: str = "anthropic"
    model: Optional[str] = None
    options: Dict[str, Any] = Field(default_factory=dict)
    error: Optional[str] = None
    result: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

    def add_message(self, role: MessageRole, content: str, **kwargs):
        """메시지 추가"""
        self.messages.append(
            Message(
                role=role,
                content=content,
                metadata=kwargs
            )
        )

    def get_conversation_history(self) -> List[Message]:
        """대화 이력 반환"""
        return self.messages

    def set_action(self, name: str, **kwargs):
        """액션 설정"""
        self.action = Action(name=name, args=kwargs)

    def clear_action(self):
        """액션 초기화"""
        self.action = None