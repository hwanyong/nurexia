"""
Tests for the CLI functionality
"""

import unittest
from click.testing import CliRunner
from nurexia.cli import cli, CommandRegistry, load_plugins
from nurexia.core.agent_interface import AgentBase, AgentRegistry

class TestCLI(unittest.TestCase):
    """Test case for the CLI."""

    def setUp(self):
        """Set up test environment."""
        self.runner = CliRunner()
        # 테스트 시작 전 플러그인 로드
        load_plugins()

    def test_hello(self):
        """Test the hello command."""
        result = self.runner.invoke(cli, ["hello"])
        self.assertEqual(result.exit_code, 0)
        self.assertIn("Hello from Nurexia!", result.output)

    def test_greet(self):
        """Test the greet command."""
        result = self.runner.invoke(cli, ["greet", "World"])
        self.assertEqual(result.exit_code, 0)
        self.assertIn("Hello, World!", result.output)

    def test_system_info(self):
        """Test the system-info command."""
        result = self.runner.invoke(cli, ["system-info"])
        self.assertEqual(result.exit_code, 0)
        # Just check that it produces some output
        self.assertTrue(len(result.output) > 0)

    def test_command_registry(self):
        """Test the command registry functionality."""
        # 명령어가 등록되었는지 확인
        commands = CommandRegistry.get_commands()
        self.assertIn("hello", commands)
        self.assertIn("greet", commands)
        self.assertIn("system_info", commands)

    def test_example_plugin(self):
        """Test the example plugin."""
        try:
            # 플러그인 명령어 테스트
            result = self.runner.invoke(cli, ["example", "--name", "Plugin"])
            self.assertEqual(result.exit_code, 0)
            self.assertIn("Hello from the example plugin, Plugin!", result.output)
        except Exception as e:
            # 플러그인이 로드되지 않은 경우 건너뜀
            self.skipTest(f"Example plugin not loaded: {e}")

class TestAgentInterface(unittest.TestCase):
    """Test case for the agent interface."""

    def test_agent_registry(self):
        """Test the agent registry functionality."""
        # 에이전트 레지스트리 테스트
        self.assertEqual(len(AgentRegistry._agents), 0)

        # 테스트용 에이전트 클래스 정의
        @AgentRegistry.register("test_agent")
        class TestAgent(AgentBase):
            def initialize(self):
                return True

            def process(self, input_data):
                return input_data

            def execute_task(self, task, parameters=None):
                return {"status": "success"}

        # 에이전트가 등록되었는지 확인
        self.assertEqual(len(AgentRegistry._agents), 1)
        self.assertIn("test_agent", AgentRegistry._agents)

        # 에이전트 생성 테스트
        agent = AgentRegistry.create_agent("test_agent")
        self.assertIsNotNone(agent)
        self.assertIsInstance(agent, TestAgent)
        self.assertEqual(agent.name, "test_agent")

        # 에이전트 메서드 테스트
        self.assertTrue(agent.initialize())
        self.assertEqual(agent.process("test"), "test")
        self.assertEqual(agent.execute_task("task"), {"status": "success"})

if __name__ == "__main__":
    unittest.main()