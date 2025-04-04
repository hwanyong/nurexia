import click
import os

@click.command()
@click.option('-m', '--mode', type=click.Choice(['agent', 'chat', 'edit']), default='chat', help='Operation mode: agent, chat, or edit')
@click.option('-ws', '--workspace', type=click.Path(exists=True, file_okay=False, dir_okay=True, resolve_path=True), help='Set the workspace directory')
def cli(mode, workspace):
    """Terminal command line tool for nurexia."""

    # Workspace directory handling
    if workspace:
        working_dir = workspace
    else:
        working_dir = os.getcwd()

    click.echo(f"Running nurexia in {mode} mode")
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
