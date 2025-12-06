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
    
    def get_permissions(self):
        # List and retrieve - authenticated users
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        # Create - students can enroll themselves
        elif self.action == 'create':
            return [IsStudent()]
        # Update and delete - lecturer or admin
        else:
            return [IsLecturerOrAdmin()]
