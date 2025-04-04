# Nurexia LangGraph 구현 작업 계획서

## 1. 프로젝트 개요
Nurexia CLI 도구에 LangGraph와 다양한 AI Provider를 통합하여 확장성 있는 CLI 도구를 구현하는 프로젝트입니다.

## 2. 요구사항 정리

### AI Provider 통합
- Anthropic (`claude-3-7-sonnet-20250219`)
- OpenAI (`gpt-4.5-preview-2025-02-27`)
- HuggingFace (`HuggingFaceH4/zephyr-7b-beta`)
- Ollama (`gemma3:12b`)
- Google (`gemini-2.0-flash-001`)

### 환경 변수 관리
- 각 AI Provider의 API 키 등 환경 변수 관리
- Python 환경에 적합한 방식으로 구현

### CLI 옵션 확장
- `-m`, `--model`: 모델 선택
- `-p`, `--provider`: AI Provider 선택
- `-o`, `--output`: 출력 형식 선택
- `-v`, `--verbose`: 상세 로깅 선택
- `-h`, `--help`: 도움말 출력 (기본 제공)
- `-p`, `--prompt`: 프롬프트 작성 (마크다운 형식)
- `-t`, `--temperature`: 온도 설정
- `-s`, `--stream`: 스트리밍 출력 활성화

## 3. 아키텍처 설계

### 3.1. 아키텍처 개요

Nurexia는 다음과 같은 핵심 아키텍처 원칙을 따릅니다:

1. **계층화된 구조(Layered Architecture)**
   - 표현 계층(CLI 인터페이스)
   - 응용 계층(LangGraph 워크플로우)
   - 도메인 계층(AI Provider 통합)
   - 인프라 계층(환경 변수 관리)

2. **의존성 주입(Dependency Injection)**
   - Provider 인스턴스는 생성 후 필요한, 청사진에 주입됨
   - 테스트 용이성과 유연성 증가

3. **인터페이스 기반 설계(Interface-Based Design)**
   - 모든 Provider는 공통 인터페이스를 구현
   - 새로운 Provider 추가가 기존 코드에 영향을 미치지 않음

4. **데코레이터 패턴(Decorator Pattern)**
   - 출력 포맷팅과 스트리밍 기능은 기본 응답을 래핑하는 데코레이터로 구현

### 3.2. 핵심 컴포넌트

![Nurexia 아키텍처 다이어그램](../docs/img/architecture.png)

#### 3.2.1. 설정 관리(Configuration Management)
- `.env` 파일 및 환경 변수에서 설정 로드
- 설정값 검증 및 기본값 적용
- 각 Provider별 필수 설정 검사

#### 3.2.2. Provider 추상화 계층(Provider Abstraction Layer)
- 모든 AI Provider를 위한 공통 인터페이스 제공
- 요청/응답 형식 표준화
- 모델 매핑 및 파라미터 정규화

#### 3.2.3. LangGraph 워크플로우(LangGraph Workflow)
- **간단한 3단계 워크플로우(start → tmp_helloworld → end) 구현**
- 상태 관리 및 워크플로우 제어
- 간결한 데이터 흐름 관리

#### 3.2.4. CLI 인터페이스(CLI Interface)
- 사용자 입력 파싱 및 검증
- 실행 모드 선택 및 설정
- 결과 출력 및 포맷팅

## 4. 코드 구조 및 상세 구현 계획

### 4.1. 디렉토리 구조

```
nurexia/
├── .env.example                # 환경 변수 예제 파일
├── setup.py                    # 의존성 정의
├── README.md                   # 프로젝트 설명
├── docs/                       # 문서
│   ├── usage.md                # 사용 가이드
│   ├── tasks.md                # 작업 계획서
│   └── img/                    # 이미지 저장소
│       └── architecture.png    # 아키텍처 다이어그램
└── nurexia/                    # 메인 패키지
    ├── __init__.py             # 버전 정보 및 패키지 초기화
    ├── cli.py                  # CLI 인터페이스
    ├── config.py               # 환경 변수 및 설정 관리
    ├── providers/              # AI Provider 모듈
    │   ├── __init__.py         # Provider 등록 및 팩토리 함수
    │   ├── base.py             # 기본 Provider 인터페이스
    │   ├── anthropic.py        # Anthropic 구현
    │   ├── openai.py           # OpenAI 구현
    │   ├── huggingface.py      # HuggingFace 구현
    │   ├── ollama.py           # Ollama 구현
    │   └── google.py           # Google 구현
    ├── graph/                  # LangGraph 관련 모듈
    │   ├── __init__.py         # 그래프 생성 인터페이스
    │   ├── nodes.py            # 그래프 노드 정의
    │   ├── state.py            # 상태 관리 클래스
    │   └── workflow.py         # 워크플로우 정의
    └── utils/                  # 유틸리티 함수
        ├── __init__.py         # 유틸리티 함수 초기화
        ├── formatter.py        # 출력 포맷 관리
        ├── streaming.py        # 스트리밍 기능 구현
        ├── markdown.py         # 마크다운 파싱 및 처리
        └── logging.py          # 로깅 설정 및 관리
```

