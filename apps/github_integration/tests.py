import os
from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from unittest.mock import patch
from .models import GitHubProfile, GitHubWebhook
from apps.reviews.models import RepositoryAnalysis


# Bump throttle rates for tests to prevent 429s from cumulative requests
_no_throttle = override_settings(REST_FRAMEWORK={
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'EXCEPTION_HANDLER': 'utils.exceptions.custom_exception_handler',
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '10000/minute',
        'user': '100000/day',
    },
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
})

User = get_user_model()


@_no_throttle
class GitHubOAuthURLTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="pass123"
        )
        self.client.force_authenticate(user=self.user)
        self.url = "/api/github/oauth/url/"

    @patch.dict(os.environ, {"GITHUB_CLIENT_ID": "test_client_id"})
    def test_returns_oauth_url(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("oauth_url", response.data["data"])
        self.assertIn("test_client_id", response.data["data"]["oauth_url"])
        self.assertIn("github.com/login/oauth/authorize", response.data["data"]["oauth_url"])


@_no_throttle
class GitHubOAuthCallbackTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/github/oauth/callback/"
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="pass123"
        )
        self.client.force_authenticate(user=self.user)

    def test_missing_code(self):
        response = self.client.post(self.url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.post(self.url, {"code": "abc"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("requests.post")
    def test_callback_exchange_fails(self, mock_post):
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = {"error": "bad_verification_code"}
        response = self.client.post(self.url, {"code": "invalid"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("requests.post")
    @patch("requests.get")
    def test_callback_success(self, mock_get, mock_post):
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = {"access_token": "gho_fake_token"}
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = {
            "id": 12345,
            "avatar_url": "https://avatars.githubusercontent.com/u/12345",
        }

        response = self.client.post(self.url, {"code": "valid_code"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(GitHubProfile.objects.filter(user=self.user).exists())
        profile = GitHubProfile.objects.get(user=self.user)
        self.assertEqual(profile.github_id, "12345")


@_no_throttle
class ImportRepositoryTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/api/github/repos/import/"
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="pass123"
        )
        self.client.force_authenticate(user=self.user)

    def test_list_repos_no_github_link(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data["success"])

    def test_import_repo_success(self):
        payload = {
            "name": "owner/repo",
            "url": "https://github.com/owner/repo",
            "private": False,
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["success"])
        self.assertEqual(
            response.data["message"], "Repository imported successfully."
        )
        self.assertTrue(
            RepositoryAnalysis.objects.filter(
                user=self.user, repo_url="https://github.com/owner/repo"
            ).exists()
        )

    def test_import_duplicate_repo(self):
        RepositoryAnalysis.objects.create(
            user=self.user,
            repo_url="https://github.com/owner/repo",
            repo_name="owner/repo",
        )
        payload = {
            "name": "owner/repo",
            "url": "https://github.com/owner/repo",
            "private": False,
        }
        response = self.client.post(self.url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Repository already imported.")

    @patch("services.github_service.GitHubService.fetch_user_repositories")
    def test_list_repos_with_github_link(self, mock_fetch):
        GitHubProfile.objects.create(
            user=self.user,
            github_id="12345",
            access_token="gho_fake_token",
        )
        mock_fetch.return_value = [
            {
                "full_name": "owner/repo1",
                "html_url": "https://github.com/owner/repo1",
                "private": False,
            },
            {
                "full_name": "owner/repo2",
                "html_url": "https://github.com/owner/repo2",
                "private": True,
            },
        ]
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["data"]), 2)
        self.assertEqual(response.data["data"][0]["name"], "owner/repo1")
