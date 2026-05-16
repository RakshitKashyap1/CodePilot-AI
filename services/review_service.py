import time
from apps.reviews.models import Review, ReviewFeedback
from apps.analytics.models import AIUsageLogs
from services.ai_client import GeminiClient

def process_review_with_ai(review_id):
    """
    Business logic to coordinate the database and the AI client.
    This function is designed to be called by a Celery worker in the background.
    """
    start_time = time.time()
    
    try:
        review = Review.objects.get(id=review_id)
    except Review.DoesNotExist:
        return
    
    review.status = Review.Status.PROCESSING
    review.save(update_fields=['status'])

    # Initialize Client
    try:
        client = GeminiClient()
        result = client.generate_code_review(
            code_snippet=review.code_snippet, 
            language=review.language
        )
    except Exception as e:
        review.status = Review.Status.FAILED
        review.error_message = str(e)
        review.save(update_fields=['status', 'error_message'])
        return

    latency_ms = int((time.time() - start_time) * 1000)

    if not result.get('success'):
        review.status = Review.Status.FAILED
        review.error_message = result.get('error')
        review.save(update_fields=['status', 'error_message'])
        
        # Log failed AI usage
        AIUsageLogs.objects.create(
            user=review.user,
            model_used='gemini-1.5-flash',
            latency_ms=latency_ms,
            successful=False
        )
        return

    # Success! Parse data and save to database
    ai_data = result['data']
    
    review.overall_score = ai_data.get('overall_score')
    review.summary = ai_data.get('summary')
    review.status = Review.Status.COMPLETED
    review.save(update_fields=['status', 'overall_score', 'summary'])

    # Create granular feedback items
    feedbacks_to_create = []
    for issue in ai_data.get('issues', []):
        feedbacks_to_create.append(
            ReviewFeedback(
                review=review,
                file_path=issue.get('file_path', 'snippet'),
                line_number=issue.get('line_number'),
                issue_type=issue.get('issue_type', 'General'),
                severity=issue.get('severity', ReviewFeedback.Severity.MEDIUM),
                description=issue.get('description', ''),
                suggestion=issue.get('suggestion', '')
            )
        )
    
    if feedbacks_to_create:
        ReviewFeedback.objects.bulk_create(feedbacks_to_create)

    # Log successful AI usage
    usage_meta = result.get('usage')
    prompt_tokens = usage_meta.prompt_token_count if usage_meta else 0
    completion_tokens = usage_meta.candidates_token_count if usage_meta else 0
    
    AIUsageLogs.objects.create(
        user=review.user,
        model_used='gemini-1.5-flash',
        prompt_tokens=prompt_tokens,
        completion_tokens=completion_tokens,
        total_tokens=prompt_tokens + completion_tokens,
        latency_ms=latency_ms,
        successful=True
    )
