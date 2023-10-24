from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import UserSerializer, UserCreateSerializer
from files.serializers import FileSerializer

# Create your views here.
class RegisterView(APIView):
  def post(self, request):
    data = request.data

    serializer = UserCreateSerializer(data=data)

    if not serializer.is_valid():
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.create(serializer.validated_data)
    user = UserSerializer(user)

    return Response(user.data, status=status.HTTP_201_CREATED)


class RetrieveUserView(APIView):
  permission_classes = [permissions.IsAuthenticated]

  def get(self, request):
    user = request.user
    user = UserSerializer(user)

    return Response(user.data, status=status.HTTP_200_OK)
  
class UpdateUserView(APIView):
  permission_classes = [permissions.IsAuthenticated]
  def put(self, request):
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
      serializer.save()
    return Response(serializer.data, status=status.HTTP_200_OK)