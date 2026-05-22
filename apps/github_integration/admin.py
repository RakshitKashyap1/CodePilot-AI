from django.contrib import admin
from .models import GitHubProfile, GitHubWebhook


@admin.register(GitHubProfile)
class GitHubProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'github_id', 'created_at')
    search_fields = ('user__email', 'github_id')


@admin.register(GitHubWebhook)
class GitHubWebhookAdmin(admin.ModelAdmin):
    list_display = ('repository', 'hook_id', 'is_active', 'created_at')
    list_filter = ('is_active',)
