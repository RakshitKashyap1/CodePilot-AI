from django.db import models
from django.conf import settings
from core.models import TimeStampedModel

class AIUsageLogs(TimeStampedModel):
    """
    Logs every interaction with the AI provider for tracking latency, cost, and rate limits.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ai_logs')
    model_used = models.CharField(max_length=100) # e.g., "gemini-1.5-pro", "gpt-4"
    prompt_tokens = models.IntegerField(default=0)
    completion_tokens = models.IntegerField(default=0)
    total_tokens = models.IntegerField(default=0)
    cost = models.DecimalField(max_digits=10, decimal_places=6, default=0.00) # Calculated cost
    latency_ms = models.IntegerField(default=0) # Track AI speed
    successful = models.BooleanField(default=True)

    def __str__(self):
        return f"Log {self.id} - {self.model_used} - {self.user.email}"

class Notification(TimeStampedModel):
    """
    Stores system notifications for the user (e.g. "Review completed").
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False, db_index=True)

    def __str__(self):
        return f"Notification {self.id} for {self.user.email}"
