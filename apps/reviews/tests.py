from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from unittest.mock import patch
from .models import Review, ReviewFeedback

User = get_user_model()


class ReviewModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="pass123"
        )

    def test_create_review(self):
        review = Review.objects.create(
            user=self.user,
            title="Test Review",
            code_snippet="print('hello')",
            language="python",
        )
        self.assertEqual(review.status, Review.Status.PENDING)
        self.assertIsNone(review.overall_score)
        self.assertEqual(str(review), f"Review {review.id} - PENDING")

    def test_review_status_choices(self):
        review = Review.objects.create(
            user=self.user,
            title="Test",
            code_snippet="test",
            language="python",
            status=Review.Status.COMPLETED,
            overall_score=85.5,
        )
        self.assertEqual(review.status, "COMPLETED")
        self.assertEqual(review.overall_score, 85.5)


class ReviewAPITests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="pass123"
        )
        self.client.force_authenticate(user=self.user)
        self.review_url = "/api/reviews/"

    def test_list_reviews_empty(self):
        response = self.client.get(self.review_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["data"]), 0)

    @patch("apps.reviews.tasks.generate_ai_review_task.delay")
    def test_create_review_success(self, mock_task):
        payload = {
            "title": "Test Review",
            "code_snippet": "def foo():\n    return 42",
            "language": "python",
        }
        response = self.client.post(self.review_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["success"])
        self.assertEqual(response.data["data"]["language"], "python")
        self.assertEqual(response.data["data"]["title"], "Test Review")
        mock_task.assert_called_once()

    def test_create_review_missing_code_snippet(self):
        payload = {"title": "Test", "language": "python"}
        response = self.client.post(self.review_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_review_unauthenticated(self):
        self.client.force_authenticate(user=None)
        payload = {
            "title": "Test",
            "code_snippet": "print(1)",
            "language": "python",
        }
        response = self.client.post(self.review_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch("apps.reviews.tasks.generate_ai_review_task.delay")
    def test_list_reviews_with_data(self, mock_task):
        Review.objects.create(
            user=self.user,
            title="Review 1",
            code_snippet="code1",
            language="python",
        )
        Review.objects.create(
            user=self.user,
            title="Review 2",
            code_snippet="code2",
            language="javascript",
        )
        response = self.client.get(self.review_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["data"]), 2)

    @patch("apps.reviews.tasks.generate_ai_review_task.delay")
    def test_toggle_save_review(self, mock_task):
        review = Review.objects.create(
            user=self.user,
            title="Test",
            code_snippet="code",
            language="python",
        )
        self.assertFalse(review.is_saved)

        response = self.client.post(f"{self.review_url}{review.id}/toggle_save/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["data"]["is_saved"])

        response = self.client.post(f"{self.review_url}{review.id}/toggle_save/")
        self.assertFalse(response.data["data"]["is_saved"])

    @patch("apps.reviews.tasks.generate_ai_review_task.delay")
    def test_delete_review(self, mock_task):
        review = Review.objects.create(
            user=self.user,
            title="Test",
            code_snippet="code",
            language="python",
        )
        response = self.client.delete(f"{self.review_url}{review.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.get(f"{self.review_url}{review.id}/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch("apps.reviews.tasks.generate_ai_review_task.delay")
    def test_filter_by_language(self, mock_task):
        Review.objects.create(
            user=self.user, title="Py", code_snippet="code", language="python"
        )
        Review.objects.create(
            user=self.user, title="JS", code_snippet="code", language="javascript"
        )
        response = self.client.get(f"{self.review_url}?language=python")
        self.assertEqual(len(response.data["data"]), 1)
        self.assertEqual(response.data["data"][0]["language"], "python")

    @patch("apps.reviews.tasks.generate_ai_review_task.delay")
    def test_search_reviews(self, mock_task):
        Review.objects.create(
            user=self.user, title="Security Audit", code_snippet="code", language="python"
        )
        Review.objects.create(
            user=self.user, title="Performance Check", code_snippet="code", language="go"
        )
        response = self.client.get(f"{self.review_url}?search=Security")
        self.assertEqual(len(response.data["data"]), 1)
        self.assertEqual(response.data["data"][0]["title"], "Security Audit")


class ReviewFeedbackTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="testuser", email="test@example.com", password="pass123"
        )
        self.review = Review.objects.create(
            user=self.user, title="Test", code_snippet="code", language="python"
        )

    def test_create_feedback(self):
        feedback = ReviewFeedback.objects.create(
            review=self.review,
            file_path="main.py",
            line_number=10,
            issue_type="Security",
            severity=ReviewFeedback.Severity.HIGH,
            description="SQL injection risk",
            suggestion="Use parameterized queries",
        )
        self.assertEqual(feedback.severity, "HIGH")
        self.assertEqual(str(feedback), f"Feedback {feedback.id} for Review {self.review.id}")

    def test_feedback_related_to_review(self):
        ReviewFeedback.objects.create(
            review=self.review,
            file_path="app.py",
            line_number=5,
            issue_type="Performance",
            severity=ReviewFeedback.Severity.MEDIUM,
            description="N+1 query",
            suggestion="Use select_related",
        )
        self.assertEqual(self.review.feedbacks.count(), 1)
