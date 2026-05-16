import os
import json
import time
import google.generativeai as genai
from django.conf import settings
from .prompt_templates import CODE_REVIEW_SYSTEM_PROMPT

class AIServiceException(Exception):
    pass

class GeminiClient:
    """
    Service class to handle interactions with the Google Gemini API.
    Includes retry logic and structured JSON parsing.
    """
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise AIServiceException("GEMINI_API_KEY environment variable is missing.")
        
        genai.configure(api_key=api_key)
        # Using gemini-1.5-flash for speed/cost or gemini-1.5-pro for complex reasoning
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    def generate_code_review(self, code_snippet, language, retries=3):
        """
        Calls Gemini to generate a code review, enforcing JSON output.
        Implements a simple exponential backoff for rate limits/transient errors.
        """
        prompt = CODE_REVIEW_SYSTEM_PROMPT.format(language=language, code_snippet=code_snippet)

        for attempt in range(retries):
            try:
                # We request application/json specifically if supported, or rely on prompt engineering
                response = self.model.generate_content(
                    prompt,
                    generation_config=genai.types.GenerationConfig(
                        temperature=0.2, # Low temperature for more analytical/predictable responses
                        response_mime_type="application/json",
                    )
                )

                response_text = response.text
                
                # Parse JSON
                try:
                    parsed_json = json.loads(response_text)
                    return {
                        "success": True,
                        "data": parsed_json,
                        # Gemini SDK doesn't always provide exact token counts synchronously in all versions,
                        # but we can mock or use response.usage_metadata if available.
                        "usage": getattr(response, 'usage_metadata', None)
                    }
                except json.JSONDecodeError:
                    raise AIServiceException("AI did not return valid JSON.")

            except Exception as e:
                if attempt == retries - 1:
                    return {"success": False, "error": str(e)}
                time.sleep(2 ** attempt) # Exponential backoff: 1s, 2s, 4s...
