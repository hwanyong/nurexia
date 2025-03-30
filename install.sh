#!/bin/bash

set -e

echo "Installing Nurexia..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is required but it's not installed. Please install Python 3 and try again."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "pip3 is required but it's not installed. Please install pip and try again."
    exit 1
fi

# Create a temporary directory
TEMP_DIR=$(mktemp -d)
CURRENT_DIR=$(pwd)

cleanup() {
    echo "Cleaning up..."
    cd "$CURRENT_DIR"
    rm -rf "$TEMP_DIR"
}

# Set trap to ensure cleanup on exit
trap cleanup EXIT

# Install the package
echo "Installing package from current directory..."
pip3 install --user .

echo "Nurexia has been installed successfully!"
echo "You can now use the 'nurexia' command in your terminal."

# Verify installation
if command -v nurexia &> /dev/null; then
    echo "Installation verified. You can run 'nurexia --help' to get started."
else
    echo "Installation seems to have completed, but the 'nurexia' command is not in your PATH."
    echo "You might need to add your Python user bin directory to your PATH."

    # Suggest PATH addition based on platform
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "For macOS, add the following to your ~/.bash_profile or ~/.zshrc:"
        echo "export PATH=\$PATH:\$HOME/Library/Python/$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')/bin"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "For Linux, add the following to your ~/.bashrc:"
        echo "export PATH=\$PATH:\$HOME/.local/bin"
    fi
fi