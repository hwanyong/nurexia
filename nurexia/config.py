"""
환경 변수 및 설정 관리 모듈.
"""
from typing import Dict, Any, Optional
from dotenv import load_dotenv
import os

# .env 파일 로드
load_dotenv()

class ConfigManager:
    """환경 변수 및 설정 관리 클래스"""

    def __init__(self):
        """설정 매니저 초기화"""
        self.app_name = "nurexia"
        self.debug = self._get_bool_env("NUREXIA_DEBUG", False)
        self.log_level = os.getenv("NUREXIA_LOG_LEVEL", "INFO")
        self._providers_config = {}

    def _get_bool_env(self, key: str, default: bool) -> bool:
        """환경 변수에서 불리언 값을 가져옴"""
        value = os.getenv(key, str(default)).lower()
        return value in ('true', '1', 't', 'y', 'yes')

    def get_provider_config(self, provider_name: str) -> Dict[str, Any]:
        """특정 Provider의 설정 가져오기"""
        if provider_name not in self._providers_config:
            if provider_name == "anthropic":
                self._providers_config[provider_name] = {
                    "api_key": os.getenv("ANTHROPIC_API_KEY"),
                    "default_model": os.getenv("ANTHROPIC_DEFAULT_MODEL", "claude-3-7-sonnet-20250219")
                }
            elif provider_name == "openai":
                self._providers_config[provider_name] = {
                    "api_key": os.getenv("OPENAI_API_KEY"),
                    "default_model": os.getenv("OPENAI_DEFAULT_MODEL", "gpt-4.5-preview-2025-02-27")
                }
            elif provider_name == "google":
                self._providers_config[provider_name] = {
                    "api_key": os.getenv("GOOGLE_API_KEY"),
                    "default_model": os.getenv("GOOGLE_DEFAULT_MODEL", "gemini-2.0-flash-001")
                }
            elif provider_name == "huggingface":
                self._providers_config[provider_name] = {
                    "api_key": os.getenv("HUGGINGFACE_API_KEY"),
                    "default_model": os.getenv("HUGGINGFACE_DEFAULT_MODEL", "HuggingFaceH4/zephyr-7b-beta"),
                    "api_url": os.getenv("HUGGINGFACE_API_URL", "https://api-inference.huggingface.co/models/")
                }
            elif provider_name == "ollama":
                self._providers_config[provider_name] = {
                    "host": os.getenv("OLLAMA_HOST", "http://localhost:11434"),
                    "default_model": os.getenv("OLLAMA_DEFAULT_MODEL", "gemma3:12b")
                }
            else:
                # 알 수 없는 provider는 빈 설정 반환
                self._providers_config[provider_name] = {}

        return self._providers_config[provider_name]

    def validate_provider(self, provider_name: str) -> bool:
        """Provider 설정이 유효한지 검증"""
        try:
            config = self.get_provider_config(provider_name)
            # 필수 환경 변수 검증 로직
            if provider_name in ["anthropic", "openai", "google", "huggingface"]:
                return bool(config.get("api_key"))
            elif provider_name == "ollama":
                return bool(config.get("host"))
            return False
        except Exception:
            return False

# 싱글톤 인스턴스 생성
config_manager = ConfigManager()