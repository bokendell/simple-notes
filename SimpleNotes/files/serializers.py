from rest_framework import serializers

from django.contrib.auth.models import User

from .models import File

class UserSerializer(serializers.HyperlinkedModelSerializer):
    files = serializers.HyperlinkedIdentityField(many=True, view_name='file-detail', read_only=True, )    
    class Meta:
        model = User
        fields = ['url', 'id', 'username', 'files']

class FileSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = File
        fields = ['url', 'id', 'name', 'owner', 'created_at', 'updated_at', 's3_url']