import click
import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

@click.command()
@click.option('-m', '--mode', type=click.Choice(['agent', 'chat', 'edit']), default='chat', help='Operation mode: agent, chat, or edit')
@click.option('-ws', '--workspace', type=click.Path(exists=True, file_okay=False, dir_okay=True, resolve_path=True), help='Set the workspace directory')
@click.option('--show-env', is_flag=True, help='Show environment variables from .env file')
def cli(mode, workspace, show_env):
    """Terminal command line tool for nurexia."""

    # Workspace directory handling
    if workspace:
        working_dir = workspace
    else:
        working_dir = os.getcwd()

    click.echo(f"Running nurexia in {mode} mode")
    click.echo(f"Workspace directory: {working_dir}")

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
