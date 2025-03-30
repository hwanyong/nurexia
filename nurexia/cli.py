#!/usr/bin/env python3
"""
Nurexia CLI entry point
"""

import click
import json
from . import __version__
from .core.utils import get_system_info

@click.group()
@click.version_option(version=__version__)
def cli():
    """Nurexia CLI tool."""
    pass

@cli.command()
def hello():
    """Say hello."""
    click.echo("Hello from Nurexia!")

@cli.command()
@click.argument("name")
def greet(name):
    """Greet someone."""
    click.echo(f"Hello, {name}!")

@cli.command()
@click.option("--format", "-f", type=click.Choice(["text", "json"]), default="text", help="Output format")
def system_info(format):
    """Display system information."""
    info = get_system_info()

    if format == "json":
        click.echo(json.dumps(info, indent=2))
    else:
        for key, value in info.items():
            click.echo(f"{key}: {value}")

def main():
    """Main entry point for the CLI."""
    cli()

if __name__ == "__main__":
    main()