import os
import json
import time
import requests
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
        self.model_name = "gemini-2.0-flash"

    def generate_code_review(self, code_snippet, language, retries=3):
        prompt = CODE_REVIEW_SYSTEM_PROMPT.format(language=language, code_snippet=code_snippet)

        for attempt in range(retries):
            try:
                response = self.client.models.generate_content(
                    model=self.model_name,
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


class HuggingFaceClient:
    HF_API_URL = "https://api-inference.huggingface.co/models/{model}"

    def __init__(self):
        api_token = os.getenv("HF_API_TOKEN", "")
        if not api_token:
            raise AIServiceException("HF_API_TOKEN environment variable is missing.")
        self.api_token = api_token
        self.model_name = os.getenv("HF_MODEL", "Qwen/Qwen2.5-Coder-7B-Instruct")
        self.headers = {
            "Authorization": f"Bearer {api_token}",
            "Content-Type": "application/json",
        }

    def generate_code_review(self, code_snippet, language, retries=3):
        prompt = CODE_REVIEW_SYSTEM_PROMPT.format(language=language, code_snippet=code_snippet)
        url = self.HF_API_URL.format(model=self.model_name)

        for attempt in range(retries):
            try:
                response = requests.post(
                    url,
                    headers=self.headers,
                    json={
                        "inputs": prompt,
                        "parameters": {
                            "max_new_tokens": 4096,
                            "temperature": 0.2,
                            "return_full_text": False,
                        },
                    },
                    timeout=120,
                )

                if response.status_code == 503:
                    if attempt < retries - 1:
                        time.sleep(2 ** attempt)
                        continue
                    return {"success": False, "error": "Model is loading on Hugging Face. Try again later."}

                response.raise_for_status()
                result = response.json()

                generated_text = ""
                if isinstance(result, list) and len(result) > 0:
                    generated_text = result[0].get("generated_text", "")
                elif isinstance(result, dict):
                    generated_text = result.get("generated_text", "")

                parsed_json = self._extract_json(generated_text)
                if parsed_json is None:
                    raise AIServiceException("AI did not return valid JSON.")

                return {
                    "success": True,
                    "data": parsed_json,
                    "usage": None,
                }

            except requests.Timeout:
                if attempt == retries - 1:
                    return {"success": False, "error": "Hugging Face API timed out after 120 seconds."}
                time.sleep(2 ** attempt)

            except Exception as e:
                if attempt == retries - 1:
                    return {"success": False, "error": str(e)}
                time.sleep(2 ** attempt)

    @staticmethod
    def _extract_json(text):
        text = text.strip()

        # Try direct parse first
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass

        # Strip markdown code fences (```json ... ```)
        if "```" in text:
            import re
            match = re.search(r'```(?:json)?\s*\n?(.*?)\n?```', text, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(1).strip())
                except json.JSONDecodeError:
                    pass

        # Try to find JSON object in the text (between first { and last })
        brace_start = text.find('{')
        brace_end = text.rfind('}')
        if brace_start != -1 and brace_end != -1 and brace_end > brace_start:
            try:
                return json.loads(text[brace_start:brace_end + 1])
            except json.JSONDecodeError:
                pass

        return None


def get_ai_client():
    provider = os.getenv("AI_PROVIDER", "gemini").strip().lower()
    if provider == "huggingface":
        return HuggingFaceClient()
    return GeminiClient()
