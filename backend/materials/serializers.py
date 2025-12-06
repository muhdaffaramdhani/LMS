from rest_framework import serializers
from .models import Material
from courses.serializers import CourseSerializer


class MaterialSerializer(serializers.ModelSerializer):
    """Serializer untuk Material model"""
    course_detail = CourseSerializer(source='course', read_only=True)
    
    class Meta:
        model = Material
        fields = ['id', 'course', 'course_detail', 'title', 'file_url', 'created_at']
        read_only_fields = ['id', 'created_at']
