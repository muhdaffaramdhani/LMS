from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Assignment, Submission
from .serializers import AssignmentSerializer, SubmissionSerializer
from users.permissions import IsLecturerOrAdmin

class AssignmentViewSet(viewsets.ModelViewSet):
    # BARIS INI WAJIB ADA agar router tidak error "basename argument not specified"
    queryset = Assignment.objects.all()
    
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Assignment.objects.all()

        # Jika user belum login (anonymous), return list kosong
        if not user.is_authenticated:
            return queryset.none()

        # Jika student, HANYA tampilkan assignment dari course yang diambil
        if user.role == 'student':
            queryset = queryset.filter(course__enrollments__student=user)
        
        return queryset.order_by('due_date')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsLecturerOrAdmin()]
        return [IsAuthenticated()]

class SubmissionViewSet(viewsets.ModelViewSet):
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        if not user.is_authenticated:
            return Submission.objects.none()

        # Student hanya melihat submission miliknya sendiri
        if user.role == 'student':
            return Submission.objects.filter(student=user)
        # Dosen melihat semua submission
        return Submission.objects.all()