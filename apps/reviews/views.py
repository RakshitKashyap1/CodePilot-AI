from rest_framework import viewsets, filters, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer
from utils.responses import api_response
import django_filters

class ReviewFilter(django_filters.FilterSet):
    created_at_after = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    created_at_before = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = Review
        fields = ['status', 'language', 'is_saved']

class ReviewViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing, creating, and editing Code Reviews.
    Includes pagination, filtering, and search logic.
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Filtering and Searching optimizations
    filterset_class = ReviewFilter
    search_fields = ['title', 'summary', 'code_snippet']
    ordering_fields = ['created_at', 'overall_score']
    ordering = ['-created_at'] # Default sorting

    def get_queryset(self):
        """
        Query Optimization: 
        Use select_related/prefetch_related to prevent N+1 query problems.
        Only fetch reviews belonging to the authenticated user.
        """
        return Review.objects.filter(user=self.request.user).prefetch_related('feedbacks')

    def get_serializer_class(self):
        if self.action == 'create':
            return ReviewCreateSerializer
        return ReviewSerializer

    def create(self, request, *args, **kwargs):
        """
        Submit code for review.
        Creates a PENDING review and theoretically triggers the async Celery task.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Save the review, attaching it to the current user
        review = serializer.save(user=request.user, status=Review.Status.PENDING)
        
        # Trigger Celery Task (Phase 10)
        # This returns instantly, allowing the HTTP response to finish.
        from apps.reviews.tasks import generate_ai_review_task
        generate_ai_review_task.delay(review.id)

        # Return a standardized API response
        read_serializer = ReviewSerializer(review)
        return api_response(
            data=read_serializer.data, 
            message="Review submitted successfully and is processing.", 
            status_code=status.HTTP_201_CREATED
        )

    def destroy(self, request, *args, **kwargs):
        """
        Custom delete to use standardized API response.
        """
        instance = self.get_object()
        self.perform_destroy(instance)
        return api_response(message="Review deleted successfully", status_code=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def toggle_save(self, request, pk=None):
        """
        Bookmark or unbookmark a review.
        """
        review = self.get_object()
        review.is_saved = not review.is_saved
        review.save(update_fields=['is_saved'])
        status_msg = "saved" if review.is_saved else "unsaved"
        return api_response(
            data={"is_saved": review.is_saved}, 
            message=f"Review {status_msg} successfully."
        )
