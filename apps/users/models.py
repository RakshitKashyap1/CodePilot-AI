from django.contrib.auth.models import AbstractUser
from django.db import models
from core.models import TimeStampedModel

class User(AbstractUser, TimeStampedModel):
    """
    Custom user model for CodePilot AI.
    Inherits from AbstractUser to keep Django's standard auth features
    and TimeStampedModel for UUID and timestamps.
    """
    class Role(models.TextChoices):
        DEVELOPER = 'DEVELOPER', 'Developer'
        ADMIN = 'ADMIN', 'Admin'
        MANAGER = 'MANAGER', 'Manager'

    email = models.EmailField(unique=True, db_index=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.DEVELOPER)
    github_username = models.CharField(max_length=100, blank=True, null=True)
    google_id = models.CharField(max_length=255, blank=True, null=True)

    # Tell Django to use email for login instead of username
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.email} ({self.role})"
