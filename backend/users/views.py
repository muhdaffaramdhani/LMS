from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import User
from .serializers import UserSerializer, UserCreateSerializer
from .permissions import IsAdmin


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet untuk User CRUD operations"""
    queryset = User.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    def get_permissions(self):
        # Registration - allow anyone
        if self.action == 'create':
            return []
        # List and retrieve - authenticated users
        elif self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        # Update and delete - admin only
        else:
            return [IsAdmin()]
