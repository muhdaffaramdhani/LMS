from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer, UserCreateSerializer
from .permissions import IsAdmin

# HAPUS BARIS INI JIKA ADA: from .models import Course, Enrollment
# Model Course dan Enrollment tidak diperlukan di UserViewSet ini
# kecuali jika Anda ingin menampilkan course di profil user, tapi biasanya itu diurus oleh serializer.

class UserViewSet(viewsets.ModelViewSet):
    """ViewSet untuk User CRUD operations"""
    queryset = User.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    def get_queryset(self):
        """
        Support filtering by role: /api/users/?role=student
        """
        queryset = User.objects.all()
        role = self.request.query_params.get('role')
        if role:
            queryset = queryset.filter(role=role)
        return queryset

    def get_permissions(self):
        # Registration - allow anyone
        if self.action == 'create':
            return []
        # List, retrieve, and ME - authenticated users
        elif self.action in ['list', 'retrieve', 'me']:
            return [IsAuthenticated()]
        # Update and delete - admin only
        else:
            return [IsAdmin()]

    def list(self, request, *args, **kwargs):
        """
        Allow disabling pagination for dropdowns: /api/users/?all=true
        """
        if request.query_params.get('all') == 'true':
            self.pagination_class = None
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """
        Endpoint khusus untuk mengambil data profile user yang sedang login.
        URL: /api/users/me/
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)