import click

@click.command()
@click.option('-m', '--mode', type=click.Choice(['agent', 'chat', 'edit']), default='chat', help='Operation mode: agent, chat, or edit')
def cli(mode):
    """Terminal command line tool for nurexia."""
    click.echo(f"Running nurexia in {mode} mode")

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
