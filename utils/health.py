from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db import connection

class HealthCheckView(APIView):
    """
    Standard health check endpoint for Load Balancers and K8s.
    Verifies that the API can connect to the Database.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        health = {
            "status": "healthy",
            "services": {
                "api": "online",
                "database": "offline"
            }
        }
        
        try:
            # Try to execute a simple query to verify DB connection
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            health["services"]["database"] = "online"
        except Exception as e:
            health["status"] = "unhealthy"
            health["error"] = str(e)
            return Response(health, status=503)

        return Response(health)
