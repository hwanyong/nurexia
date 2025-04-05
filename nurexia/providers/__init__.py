"""
AI Provider 모듈.
Provider 팩토리 및 관리 기능 제공.
"""
from typing import Dict, Type, Optional, List, Any

from .base import BaseProvider
from .anthropic import AnthropicProvider
from .openai import OpenAIProvider
from .google import GoogleProvider
from .huggingface import HuggingFaceProvider
from .ollama import OllamaProvider

# Provider 등록
PROVIDERS = {
    "anthropic": AnthropicProvider,
    "openai": OpenAIProvider,
    "google": GoogleProvider,
    "huggingface": HuggingFaceProvider,
    "ollama": OllamaProvider,
}

def get_provider(provider_name: str, model: Optional[str] = None, **kwargs) -> BaseProvider:
    """
    Provider 인스턴스 생성

    Args:
        provider_name: Provider 이름
        model: 사용할 모델명 (기본값: None, Provider 기본 모델 사용)
        **kwargs: 추가 옵션

    Returns:
        BaseProvider: Provider 인스턴스

    Raises:
        ValueError: 알 수 없는 Provider 이름
    """
    if provider_name not in PROVIDERS:
        raise ValueError(f"알 수 없는 Provider: {provider_name}. 사용 가능한 Provider: {', '.join(PROVIDERS.keys())}")

    provider_class = PROVIDERS[provider_name]
    return provider_class(model=model, **kwargs)

def list_providers() -> Dict[str, Dict[str, Any]]:
    """
    사용 가능한 Provider 목록 반환

    Returns:
        Dict[str, Dict[str, Any]]: Provider 정보
            {
                "provider_name": {
                    "name": "provider_name",
                    "default_model": "default_model",
                    "available_models": ["model1", "model2", ...]
                },
                ...
            }
    """
    result = {}
    for name, provider_class in PROVIDERS.items():
        result[name] = {
            "name": name,
            "default_model": provider_class.default_model,
            "available_models": provider_class.available_models
        }
    return result

def test_provider_connection(provider_name: str, model: Optional[str] = None, **kwargs) -> tuple[bool, str]:
    """
    Provider 연결 테스트

    Args:
        provider_name: Provider 이름
        model: 사용할 모델명
        **kwargs: 추가 옵션

    Returns:
        tuple[bool, str]: (성공 여부, 메시지)
    """
    try:
        provider = get_provider(provider_name, model, **kwargs)
        return provider.test_connection()
    except Exception as e:
        return False, f"Provider 초기화 오류: {str(e)}"

__all__ = ["get_provider", "list_providers", "test_provider_connection"]