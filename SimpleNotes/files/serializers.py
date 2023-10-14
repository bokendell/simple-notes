from rest_framework import serializers

from django.contrib.auth.models import User

from .models import File

class UserSerializer(serializers.ModelSerializer):
    files = serializers.PrimaryKeyRelatedField(many=True, queryset=File.objects.all())
    
    class Meta:
        model = User
        fields = ['id', 'username', 'files']

class FileSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = File
        fields = ['id', 'name', 'owner', 'created_at', 'updated_at', 's3_url']