### 4.2. 핵심 모듈 및 클래스 설계

#### 4.2.1. 환경 변수 관리 (`config.py`)

```python
from typing import Dict, Any, Optional
from pydantic import BaseSettings, Field
import os
from dotenv import load_dotenv

# 기본 환경 설정 클래스
class Settings(BaseSettings):
    """기본 애플리케이션 설정"""
    app_name: str = "nurexia"
    debug: bool = Field(False, env="NUREXIA_DEBUG")
    log_level: str = Field("INFO", env="NUREXIA_LOG_LEVEL")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# 각 AI Provider별 환경 설정 클래스
class AnthropicSettings(BaseSettings):
    """Anthropic API 설정"""
    api_key: str = Field(..., env="ANTHROPIC_API_KEY")
    default_model: str = Field("claude-3-7-sonnet-20250219", env="ANTHROPIC_DEFAULT_MODEL")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# 다른 Provider 설정 클래스들도 유사하게 구현

# 설정 로더 및 관리 클래스
class ConfigManager:
    """환경 변수 및 설정 관리"""
    def __init__(self):
        load_dotenv()
        self.settings = Settings()
        self._providers_config = {}

    def get_provider_config(self, provider_name: str) -> BaseSettings:
        """특정 Provider의 설정 가져오기"""
        if provider_name not in self._providers_config:
            if provider_name == "anthropic":
                self._providers_config[provider_name] = AnthropicSettings()
            elif provider_name == "openai":
                # OpenAI 설정 로드
                pass
            # 다른 Provider 설정 조건문

        return self._providers_config[provider_name]

    def validate_provider(self, provider_name: str) -> bool:
        """Provider 설정이 유효한지 검증"""
        try:
            config = self.get_provider_config(provider_name)
            # 필수 환경 변수 검증 로직
            return True
        except Exception as e:
            return False

# 싱글톤 인스턴스 생성
config_manager = ConfigManager()
```

#### 4.2.2. AI Provider 인터페이스 (`providers/base.py`)

```python
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional, Union
from pydantic import BaseModel

class Message(BaseModel):
    """기본 메시지 모델"""
    role: str
    content: str

class Response(BaseModel):
    """LLM 응답 모델"""
    content: str
    raw_response: Any  # 원본 응답
    metadata: Dict[str, Any] = {}

class ProviderOptions(BaseModel):
    """Provider 옵션 기본 클래스"""
    temperature: float = 0.7
    stream: bool = False

    class Config:
        extra = "allow"  # 추가 옵션을 허용

class BaseProvider(ABC):
    """모든 AI Provider의 기본 인터페이스"""
    name: str
    default_model: str
    available_models: List[str]

    def __init__(self, model: Optional[str] = None, **kwargs):
        self.model = model or self.default_model
        self.options = self._process_options(kwargs)

    @abstractmethod
    def _process_options(self, options: Dict[str, Any]) -> ProviderOptions:
        """Provider 옵션 처리"""
        pass

    @abstractmethod
    async def generate(self, prompt: str, options: Optional[Dict[str, Any]] = None) -> Response:
        """텍스트 생성"""
        pass

    @abstractmethod
    async def chat(self, messages: List[Message], options: Optional[Dict[str, Any]] = None) -> Response:
        """대화형 응답 생성"""
        pass

    @abstractmethod
    async def stream_generate(self, prompt: str, options: Optional[Dict[str, Any]] = None):
        """스트리밍 텍스트 생성"""
        pass

    @abstractmethod
    async def stream_chat(self, messages: List[Message], options: Optional[Dict[str, Any]] = None):
        """스트리밍 대화형 응답 생성"""
        pass
```

#### 4.2.3. Anthropic Provider 구현 예시 (`providers/anthropic.py`)

