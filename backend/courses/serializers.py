from rest_framework import serializers
from .models import Course, Enrollment
from users.serializers import UserSerializer


class CourseSerializer(serializers.ModelSerializer):
    """Serializer untuk Course model"""
    lecturer_detail = UserSerializer(source='lecturer', read_only=True)
    
    class Meta:
        model = Course
        # Tambahkan 'image' ke dalam fields
        fields = ['id', 'name', 'code', 'description', 'image', 'lecturer', 'lecturer_detail', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'lecturer']
        
    def create(self, validated_data):
        # Otomatis set lecturer dari user yang sedang login
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['lecturer'] = request.user
        return super().create(validated_data)


class EnrollmentSerializer(serializers.ModelSerializer):
    """Serializer untuk Enrollment model"""
    student_detail = UserSerializer(source='student', read_only=True)
    course_detail = CourseSerializer(source='course', read_only=True)
    
    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'student_detail', 'course', 'course_detail', 'created_at']
        read_only_fields = ['id', 'created_at']