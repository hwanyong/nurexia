"""
출력 포맷팅 기능 구현 모듈
다양한 출력 형식(text, json, markdown)을 지원합니다.
"""

import json
from typing import Any, Dict, List, Optional


def format_output(response: str, output_format: str = "text") -> str:
    """응답을 지정된 형식으로 포맷팅합니다.

    Args:
        response: LLM의 응답 텍스트
        output_format: 출력 형식 (text, json, markdown)

    Returns:
        포맷팅된 응답 문자열
    """
    if output_format == "text":
        return response
    elif output_format == "json":
        return json.dumps({"response": response}, ensure_ascii=False, indent=2)
    elif output_format == "markdown":
        return f"```markdown\n{response}\n```"
    else:
        # 알 수 없는 형식은 기본 텍스트로 반환
        return response


def format_error(error_message: str, verbose: bool = False, details: Optional[Dict[str, Any]] = None) -> str:
    """오류 메시지를 포맷팅합니다.

    Args:
        error_message: 기본 오류 메시지
        verbose: 상세 로깅 활성화 여부
        details: 추가 오류 세부 정보

    Returns:
        포맷팅된 오류 메시지
    """
    if not verbose or not details:
        return f"Error: {error_message}"

    # 상세 모드일 경우 추가 정보 포함
    result = f"Error: {error_message}\n\nDetails:\n"
    for key, value in details.items():
        result += f"  {key}: {value}\n"

    return result