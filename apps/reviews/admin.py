from django.contrib import admin
from .models import Review, ReviewFeedback, RepositoryAnalysis


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'title', 'language', 'status', 'overall_score', 'created_at')
    list_filter = ('status', 'language', 'is_saved')
    search_fields = ('title', 'summary')
    ordering = ('-created_at',)


@admin.register(ReviewFeedback)
class ReviewFeedbackAdmin(admin.ModelAdmin):
    list_display = ('id', 'review', 'issue_type', 'severity', 'file_path')
    list_filter = ('severity', 'issue_type')
    search_fields = ('description',)


@admin.register(RepositoryAnalysis)
class RepositoryAnalysisAdmin(admin.ModelAdmin):
    list_display = ('repo_name', 'user', 'is_private', 'last_analyzed_at', 'created_at')
    list_filter = ('is_private',)
    search_fields = ('repo_name',)
