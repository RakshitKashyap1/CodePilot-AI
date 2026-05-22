from django.contrib import admin
from .models import AIUsageLogs, Notification


@admin.register(AIUsageLogs)
class AIUsageLogsAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'model_used', 'total_tokens', 'cost', 'successful', 'created_at')
    list_filter = ('model_used', 'successful')
    search_fields = ('user__email',)
    ordering = ('-created_at',)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'is_read', 'created_at')
    list_filter = ('is_read',)
    search_fields = ('title', 'user__email')
