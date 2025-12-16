from rest_framework import serializers
from .models import Course, Enrollment
from users.serializers import UserSerializer

class CourseSerializer(serializers.ModelSerializer):
    lecturer_detail = UserSerializer(source='lecturer', read_only=True)
    students_count = serializers.SerializerMethodField()
    is_enrolled = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id', 'name', 'code', 'description', 
            'lecturer', 'lecturer_detail', 
            'duration_weeks', 'image', 
            'students_count', 'is_enrolled', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

    def get_students_count(self, obj):
        return obj.enrollments.count()

    def get_is_enrolled(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Cek apakah user sudah enroll di course ini
            return Enrollment.objects.filter(student=request.user, course=obj).exists()
        return False

class EnrollmentSerializer(serializers.ModelSerializer):
    # CourseSerializer sudah didefinisikan di atas, jadi aman dipanggil
    course_detail = CourseSerializer(source='course', read_only=True)
    
    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'course', 'course_detail', 'enrolled_at']
        read_only_fields = ['id', 'enrolled_at']