"""
Utility functions for Nurexia
"""

def get_system_info():
    """
    Get basic system information.

    Returns:
        dict: A dictionary containing system information.
    """
    import platform
    import os

    info = {
        "system": platform.system(),
        "release": platform.release(),
        "version": platform.version(),
        "machine": platform.machine(),
        "processor": platform.processor(),
        "python_version": platform.python_version(),
        "user": os.getlogin(),
    }

    return info