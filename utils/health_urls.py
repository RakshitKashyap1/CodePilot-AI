from django.urls import path
from utils.health import HealthCheckView

urlpatterns = [
    path('', HealthCheckView.as_view(), name='health_check'),
]
