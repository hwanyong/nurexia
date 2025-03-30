# Nurexia

A command-line tool that can be installed via pip or downloaded from the web.

## Installation

### Via pip

```bash
pip install nurexia
```

### Via direct download

Download the latest release from [GitHub](https://github.com/yourusername/nurexia/releases) and follow the installation instructions.

### Via one-liner (Unix/macOS)

```bash
curl -sSL https://raw.githubusercontent.com/yourusername/nurexia/main/install.sh | bash
```

Or with wget:

```bash
wget -qO- https://raw.githubusercontent.com/yourusername/nurexia/main/install.sh | bash
```

## Usage

After installation, you can use the `nurexia` command in your terminal:

```bash
nurexia --help  # Show help and available commands
nurexia hello   # Say hello
nurexia greet John  # Greet someone
nurexia system-info  # Display system information
```

## Features

- Simple CLI interface with clear help messages
- System information retrieval
- Friendly greeting functionality
- Extensible architecture for adding more commands

## Development

To set up the development environment:

```bash
# Clone the repository
git clone https://github.com/yourusername/nurexia.git
cd nurexia

# Install in development mode
pip install -e .

# Now you can run the CLI directly and changes will be reflected immediately
nurexia --help
```

### Project Structure

```
nurexia/
├── nurexia/
│   ├── __init__.py        # Package initialization
│   ├── cli.py             # Command-line interface
│   └── core/              # Core functionality
│       ├── __init__.py
│       └── utils.py       # Utility functions
├── tests/                 # Test directory
│   └── test_cli.py        # CLI tests
├── LICENSE                # MIT License
├── MANIFEST.in            # Package manifest
├── README.md              # This file
├── pyproject.toml         # Project metadata
├── setup.py               # Setup script
└── install.sh             # Web installation script
```

### Testing

To run tests:

```bash
python -m unittest discover tests
```

## License

MIT