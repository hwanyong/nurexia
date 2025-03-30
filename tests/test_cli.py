"""
Tests for the CLI functionality
"""

import unittest
from click.testing import CliRunner
from nurexia.cli import cli

class TestCLI(unittest.TestCase):
    """Test case for the CLI."""

    def setUp(self):
        """Set up test environment."""
        self.runner = CliRunner()

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

if __name__ == "__main__":
    unittest.main()