import requests
from django.conf import settings

class GitHubClientException(Exception):
    pass

class GitHubService:
    """
    Service wrapper for the GitHub REST API.
    Handles authentication via Bearer token to fetch user repositories and PRs.
    """
    BASE_URL = "https://api.github.com"

    def __init__(self, access_token):
        self.access_token = access_token
        self.headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Accept": "application/vnd.github.v3+json"
        }

    def fetch_user_repositories(self):
        """Fetches all repositories accessible by the authenticated user."""
        url = f"{self.BASE_URL}/user/repos?sort=updated"
        response = requests.get(url, headers=self.headers)
        
        if response.status_code != 200:
            raise GitHubClientException(f"Failed to fetch repos: {response.json().get('message')}")
        
        return response.json()

    def fetch_pull_request_files(self, owner, repo, pull_number):
        """Fetches the files changed in a specific Pull Request."""
        url = f"{self.BASE_URL}/repos/{owner}/{repo}/pulls/{pull_number}/files"
        response = requests.get(url, headers=self.headers)
        
        if response.status_code != 200:
            raise GitHubClientException(f"Failed to fetch PR files: {response.text}")
        
        return response.json()
    
    def create_webhook(self, owner, repo, target_url, secret):
        """Registers a webhook on the repository to listen for Push or PR events."""
        url = f"{self.BASE_URL}/repos/{owner}/{repo}/hooks"
        payload = {
            "name": "web",
            "active": True,
            "events": ["push", "pull_request"],
            "config": {
                "url": target_url,
                "content_type": "json",
                "secret": secret,
                "insecure_ssl": "0"
            }
        }
        response = requests.post(url, headers=self.headers, json=payload)
        if response.status_code != 201:
            raise GitHubClientException(f"Failed to create webhook: {response.text}")
        return response.json()
