from rest_framework import serializers
from .models import Assignment, Submission
from courses.serializers import CourseSerializer
from users.serializers import UserSerializer


class AssignmentSerializer(serializers.ModelSerializer):
    """Serializer untuk Assignment model"""
    course_detail = CourseSerializer(source='course', read_only=True)
    
    class Meta:
        model = Assignment
        fields = ['id', 'course', 'course_detail', 'title', 'description', 'due_date', 'created_at']
        read_only_fields = ['id', 'created_at']


class SubmissionSerializer(serializers.ModelSerializer):
    """Serializer untuk Submission model"""
    assignment_detail = AssignmentSerializer(source='assignment', read_only=True)
    student_detail = UserSerializer(source='student', read_only=True)
    
    class Meta:
        model = Submission
        fields = ['id', 'assignment', 'assignment_detail', 'student', 'student_detail', 
                  'file_url', 'submitted_at', 'grade', 'feedback']
        read_only_fields = ['id', 'submitted_at']
