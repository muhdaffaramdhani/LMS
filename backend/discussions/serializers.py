from rest_framework import serializers
from .models import Discussion, DiscussionComment
from users.serializers import UserSerializer
from courses.serializers import CourseSerializer


class DiscussionCommentSerializer(serializers.ModelSerializer):
    """Serializer untuk DiscussionComment model"""
    user_detail = UserSerializer(source='user', read_only=True)
    replies = serializers.SerializerMethodField()
    
    class Meta:
        model = DiscussionComment
        fields = ['id', 'discussion', 'user', 'user_detail', 'content', 'parent', 
                  'replies', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_replies(self, obj):
        if obj.replies.exists():
            return DiscussionCommentSerializer(obj.replies.all(), many=True).data
        return []


class DiscussionSerializer(serializers.ModelSerializer):
    """Serializer untuk Discussion model"""
    user_detail = UserSerializer(source='user', read_only=True)
    course_detail = CourseSerializer(source='course', read_only=True)
    comments = DiscussionCommentSerializer(many=True, read_only=True)
    
    class Meta:
        model = Discussion
        fields = ['id', 'title', 'content', 'user', 'user_detail', 'course', 
                  'course_detail', 'comments', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
