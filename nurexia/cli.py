#!/usr/bin/env python3
"""
Nurexia CLI entry point
"""

import click
import json
import importlib
import pkgutil
import logging
from pathlib import Path
from typing import Dict, Any, Optional, List

from . import __version__
from .core.utils import get_system_info

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class CommandRegistry:
    """Command registry for managing and extending CLI commands."""

    _commands = {}

    @classmethod
    def register(cls, name):
        """Decorator to register commands."""
        def wrapper(command_func):
            cls._commands[name] = command_func
            return command_func
        return wrapper

    @classmethod
    def get_commands(cls):
        """Get all registered commands."""
        return cls._commands

@click.group()
@click.version_option(version=__version__)
def cli():
    """Nurexia CLI tool."""
    pass

@CommandRegistry.register("hello")
@cli.command()
def hello():
    """Say hello."""
    click.echo("Hello from Nurexia!")

@CommandRegistry.register("greet")
@cli.command()
@click.argument("name")
def greet(name):
    """Greet someone."""
    click.echo(f"Hello, {name}!")

@CommandRegistry.register("system_info")
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

def load_plugins():
    """
    동적으로 플러그인을 로드합니다.
    나중에 langChain/langGraph 등의 플러그인을 쉽게 추가할 수 있습니다.
    """
    try:
        from .plugins import __path__ as plugin_path
        for _, name, _ in pkgutil.iter_modules(plugin_path):
            try:
                # 플러그인 모듈 로드
                plugin_module = importlib.import_module(f'.plugins.{name}', package='nurexia')

                # register_commands 함수가 있는지 확인
                if hasattr(plugin_module, 'register_commands'):
                    # CLI 및 레지스트리 객체 전달
                    plugin_module.register_commands(cli, CommandRegistry)
                    logger.info(f"Loaded plugin: {name}")
            except ImportError as e:
                logger.error(f"Failed to load plugin {name}: {e}")
    except ImportError:
        logger.debug("No plugins package found.")
        pass

def main():
    """Main entry point for the CLI."""
    # 플러그인 로드
    load_plugins()
    cli()

if __name__ == "__main__":
    main()