```python
from typing import Dict, Any, List, Optional, AsyncGenerator
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

from .base import BaseProvider, Message, Response, ProviderOptions
from ..config import config_manager

class AnthropicOptions(ProviderOptions):
    """Anthropic 특화 옵션"""
    max_tokens: int = 1000

    class Config:
        extra = "allow"

class AnthropicProvider(BaseProvider):
    """Anthropic Claude API 통합"""
    name = "anthropic"
    default_model = "claude-3-7-sonnet-20250219"
    available_models = [
        "claude-3-haiku-20240307",
        "claude-3-sonnet-20240229",
        "claude-3-opus-20240229",
        "claude-3-7-sonnet-20250219"
    ]

    def __init__(self, model: Optional[str] = None, **kwargs):
        super().__init__(model, **kwargs)
        self.config = config_manager.get_provider_config("anthropic")
        self.client = self._create_client()

    def _create_client(self) -> ChatAnthropic:
        """Anthropic 클라이언트 생성"""
        return ChatAnthropic(
            anthropic_api_key=self.config.api_key,
            model=self.model,
            temperature=self.options.temperature,
            max_tokens=self.options.max_tokens
        )

    def _process_options(self, options: Dict[str, Any]) -> AnthropicOptions:
        """Anthropic 옵션 처리"""
        return AnthropicOptions(**options)

    def _convert_to_langchain_messages(self, messages: List[Message]):
        """메시지를 LangChain 형식으로 변환"""
        result = []
        for msg in messages:
            if msg.role == "user":
                result.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                result.append(AIMessage(content=msg.content))
            elif msg.role == "system":
                result.append(SystemMessage(content=msg.content))
        return result

    async def generate(self, prompt: str, options: Optional[Dict[str, Any]] = None) -> Response:
        """텍스트 생성"""
        merged_options = {**self.options.dict(), **(options or {})}
        messages = [Message(role="user", content=prompt)]
        return await self.chat(messages, merged_options)

    async def chat(self, messages: List[Message], options: Optional[Dict[str, Any]] = None) -> Response:
        """대화형 응답 생성"""
        merged_options = {**self.options.dict(), **(options or {})}
        lc_messages = self._convert_to_langchain_messages(messages)

        result = self.client.invoke(lc_messages)

        return Response(
            content=result.content,
            raw_response=result,
            metadata={
                "model": self.model,
                "provider": self.name,
                "usage": result.usage_metadata if hasattr(result, "usage_metadata") else {}
            }
        )

    async def stream_generate(self, prompt: str, options: Optional[Dict[str, Any]] = None):
        """스트리밍 텍스트 생성"""
        messages = [Message(role="user", content=prompt)]
        async for chunk in self.stream_chat(messages, options):
            yield chunk

    async def stream_chat(self, messages: List[Message], options: Optional[Dict[str, Any]] = None):
        """스트리밍 대화형 응답 생성"""
        merged_options = {**self.options.dict(), **(options or {})}
        merged_options["stream"] = True

        lc_messages = self._convert_to_langchain_messages(messages)
        streaming_client = ChatAnthropic(
            anthropic_api_key=self.config.api_key,
            model=self.model,
            temperature=merged_options.get("temperature", self.options.temperature),
            max_tokens=merged_options.get("max_tokens", self.options.max_tokens),
            streaming=True
        )

        stream = streaming_client.stream(lc_messages)

        for chunk in stream:
            if chunk.content:
                yield chunk.content
```

#### 4.2.4. Provider 팩토리 (`providers/__init__.py`)

```python
from typing import Dict, Type, Optional

from .base import BaseProvider
from .anthropic import AnthropicProvider
from .openai import OpenAIProvider
from .huggingface import HuggingFaceProvider
from .ollama import OllamaProvider
from .google import GoogleProvider

# Provider 등록
PROVIDERS: Dict[str, Type[BaseProvider]] = {
    "anthropic": AnthropicProvider,
    "openai": OpenAIProvider,
    "huggingface": HuggingFaceProvider,
    "ollama": OllamaProvider,
    "google": GoogleProvider
}

def get_provider(provider_name: str, model: Optional[str] = None, **kwargs) -> BaseProvider:
    """Provider 인스턴스 생성"""
    if provider_name not in PROVIDERS:
        raise ValueError(f"Unknown provider: {provider_name}")

    provider_class = PROVIDERS[provider_name]
    return provider_class(model=model, **kwargs)

def list_providers() -> Dict[str, Dict]:
    """사용 가능한 Provider 목록 반환"""
    result = {}
    for name, provider_class in PROVIDERS.items():
        result[name] = {
            "name": name,
            "default_model": provider_class.default_model,
            "available_models": provider_class.available_models
        }
    return result
```

#### 4.2.5. LangGraph 워크플로우 상태 모델 (`graph/state.py`)

```python
from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field
from enum import Enum

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
    mode: ExecutionMode = ExecutionMode.CHAT
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
```

