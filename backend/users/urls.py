from django.urls import path
from .views import RegisterView, RetrieveUserView, UpdateUserView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('profile/', RetrieveUserView.as_view()),
    path('profile/update/', UpdateUserView.as_view()),
]
