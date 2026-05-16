from celery import shared_task
from services.review_service import process_review_with_ai

@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=60, # retry after 60 seconds if it fails
    name="apps.reviews.tasks.generate_ai_review_task"
)
def generate_ai_review_task(self, review_id):
    """
    Celery task that offloads the heavy AI code review generation to the background.
    If the API is down or rate-limited, this task will auto-retry up to 3 times.
    """
    try:
        process_review_with_ai(review_id)
    except Exception as exc:
        # If process_review_with_ai throws an unexpected catastrophic error, 
        # tell Celery to retry the task.
        raise self.retry(exc=exc)