#### 4.2.6. LangGraph 노드 정의 (`graph/nodes.py`)

```python
from typing import Dict, Any, Tuple
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
```

#### 4.2.7. LangGraph 워크플로우 정의 (`graph/workflow.py`)

```python
from langgraph.graph import Graph, StateGraph
from typing import Dict, Any

from .state import GraphState
from .nodes import start_node, tmp_helloworld_node, end_node

def create_workflow() -> Graph:
    """LangGraph 워크플로우 생성 - 간단한 3단계 구조"""
    # 상태 그래프 초기화
    workflow = StateGraph(GraphState)

    # 노드 추가
    workflow.add_node("start", start_node)
    workflow.add_node("tmp_helloworld", tmp_helloworld_node)
    workflow.add_node("end", end_node)

    # 엣지 정의 - 단순한 선형 흐름
    workflow.add_edge("start", "tmp_helloworld")
    workflow.add_edge("tmp_helloworld", "end")

    # 시작 및 종료 노드 설정
    workflow.set_entry_point("start")
    workflow.set_finish_point("end")

    return workflow.compile()
```

#### 4.2.8. CLI 인터페이스 확장 (`cli.py`)

```python
import click
import os
import asyncio
from typing import Optional

from .config import config_manager
from .providers import list_providers, get_provider
from .graph.state import GraphState, MessageRole
from .graph.workflow import create_workflow
from .utils.formatter import format_output
from .utils.streaming import setup_streaming

@click.command()
@click.option('-p', '--provider', type=str, default='anthropic',
              help='AI provider to use (anthropic, openai, huggingface, ollama, google)')
@click.option('-m', '--model', type=str, default=None,
              help='Model to use (provider-specific)')
@click.option('-o', '--output', type=click.Choice(['text', 'json', 'markdown']), default='text',
              help='Output format')
@click.option('-v', '--verbose', is_flag=True, help='Enable verbose logging')
@click.option('-p', '--prompt', type=str, help='Prompt text (supports markdown)')
@click.option('-t', '--temperature', type=float, default=0.7, help='Temperature for generation')
@click.option('-s', '--stream', is_flag=True, help='Enable streaming output')
@click.option('-ws', '--workspace', type=click.Path(exists=True, file_okay=False, dir_okay=True, resolve_path=True),
              help='Set the workspace directory')
def cli(provider, model, output, verbose, prompt, temperature, stream, workspace):
    """Nurexia: Terminal command line tool for AI interaction."""

    # 설정 초기화
    if verbose:
        click.echo("Initializing nurexia...")

    # Provider 유효성 검증
    available_providers = list_providers()
    if provider not in available_providers:
        click.echo(f"Error: Unknown provider '{provider}'. Available providers: {', '.join(available_providers.keys())}")
        return

    # 모델 설정
    if model is None:
        model = available_providers[provider]["default_model"]
        if verbose:
            click.echo(f"Using default model for {provider}: {model}")

    # 작업 디렉토리 설정
    working_dir = workspace if workspace else os.getcwd()
    if verbose:
        click.echo(f"Workspace directory: {working_dir}")

    # 상태 초기화
    state = GraphState(
        provider=provider,
        model=model,
        working_directory=working_dir,
        options={
            "temperature": temperature,
            "stream": stream
        }
    )

    # 워크플로우 생성
    workflow = create_workflow()

    # 프롬프트 처리
    if prompt:
        state.add_message(MessageRole.USER, prompt)

        # 비동기 실행
        result_state = asyncio.run(execute_workflow(workflow, state))

        # 결과 출력
        if result_state.error:
            click.echo(f"Error: {result_state.error}")
        elif result_state.result:
            click.echo(format_output(result_state.result, output_format=output))
    else:
        # 인터랙티브 모드
        click.echo(f"Running nurexia")
        click.echo(f"Provider: {provider}, Model: {model}")
        click.echo("Type 'exit' or 'quit' to exit")

        # 인터랙티브 루프
        asyncio.run(interactive_loop(workflow, state, output_format=output, stream=stream))

async def execute_workflow(workflow, state: GraphState) -> GraphState:
    """워크플로우 실행"""
    result = await workflow.ainvoke(state)
    return result

async def interactive_loop(workflow, initial_state: GraphState, output_format: str, stream: bool):
    """인터랙티브 모드 루프"""
    state = initial_state

    while True:
        # 사용자 입력 처리
        user_input = input("\nYou: ")

        if user_input.lower() in ['exit', 'quit']:
            break

        # 상태 업데이트
        state.add_message(MessageRole.USER, user_input)

        if stream:
            # 스트리밍 출력 설정
            streamer = setup_streaming(state.provider, state.model, state.options)
            click.echo("\nAssistant: ", nl=False)

            # 스트리밍 실행
            async for chunk in streamer(state.get_conversation_history()):
                click.echo(chunk, nl=False)
            click.echo()
        else:
            # 일반 실행
            result_state = await execute_workflow(workflow, state)

            if result_state.error:
                click.echo(f"\nError: {result_state.error}")
            elif result_state.result:
                click.echo("\nAssistant: " + format_output(result_state.result, output_format=output_format))

            # 상태 업데이트
            state = result_state

if __name__ == '__main__':
    cli()
```

