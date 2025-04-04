#!/usr/bin/env python3
"""
Nurexia CLI entry point
"""

import click
import json
import importlib
import pkgutil
import logging
import os
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

class AppState:
    """Manage the application state with persistence to a file."""

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AppState, cls).__new__(cls)
            cls._instance._state_file = os.path.expanduser('~/.nurexia/state.json')
            cls._instance._ensure_state_directory()
            cls._instance._load_state()
        return cls._instance

    def _ensure_state_directory(self):
        """Ensure the state directory exists."""
        state_dir = os.path.dirname(self._state_file)
        os.makedirs(state_dir, exist_ok=True)

    def _load_state(self):
        """Load state from file or initialize default state."""
        try:
            if os.path.exists(self._state_file):
                with open(self._state_file, 'r') as f:
                    state = json.load(f)
                self._mode = state.get('mode')
                self._verbose = state.get('verbose', False)
                self._is_running = state.get('is_running', False)
                logger.debug(f"Loaded state: {state}")
            else:
                self._mode = None
                self._verbose = False
                self._is_running = False
                logger.debug("No state file found, using defaults")
        except Exception as e:
            logger.error(f"Error loading state: {e}")
            self._mode = None
            self._verbose = False
            self._is_running = False

    def _save_state(self):
        """Save state to file."""
        try:
            state = {
                'mode': self._mode,
                'verbose': self._verbose,
                'is_running': self._is_running
            }
            with open(self._state_file, 'w') as f:
                json.dump(state, f, indent=2)
            logger.debug(f"Saved state: {state}")
        except Exception as e:
            logger.error(f"Error saving state: {e}")

    @property
    def mode(self) -> Optional[str]:
        """Get the current mode."""
        return self._mode

    @mode.setter
    def mode(self, value: str):
        """Set the current mode."""
        self._mode = value
        logger.debug(f"Mode set to: {value}")
        self._save_state()

    @property
    def verbose(self) -> bool:
        """Get the verbose setting."""
        return self._verbose

    @verbose.setter
    def verbose(self, value: bool):
        """Set the verbose setting."""
        self._verbose = value
        logger.debug(f"Verbose set to: {value}")
        self._save_state()

    @property
    def is_running(self) -> bool:
        """Get the running state."""
        return self._is_running

    @is_running.setter
    def is_running(self, value: bool):
        """Set the running state."""
        self._is_running = value
        logger.debug(f"Running state set to: {value}")
        self._save_state()

    def reset(self):
        """Reset the state."""
        self._mode = None
        self._verbose = False
        self._is_running = False
        logger.debug("Application state reset")
        self._save_state()

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

@click.group(invoke_without_command=True)
@click.option("--mode", "-m", type=click.Choice(["agent", "edit", "chat"]), help="Operation mode")
@click.option("--verbose", "-v", is_flag=True, help="Enable verbose output")
@click.version_option(version=__version__)
@click.pass_context
def cli(ctx, mode, verbose):
    """Nurexia CLI tool."""
    if ctx.invoked_subcommand is None and mode:
        # 애플리케이션 상태 설정
        app_state = AppState()
        app_state.mode = mode
        app_state.verbose = verbose
        app_state.is_running = True

        if verbose:
            click.echo(f"Running in {mode} mode with verbose output.")
        else:
            click.echo(f"Running in {mode} mode.")

        if mode == "agent":
            click.echo("Agent mode: AI agent will help you with tasks.")
        elif mode == "edit":
            click.echo("Edit mode: Edit files with AI assistance.")
        elif mode == "chat":
            click.echo("Chat mode: Chat with AI assistant.")

        # 실제 작업 실행 (여기서는 상태 값만 출력하는 예제)
        click.echo(f"Current application state: mode={app_state.mode}, verbose={app_state.verbose}, running={app_state.is_running}")
    elif ctx.invoked_subcommand is None and not mode:
        click.echo(ctx.get_help())

@CommandRegistry.register("state")
@cli.command()
def state():
    """Show current application state."""
    app_state = AppState()
    if app_state.mode is None:
        click.echo("No active mode. Run the application with '-m MODE' first.")
    else:
        click.echo(f"Current state: mode={app_state.mode}, verbose={app_state.verbose}, running={app_state.is_running}")

@CommandRegistry.register("reset")
@cli.command()
def reset():
    """Reset application state."""
    app_state = AppState()
    app_state.reset()
    click.echo("Application state has been reset.")

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