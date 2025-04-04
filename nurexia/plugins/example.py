"""
Example plugin for Nurexia.

This demonstrates how to create a plugin for the Nurexia CLI.
"""

import click

# 플러그인 등록 함수 정의
def register_commands(cli, registry):
    """Register plugin commands with the CLI."""

    @registry.register("example")
    @cli.command()
    @click.option("--name", "-n", default="world", help="Name to greet")
    def example(name):
        """Example plugin command."""
        click.echo(f"Hello from the example plugin, {name}!")

    return [example]  # 등록된 명령어 반환

# 향후 확장을 위한 인터페이스 정의
# 이 부분은 langChain/langGraph 통합 시 활용할 수 있습니다
class PluginInterface:
    """Interface for creating advanced plugins."""

    def __init__(self, name):
        self.name = name

    def initialize(self):
        """Initialize the plugin."""
        pass

    def execute(self, *args, **kwargs):
        """Execute the plugin."""
        pass

    def cleanup(self):
        """Clean up resources."""
        pass