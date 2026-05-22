import os
import json
import time
from google import genai
from google.genai import types
from .prompt_templates import CODE_REVIEW_SYSTEM_PROMPT


class AIServiceException(Exception):
    pass


class GeminiClient:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise AIServiceException("GEMINI_API_KEY environment variable is missing.")
        self.client = genai.Client(api_key=api_key)
        self.model = "gemini-2.0-flash"

    def generate_code_review(self, code_snippet, language, retries=3):
        prompt = CODE_REVIEW_SYSTEM_PROMPT.format(language=language, code_snippet=code_snippet)

        for attempt in range(retries):
            try:
                response = self.client.models.generate_content(
                    model=self.model,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.2,
                        response_mime_type="application/json",
                    )
                )

                response_text = response.text

                try:
                    parsed_json = json.loads(response_text)
                    return {
                        "success": True,
                        "data": parsed_json,
                        "usage": getattr(response, 'usage_metadata', None)
                    }
                except json.JSONDecodeError:
                    raise AIServiceException("AI did not return valid JSON.")

            except Exception as e:
                if attempt == retries - 1:
                    return {"success": False, "error": str(e)}
                time.sleep(2 ** attempt)
