from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views


app_name = 'files'
urlpatterns = [
    path('', views.FileList.as_view(), name='index'),
    path('<int:pk>/', views.FileDetail.as_view(), name='detail'),
    path('users/', views.UserList.as_view(), name='users'),
    path('users/<int:pk>/', views.UserDetail.as_view(), name='user'),
]

urlpatterns = format_suffix_patterns(urlpatterns)