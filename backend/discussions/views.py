from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from .models import Discussion, DiscussionComment
from .serializers import DiscussionSerializer, DiscussionCommentSerializer
from users.permissions import IsDiscussionOwner


class DiscussionViewSet(viewsets.ModelViewSet):
    """ViewSet untuk Discussion CRUD operations"""
    queryset = Discussion.objects.all()
    serializer_class = DiscussionSerializer
    
    def get_permissions(self):
        # List and retrieve - anyone can view
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticatedOrReadOnly()]
        # Create - authenticated users can create discussions
        elif self.action == 'create':
            return [IsAuthenticated()]
        # Update and delete - discussion owner or admin
        else:
            return [IsDiscussionOwner()]


class DiscussionCommentViewSet(viewsets.ModelViewSet):
    """ViewSet untuk DiscussionComment CRUD operations"""
    queryset = DiscussionComment.objects.all()
    serializer_class = DiscussionCommentSerializer
    
    def get_permissions(self):
        # List and retrieve - anyone can view
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticatedOrReadOnly()]
        # Create - authenticated users can comment
        elif self.action == 'create':
            return [IsAuthenticated()]
        # Update and delete - comment owner or admin
        else:
            return [IsDiscussionOwner()]
