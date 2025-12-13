from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from .models import Course, Enrollment
from .serializers import CourseSerializer, EnrollmentSerializer
from users.permissions import IsLecturerOrAdmin, IsCourseOwner, IsStudent


class CourseViewSet(viewsets.ModelViewSet):
    """ViewSet untuk Course CRUD operations"""
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    
    def get_permissions(self):
        # List and retrieve - anyone can view
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticatedOrReadOnly()]
        # Create - lecturer or admin
        elif self.action == 'create':
            return [IsLecturerOrAdmin()]
        # Update and delete - course owner (lecturer) or admin
        else:
            return [IsCourseOwner()]


class EnrollmentViewSet(viewsets.ModelViewSet):
    """ViewSet untuk Enrollment CRUD operations"""
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    
    def get_queryset(self):
        """
        Filter enrollment berdasarkan query parameter.
        Contoh: /api/enrollments/?course=1
        """
        queryset = Enrollment.objects.all()
        course_id = self.request.query_params.get('course')
        student_id = self.request.query_params.get('student')
        
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        if student_id:
            queryset = queryset.filter(student_id=student_id)
            
        return queryset
    
    def get_permissions(self):
        # List and retrieve - authenticated users
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        # Create - students can enroll themselves, or admin/lecturer can enroll others
        elif self.action == 'create':
            return [IsAuthenticated()] 
        # Update and delete - lecturer or admin
        else:
            return [IsLecturerOrAdmin()]