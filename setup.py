from setuptools import setup, find_packages

setup(
    name="nurexia",
    version="0.2.0",
    packages=find_packages(),
    install_requires=[
        "click",
        "python-dotenv",
        "langchain",
        "langchain-anthropic",
        "anthropic",
    ],
    entry_points={
        "console_scripts": [
            "nurexia=nurexia.cli:cli",
        ],
    },
)