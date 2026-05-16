from django.urls import path
from .views import GitHubOAuthURLView, GitHubOAuthCallbackView, ImportRepositoryView

urlpatterns = [
    path('oauth/url/', GitHubOAuthURLView.as_view(), name='github_oauth_url'),
    path('oauth/callback/', GitHubOAuthCallbackView.as_view(), name='github_oauth_callback'),
    path('repos/import/', ImportRepositoryView.as_view(), name='github_import_repo'),
]
