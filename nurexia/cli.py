import click
import os
import asyncio
import sys
from dotenv import load_dotenv

# Provider 모듈 import
from .providers import list_providers, test_provider_connection, get_provider
from .graph.state import GraphState, MessageRole
from .graph.workflow import create_workflow
from .utils.formatter import format_output, format_error
from .utils.streaming import execute_streaming

# .env 파일 로드
load_dotenv()

@click.command()
@click.option('-m', '--mode', type=click.Choice(['agent', 'chat', 'edit']), default='chat', help='Operation mode: agent, chat, or edit')
@click.option('-pv', '--provider', type=str, default='anthropic', help='AI provider to use (anthropic, openai, huggingface, ollama, google)')
@click.option('-md', '--model', type=str, default=None, help='Model to use (provider-specific)')
@click.option('-o', '--output', type=click.Choice(['text', 'json', 'markdown']), default='text', help='Output format')
@click.option('-v', '--verbose', is_flag=True, help='Enable verbose logging')
@click.option('-p', '--prompt', type=str, help='Prompt text (supports markdown)')
@click.option('-t', '--temperature', type=float, default=0.7, help='Temperature for generation (0.0-2.0)')
@click.option('--stream-mode', is_flag=True, help='Enable streaming output')
@click.option('-ws', '--workspace', type=click.Path(exists=True, file_okay=False, dir_okay=True, resolve_path=True), help='Set the workspace directory')
@click.option('--show-env', is_flag=True, help='Show environment variables from .env file')
@click.option('--test-connection', is_flag=True, help='Test the connection to the AI provider')
def cli(mode, provider, model, output, verbose, prompt, temperature, stream_mode, workspace, show_env, test_connection):
    """Terminal command line tool for nurexia."""

    # Workspace directory handling
    if workspace:
        working_dir = workspace
    else:
        working_dir = os.getcwd()

    # 환경 변수 출력
    if show_env:
        click.echo("\nEnvironment variables:")
        for key in os.environ:
            if key.startswith(("NUREXIA_", "ANTHROPIC_", "OPENAI_", "GOOGLE_", "HUGGINGFACE_", "OLLAMA_")):
                # API 키는 보안을 위해 마스킹
                value = os.environ[key]
                if "API_KEY" in key and value:
                    masked_value = value[:4] + "*" * (len(value) - 8) + value[-4:] if len(value) > 8 else "********"
                    click.echo(f"  {key}={masked_value}")
                else:
                    click.echo(f"  {key}={value}")
        return

    # 연결 테스트
    if test_connection:
        click.echo(f"\n{provider} Provider 연결 테스트 중...")
        success, message = test_provider_connection(provider, model)
        if success:
            click.secho(f"✅ {message}", fg="green")
        else:
            click.secho(f"❌ {message}", fg="red")
        return

    # 프롬프트 처리
    if prompt:
        # Provider 유효성 검증
        available_providers = list_providers()
        if provider not in available_providers:
            click.echo(format_error(f"Unknown provider '{provider}'. Available providers: {', '.join(available_providers.keys())}"))
            return 1

        # 모델 설정
        if model is None:
            model = available_providers[provider]["default_model"]
            if verbose:
                click.echo(f"Using default model for {provider}: {model}")

        # 온도 검증
        if temperature < 0 or temperature > 2:
            click.echo(format_error("Temperature must be between 0 and 2"))
            return 1

        # 옵션 설정
        options = {
            "temperature": temperature,
            "verbose": verbose
        }

        # 상태 초기화
        state = GraphState(
            provider=provider,
            model=model,
            working_directory=working_dir,
            mode=mode,
            options=options
        )

        # 사용자 입력 추가
        state.add_message(MessageRole.USER, prompt)

        # 워크플로우 생성
        workflow = create_workflow()

        # 스트리밍 모드인 경우
        if stream_mode:
            if verbose:
                click.echo(f"Running in streaming mode with {provider}/{model}")

            asyncio.run(execute_streaming(state))
        else:
            # 일반 실행
            if verbose:
                click.echo(f"Running with {provider}/{model}")

            try:
                result_state = asyncio.run(execute_workflow(workflow, state))

                # 결과 출력
                if result_state.error:
                    click.echo(format_error(result_state.error, verbose))
                    return 1
                elif result_state.result:
                    click.echo(format_output(result_state.result, output))
                else:
                    click.echo(format_error("No response generated"))
                    return 1
            except Exception as e:
                click.echo(format_error(str(e), verbose, {"type": type(e).__name__}))
                if verbose:
                    import traceback
                    click.echo(traceback.format_exc())
                return 1

        return 0

    # 일반 모드 실행 (프롬프트 없음)
    click.echo(f"Running nurexia in {mode} mode")
    click.echo(f"Provider: {provider}, Model: {model or 'default'}")
    click.echo(f"Workspace directory: {working_dir}")

    if mode == 'agent':
        # Agent mode functionality
        click.echo("Agent mode activated")
    elif mode == 'chat':
        # Chat mode functionality
        click.echo("Chat mode activated")
    elif mode == 'edit':
        # Edit mode functionality
        click.echo("Edit mode activated")


async def execute_workflow(workflow, state: GraphState) -> GraphState:
    """워크플로우 실행"""
    result = await workflow.ainvoke(state)
    return result


if __name__ == '__main__':
    cli()
