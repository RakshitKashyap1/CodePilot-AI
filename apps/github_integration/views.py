import os
import secrets
import requests
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.conf import settings
from .models import GitHubProfile, GitHubWebhook
from apps.reviews.models import RepositoryAnalysis
from services.github_service import GitHubService
from utils.responses import api_response

class GitHubOAuthURLView(APIView):
    """Returns the URL for the frontend to redirect the user to GitHub's OAuth consent screen."""
    permission_classes = [AllowAny] # Or IsAuthenticated depending on flow

    def get(self, request):
        client_id = os.getenv('GITHUB_CLIENT_ID')
        # We request 'repo' scope to read code and install webhooks
        url = f"https://github.com/login/oauth/authorize?client_id={client_id}&scope=repo,user"
        return api_response(data={"oauth_url": url})

class GitHubOAuthCallbackView(APIView):
    """Exchanges the temporary code for an access token and links to the user."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        code = request.data.get('code')
        if not code:
            return api_response(message="Authorization code missing", success=False, status_code=400)

        # Exchange code for token
        response = requests.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": os.getenv('GITHUB_CLIENT_ID'),
                "client_secret": os.getenv('GITHUB_CLIENT_SECRET'),
                "code": code
            },
            headers={"Accept": "application/json"}
        )
        token_data = response.json()
        
        if 'access_token' not in token_data:
            return api_response(message="Failed to obtain access token", success=False, status_code=400)

        access_token = token_data['access_token']

        # Fetch GitHub User Info
        gh_service = GitHubService(access_token)
        # Assuming GitHubService has a method to get user info or we do a quick request here
        user_info_resp = requests.get("https://api.github.com/user", headers={"Authorization": f"Bearer {access_token}"})
        gh_user = user_info_resp.json()

        # Save or update profile
        profile, _ = GitHubProfile.objects.update_or_create(
            user=request.user,
            defaults={
                'github_id': str(gh_user.get('id')),
                'access_token': access_token,
                'avatar_url': gh_user.get('avatar_url')
            }
        )

        # Generate a webhook secret for future webhook creation
        webhook_secret = secrets.token_hex(32)

        return api_response(message="GitHub linked successfully", data={"webhook_secret": webhook_secret})

class ImportRepositoryView(APIView):
    """Fetches user repos from GitHub and imports a selected one into CodePilot."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """List all repos from GitHub for the user to choose from."""
        try:
            profile = request.user.github_profile
        except GitHubProfile.DoesNotExist:
            return api_response(message="GitHub not linked", success=False, status_code=400)

        service = GitHubService(profile.access_token)
        repos = service.fetch_user_repositories()
        
        # Simplify data for frontend
        clean_repos = [{"name": r["full_name"], "url": r["html_url"], "private": r["private"]} for r in repos]
        return api_response(data=clean_repos)

    def post(self, request):
        """Import a specific repo into the database."""
        repo_name = request.data.get('name')
        repo_url = request.data.get('url')
        is_private = request.data.get('private', False)

        repo, created = RepositoryAnalysis.objects.get_or_create(
            user=request.user,
            repo_url=repo_url,
            defaults={
                'repo_name': repo_name,
                'is_private': is_private
            }
        )
        msg = "Repository imported successfully." if created else "Repository already imported."
        return api_response(message=msg)
