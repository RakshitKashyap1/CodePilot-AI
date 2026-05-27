from django.test import TestCase, override_settings
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from apps.reviews.models import Review
from apps.analytics.models import AIUsageLogs


_no_throttle = override_settings(REST_FRAMEWORK={
    'DEFAULT_THROTTLE_RATES': {
        'anon': '10000/minute',
        'user': '100000/day',
    }
})

User = get_user_model()


@_no_throttle
class AnalyticsAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="pass123"
        )
        self.client.force_authenticate(user=self.user)
        self.dashboard_url = "/api/analytics/dashboard/"

    def test_dashboard_empty(self):
        response = self.client.get(self.dashboard_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["success"])
        data = response.data["data"]
        self.assertEqual(data["overview"]["total_reviews"], 0)
        self.assertEqual(data["overview"]["completed_reviews"], 0)
        self.assertEqual(data["overview"]["average_score"], 0)
        self.assertEqual(data["language_usage"], [])
        self.assertEqual(data["issue_breakdown"], {})
        self.assertEqual(data["activity_graph"], [])
        self.assertEqual(data["ai_metrics"]["total_tokens"], 0)

    def test_dashboard_with_reviews(self):
        Review.objects.create(
            user=self.user,
            title="Review 1",
            code_snippet="code",
            language="python",
            status=Review.Status.COMPLETED,
            overall_score=90.0,
        )
        Review.objects.create(
            user=self.user,
            title="Review 2",
            code_snippet="code",
            language="javascript",
            status=Review.Status.COMPLETED,
            overall_score=75.0,
        )
        Review.objects.create(
            user=self.user,
            title="Review 3",
            code_snippet="code",
            language="python",
            status=Review.Status.FAILED,
        )

        response = self.client.get(self.dashboard_url)
        data = response.data["data"]
        self.assertEqual(data["overview"]["total_reviews"], 3)
        self.assertEqual(data["overview"]["completed_reviews"], 2)
        self.assertEqual(data["overview"]["average_score"], 82.5)

        lang_map = {item["language"]: item["count"] for item in data["language_usage"]}
        self.assertEqual(lang_map["python"], 2)
        self.assertEqual(lang_map["javascript"], 1)

    def test_dashboard_with_ai_usage_logs(self):
        AIUsageLogs.objects.create(
            user=self.user,
            model_used="Qwen/Qwen2.5-Coder-7B-Instruct",
            prompt_tokens=100,
            completion_tokens=50,
            total_tokens=150,
            latency_ms=500,
            successful=True,
        )
        response = self.client.get(self.dashboard_url)
        data = response.data["data"]
        self.assertEqual(data["ai_metrics"]["total_tokens"], 150)
        self.assertEqual(data["ai_metrics"]["avg_latency_ms"], 500)

    def test_dashboard_unauthenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(self.dashboard_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_dashboard_isolates_users(self):
        other_user = User.objects.create_user(
            username="other", email="other@example.com", password="pass123"
        )
        Review.objects.create(
            user=self.user,
            title="My Review",
            code_snippet="code",
            language="python",
            status=Review.Status.COMPLETED,
        )
        Review.objects.create(
            user=other_user,
            title="Other's Review",
            code_snippet="code",
            language="go",
            status=Review.Status.COMPLETED,
        )

        response = self.client.get(self.dashboard_url)
        self.assertEqual(response.data["data"]["overview"]["total_reviews"], 1)
