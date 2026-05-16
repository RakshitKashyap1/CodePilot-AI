from rest_framework.response import Response

def api_response(data=None, message="Success", status_code=200, success=True):
    """
    Utility function to standardize all API success responses.
    """
    return Response({
        'success': success,
        'message': message,
        'data': data
    }, status=status_code)
