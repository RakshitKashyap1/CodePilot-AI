"""
Custom Django middleware for CodePilot AI.

Add middleware classes here and reference them in config/settings.py MIDDLEWARE list.
Example:

    class RequestTimingMiddleware:
        def __init__(self, get_response):
            self.get_response = get_response

        def __call__(self, request):
            import time
            start = time.time()
            response = self.get_response(request)
            duration = int((time.time() - start) * 1000)
            response['X-Request-Duration-Ms'] = str(duration)
            return response
"""
