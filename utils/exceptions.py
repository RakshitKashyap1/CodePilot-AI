from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    """
    Custom exception handler for Django Rest Framework that adds
    the `status_code` to the response and formats all errors consistently.
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    if response is not None:
        # Extract a meaningful message from validation errors
        message = response.data.get('detail', None)
        if not message:
            # Validation errors use field names as keys, e.g. {"email": ["Enter a valid email."]}
            for field, errors in response.data.items():
                if isinstance(errors, list) and len(errors) > 0:
                    message = str(errors[0])
                    break
                elif isinstance(errors, str):
                    message = errors
                    break
            if not message:
                message = 'An error occurred.'

        custom_response_data = {
            'success': False,
            'error': {
                'status_code': response.status_code,
                'message': message,
                'details': response.data
            }
        }
        
        # Remove the default 'detail' key if it exists to clean up the response
        if 'detail' in custom_response_data['error']['details']:
            del custom_response_data['error']['details']['detail']
            
        response.data = custom_response_data

    return response