## 5. 설치 및 의존성 설정 (`setup.py`)

```python
from setuptools import setup, find_packages

setup(
    name="nurexia",
    version="0.2.0",
    packages=find_packages(),
    install_requires=[
        "click>=8.0.0",
        "python-dotenv>=1.0.0",
        "pydantic>=1.0.0,<2.0.0",  # LangGraph와 호환성 유지
        "langchain>=0.1.0",
        "langchain-anthropic>=0.1.1",
        "langchain-openai>=0.1.1",
        "langchain-google-genai>=0.1.1",
        "langchain-huggingface>=0.0.1",
        "langgraph>=0.0.10",
        "anthropic>=0.8.0",
        "openai>=1.0.0",
        "google-generativeai>=0.3.0",
        "huggingface-hub>=0.18.0",
        "markdown>=3.4.0",
    ],
    extras_require={
        "dev": [
            "pytest",
            "black",
            "flake8",
        ],
    },
    entry_points={
        "console_scripts": [
            "nurexia=nurexia.cli:cli",
        ],
    },
)
```

## 6. 구현 순서 및 일정

1. **환경 설정 및 기본 구조 (1일)**
   - 패키지 구조 설정
   - 의존성 관리 설정
   - `.env.example` 생성

2. **설정 관리 구현 (1일)**
   - `config.py` 모듈 구현
   - 환경 변수 로딩 메커니즘 구현

3. **Provider 추상화 레이어 구현 (2일)**
   - 기본 인터페이스 정의
   - Anthropic Provider 구현
   - OpenAI Provider 구현
   - 다른 Provider 구현

4. **LangGraph 통합 (2일)**
   - 상태 모델 정의
   - 노드 함수 구현
   - 워크플로우 구성

5. **CLI 인터페이스 확장 (1일)**
   - 명령행 옵션 추가
   - 인터랙티브 모드 구현

6. **출력 포맷 및 스트리밍 구현 (1일)**
   - 다양한 출력 포맷 지원
   - 스트리밍 기능 구현

7. **테스트 및 문서화 (2일)**
   - 단위 테스트 작성
   - 문서 업데이트

## 7. 위험 요소 및 대응 방안

1. **API 키 관리와 보안**
   - 비밀 관리: `.env` 파일을 `.gitignore`에 추가하여 실수로 커밋되지 않도록 함
   - 환경 변수 검증: 필수 API 키 없이 실행 시 명확한 오류 메시지 제공
   - 안전한 저장: API 키를 애플리케이션 내에 하드코딩하지 않고, 환경 변수로만 처리

2. **다양한 Provider 간 일관성**
   - 공통 인터페이스: 모든 Provider가 동일한 인터페이스를 구현하도록 강제
   - 모델 매핑: 각 Provider별 모델 이름과 특성을 일관되게 관리
   - 오류 처리: Provider별 오류를 표준화된 형식으로 변환

3. **LangGraph 통합 복잡성**
   - 단계적 접근: 기본 기능부터 구현 후 점진적으로 고급 기능 추가
   - 분리된 상태 관리: 그래프 상태를 명확히 정의하여 복잡성 관리
   - 재사용 가능한 노드: 노드 함수를 작고 재사용 가능하게 설계

4. **CLI 사용자 경험**
   - 명확한 오류 메시지: 사용자가 문제를 쉽게 식별하고 해결할 수 있도록 상세한 메시지 제공
   - 점진적 UI: 기본 기능은 간단하게 유지하면서 고급 기능은 옵션으로 제공
   - 도움말과 예제: 각 기능에 대한 상세한 도움말과 사용 예제 제공

## 8. 참고 자료

- LangChain 문서: https://python.langchain.com/
- LangGraph 문서: https://python.langchain.com/docs/langgraph/
- Anthropic API 문서: https://docs.anthropic.com/
- OpenAI API 문서: https://platform.openai.com/docs/
- Click 문서: https://click.palletsprojects.com/