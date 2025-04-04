"""
Agent Interface for Nurexia.

이 모듈은 향후 langChain/langGraph 기반 에이전트를 통합하기 위한
인터페이스와 추상 클래스를 제공합니다.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Union

class AgentBase(ABC):
    """
    AI 에이전트를 위한 기본 추상 클래스.

    이 클래스를 상속하여 구체적인 에이전트 구현을 만들 수 있습니다.
    향후 langChain/langGraph 통합에 사용됩니다.
    """

    def __init__(self, name: str, config: Optional[Dict[str, Any]] = None):
        """
        에이전트를 초기화합니다.

        Args:
            name: 에이전트 이름
            config: 에이전트 설정
        """
        self.name = name
        self.config = config or {}

    @abstractmethod
    def initialize(self) -> bool:
        """
        에이전트를 초기화합니다.

        Returns:
            bool: 초기화 성공 여부
        """
        pass

    @abstractmethod
    def process(self, input_data: Any) -> Any:
        """
        입력 데이터를 처리합니다.

        Args:
            input_data: 처리할 입력 데이터

        Returns:
            Any: 처리 결과
        """
        pass

    @abstractmethod
    def execute_task(self, task: str, parameters: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        특정 태스크를 실행합니다.

        Args:
            task: 실행할 태스크 이름
            parameters: 태스크 파라미터

        Returns:
            Dict[str, Any]: 태스크 결과
        """
        pass

    def cleanup(self) -> None:
        """
        에이전트 리소스를 정리합니다.
        """
        pass

class AgentRegistry:
    """에이전트 등록을 위한 레지스트리."""

    _agents: Dict[str, type] = {}

    @classmethod
    def register(cls, name: str):
        """
        에이전트 클래스를 등록하는 데코레이터.

        Args:
            name: 등록할 에이전트 이름

        Returns:
            함수: 데코레이터 함수
        """
        def wrapper(agent_class: type) -> type:
            if not issubclass(agent_class, AgentBase):
                raise TypeError(f"Agent class must inherit from AgentBase: {agent_class.__name__}")
            cls._agents[name] = agent_class
            return agent_class
        return wrapper

    @classmethod
    def get_agent_class(cls, name: str) -> Optional[type]:
        """
        등록된 에이전트 클래스를 가져옵니다.

        Args:
            name: 에이전트 이름

        Returns:
            Optional[type]: 에이전트 클래스 또는 None
        """
        return cls._agents.get(name)

    @classmethod
    def create_agent(cls, name: str, agent_config: Optional[Dict[str, Any]] = None) -> Optional[AgentBase]:
        """
        등록된 에이전트 인스턴스를 생성합니다.

        Args:
            name: 에이전트 이름
            agent_config: 에이전트 설정

        Returns:
            Optional[AgentBase]: 에이전트 인스턴스 또는 None
        """
        agent_class = cls.get_agent_class(name)
        if agent_class:
            return agent_class(name, agent_config)
        return None