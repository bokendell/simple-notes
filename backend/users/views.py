from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .serializers import UserCreateSerializer, UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
import logging

logger = logging.getLogger('users.views')

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
    print(request.data)
    print(request.user)
    user = request.user
    data = request.data

    serializer = UserSerializer(user, data=data, partial=True)

    if not serializer.is_valid():
      return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    serializer.save()

    return Response(serializer.data, status=status.HTTP_200_OK)

# Subclass TokenObtainPairView and add logging
class LoggingTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        logger.info(f"TokenObtainPairView called with user: {request.user}")
        try:
            response = super().post(request, *args, **kwargs)
            logger.info("Token successfully obtained.")
            return response
        except Exception as e:
            logger.error(f"Error obtaining token: {e}", exc_info=True)
            raise
        # return super().post(request, *args, **kwargs)

# Repeat for other views as needed
class LoggingTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        logger.info("TokenRefreshView called")
        return super().post(request, *args, **kwargs)

class LoggingTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        logger.info("TokenVerifyView called")
        return super().post(request, *args, **kwargs)