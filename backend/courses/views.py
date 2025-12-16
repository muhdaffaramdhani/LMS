from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Q
from .models import Course, Enrollment
from .serializers import CourseSerializer, EnrollmentSerializer
from users.permissions import IsLecturerOrAdmin

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsLecturerOrAdmin()]
        return [IsAuthenticatedOrReadOnly()]

    def get_queryset(self):
        queryset = Course.objects.all()
        user = self.request.user

        # Filter 1: Jika request minta "enrolled only"
        if self.request.query_params.get('enrolled') == 'true' and user.is_authenticated:
            queryset = queryset.filter(enrollments__student=user).distinct()
        
        # Filter 2: Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(code__icontains=search) |
                Q(description__icontains=search)
            )
            
        return queryset.order_by('-created_at')

    # API: POST /api/courses/{id}/enroll/
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def enroll(self, request, pk=None):
        course = self.get_object()
        user = request.user

        if user.role != 'student':
            return Response(
                {'detail': 'Only students can enroll.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Gunakan get_or_create untuk menghandle unique constraint
        enrollment, created = Enrollment.objects.get_or_create(student=user, course=course)
        
        if not created:
            return Response(
                {'detail': 'Already enrolled.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        return Response(
            {'detail': 'Enrolled successfully', 'status': 'enrolled'}, 
            status=status.HTTP_201_CREATED
        )

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(student=self.request.user)