from rest_framework import serializers
from .models import Review, ReviewFeedback, RepositoryAnalysis

class ReviewFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewFeedback
        fields = ('id', 'file_path', 'line_number', 'issue_type', 'severity', 'description', 'suggestion', 'created_at')
        read_only_fields = ('id', 'created_at')

class ReviewSerializer(serializers.ModelSerializer):
    feedbacks = ReviewFeedbackSerializer(many=True, read_only=True)
    
    class Meta:
        model = Review
        fields = ('id', 'repository', 'title', 'code_snippet', 'pull_request_url', 'language', 
                  'status', 'overall_score', 'summary', 'error_message', 'is_saved', 'feedbacks', 'created_at')
        read_only_fields = ('id', 'status', 'overall_score', 'summary', 'error_message', 'created_at', 'user')

class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('title', 'code_snippet', 'language')
    
    def validate(self, attrs):
        if not attrs.get('code_snippet'):
            raise serializers.ValidationError({"code_snippet": "Code snippet is required for review."})
        return attrs
