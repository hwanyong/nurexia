import click
import os
from dotenv import load_dotenv

# Provider 모듈 import
from .providers import list_providers, test_provider_connection

# .env 파일 로드
load_dotenv()

@click.command()
@click.option('-m', '--mode', type=click.Choice(['agent', 'chat', 'edit']), default='chat', help='Operation mode: agent, chat, or edit')
@click.option('-pv', '--provider', type=str, default='anthropic', help='AI provider to use (anthropic, openai, huggingface, ollama, google)')
@click.option('-md', '--model', type=str, default=None, help='Model to use (provider-specific)')
@click.option('-ws', '--workspace', type=click.Path(exists=True, file_okay=False, dir_okay=True, resolve_path=True), help='Set the workspace directory')
@click.option('--show-env', is_flag=True, help='Show environment variables from .env file')
@click.option('--test-connection', is_flag=True, help='Test the connection to the AI provider')
def cli(mode, provider, model, workspace, show_env, test_connection):
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

    # 연결 테스트
    if test_connection:
        click.echo(f"\n{provider} Provider 연결 테스트 중...")
        success, message = test_provider_connection(provider, model)
        if success:
            click.secho(f"✅ {message}", fg="green")
        else:
            click.secho(f"❌ {message}", fg="red")
        return

    # 일반 모드 실행
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

if __name__ == '__main__':
    cli()
