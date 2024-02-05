from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.createFile, name='CreateFile'),
    path('<str:pk>/', views.getFile, name='File'),
    path('presigned-url/<str:pk>/', views.getPresignedUrl, name='PresignedUrl'),
    path('update/<str:pk>/', views.updateFile, name='UpdateFile'),
    path('delete/<str:pk>/', views.deleteFile, name='DeleteFile'),
    path('', views.getFilesList, name='FilesList'),
]