from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Material
from .serializers import MaterialSerializer
from users.permissions import IsCourseOwner


class MaterialViewSet(viewsets.ModelViewSet):
    """ViewSet untuk Material CRUD operations"""
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    
    def get_permissions(self):
        # List and retrieve - anyone can view
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticatedOrReadOnly()]
        # Create, update, delete - course owner (lecturer) only
        else:
            return [IsCourseOwner()]
