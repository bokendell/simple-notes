from django.contrib.auth.models import User
from rest_framework import generics, permissions

from .serializers import FileSerializer, UserSerializer
from .models import File

# Create your views here.

class FileList(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    context_object_name = 'file_list'
    serializer_class = FileSerializer
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        return File.objects.order_by('-updated_at')

class FileDetail(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = File.objects.all()
    serializer_class = FileSerializer

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer