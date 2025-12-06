from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from .models import Assignment, Submission
from .serializers import AssignmentSerializer, SubmissionSerializer
from users.permissions import IsCourseOwner, IsSubmissionOwner, IsStudent


class AssignmentViewSet(viewsets.ModelViewSet):
    """ViewSet untuk Assignment CRUD operations"""
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    
    def get_permissions(self):
        # List and retrieve - anyone can view
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticatedOrReadOnly()]
        # Create, update, delete - course owner (lecturer) only
        else:
            return [IsCourseOwner()]


class SubmissionViewSet(viewsets.ModelViewSet):
    """ViewSet untuk Submission CRUD operations"""
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer
    
    def get_permissions(self):
        # List - authenticated users can list
        if self.action == 'list':
            return [IsAuthenticated()]
        # Retrieve - submission owner (student) or lecturer
        elif self.action == 'retrieve':
            return [IsSubmissionOwner()]
        # Create - students can submit
        elif self.action == 'create':
            return [IsStudent()]
        # Update - submission owner or lecturer (for grading)
        # Delete - submission owner only
        else:
            return [IsSubmissionOwner()]
