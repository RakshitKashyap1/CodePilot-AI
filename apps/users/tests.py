from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

User = get_user_model()


class UserRegistrationTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = "/api/users/register/"
        self.valid_payload = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "StrongPass123!",
            "password_confirm": "StrongPass123!",
        }

    def test_register_success(self):
        response = self.client.post(self.register_url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["success"])
        self.assertIn("access", response.data["data"])
        self.assertIn("user", response.data["data"])
        self.assertEqual(response.data["data"]["user"]["email"], "test@example.com")

    def test_register_password_mismatch(self):
        payload = {**self.valid_payload, "password_confirm": "WrongPass456!"}
        response = self.client.post(self.register_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_missing_fields(self):
        response = self.client.post(self.register_url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_duplicate_email(self):
        self.client.post(self.register_url, self.valid_payload, format="json")
        response = self.client.post(self.register_url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserLoginTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = "/api/users/login/"
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="StrongPass123!",
        )

    def test_login_success(self):
        response = self.client.post(
            self.login_url,
            {"email": "test@example.com", "password": "StrongPass123!"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["success"])
        self.assertIn("access", response.data["data"])

    def test_login_invalid_credentials(self):
        response = self.client.post(
            self.login_url,
            {"email": "test@example.com", "password": "wrongpassword"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertFalse(response.data["success"])

    def test_login_missing_fields(self):
        response = self.client.post(self.login_url, {}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data["success"])


class UserProfileTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.profile_url = "/api/users/profile/"
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="StrongPass123!"
        )

    def test_profile_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["data"]["email"], "test@example.com")

    def test_profile_unauthenticated(self):
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TokenRefreshTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.refresh_url = "/api/users/token/refresh/"
        from rest_framework_simplejwt.tokens import RefreshToken

        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="StrongPass123!"
        )
        self.refresh_token = str(RefreshToken.for_user(self.user))

    def test_token_refresh_success(self):
        response = self.client.post(
            self.refresh_url, {"refresh": self.refresh_token}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)

    def test_token_refresh_invalid(self):
        response = self.client.post(
            self.refresh_url, {"refresh": "invalidtoken"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
