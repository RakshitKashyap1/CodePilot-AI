from django.db import models
from django.conf import settings
from core.models import TimeStampedModel

class GitHubProfile(TimeStampedModel):
    """
    Stores GitHub OAuth tokens and profile metadata securely.
    """
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='github_profile')
    github_id = models.CharField(max_length=255, unique=True)
    access_token = models.CharField(max_length=255) # In production, this MUST be encrypted using a package like django-fernet-fields
    refresh_token = models.CharField(max_length=255, blank=True, null=True)
    avatar_url = models.URLField(blank=True, null=True)
    
    def __str__(self):
        return f"GitHub Profile for {self.user.email}"

class GitHubWebhook(TimeStampedModel):
    """
    Tracks active webhooks installed on the user's repositories.
    """
    repository = models.OneToOneField('reviews.RepositoryAnalysis', on_delete=models.CASCADE, related_name='webhook')
    hook_id = models.CharField(max_length=100)
    secret = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
