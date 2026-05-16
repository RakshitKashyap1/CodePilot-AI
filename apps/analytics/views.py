from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Avg, Sum
from django.db.models.functions import TruncDate
from apps.reviews.models import Review, ReviewFeedback
from apps.analytics.models import AIUsageLogs
from utils.responses import api_response

class DashboardAnalyticsView(APIView):
    """
    Returns aggregated metrics for the user's dashboard.
    Optimized to compute stats entirely in the database layer.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # 1. High-Level Counts
        total_reviews = Review.objects.filter(user=user).count()
        completed_reviews = Review.objects.filter(user=user, status=Review.Status.COMPLETED).count()
        
        # 2. Average Code Health Score
        avg_score = Review.objects.filter(user=user, status=Review.Status.COMPLETED).aggregate(
            avg_score=Avg('overall_score')
        )['avg_score']

        # 3. Language Usage Stats (e.g. { "python": 10, "javascript": 5 })
        language_stats = Review.objects.filter(user=user).values('language').annotate(
            count=Count('id')
        ).order_by('-count')

        # 4. Issue Severity Breakdown
        severity_stats = ReviewFeedback.objects.filter(review__user=user).values('severity').annotate(
            count=Count('id')
        )

        # 5. Activity Graph (Reviews per day for the last 7/30 days)
        # Using TruncDate to group timestamps into exact calendar dates
        activity_graph = Review.objects.filter(user=user).annotate(
            date=TruncDate('created_at')
        ).values('date').annotate(
            count=Count('id')
        ).order_by('date')

        # 6. AI Token & Cost Metrics
        ai_metrics = AIUsageLogs.objects.filter(user=user).aggregate(
            total_tokens=Sum('total_tokens'),
            total_cost=Sum('cost'),
            avg_latency=Avg('latency_ms')
        )

        # Format Response
        data = {
            "overview": {
                "total_reviews": total_reviews,
                "completed_reviews": completed_reviews,
                "average_score": round(avg_score, 1) if avg_score else 0,
            },
            "language_usage": list(language_stats),
            "issue_breakdown": {item['severity']: item['count'] for item in severity_stats},
            "activity_graph": [
                {"date": item['date'].strftime('%Y-%m-%d'), "count": item['count']} 
                for item in activity_graph if item['date']
            ],
            "ai_metrics": {
                "total_tokens": ai_metrics['total_tokens'] or 0,
                "total_cost": round(ai_metrics['total_cost'] or 0, 4),
                "avg_latency_ms": int(ai_metrics['avg_latency'] or 0)
            }
        }

        return api_response(data=data, message="Dashboard analytics retrieved successfully")
