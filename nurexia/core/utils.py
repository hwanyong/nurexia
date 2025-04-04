"""
Utility functions for Nurexia
"""

import platform
import os
import logging
from typing import Dict, Any

# 기본 로거 설정
logger = logging.getLogger(__name__)

def get_system_info() -> Dict[str, Any]:
    """
    Get basic system information.

    Returns:
        dict: A dictionary containing system information.
    """
    try:
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
    except Exception as e:
        logger.error(f"Error getting system info: {e}")
        return {"error": str(e)}