from rest_framework.response import Response
from .models import File
from .serializers import FileSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getFilesList(request):
    notes = File.objects.all().order_by('-updated_at')
    serializer = FileSerializer(notes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getFile(request, pk):
    note = File.objects.get(id=pk)
    serializer = FileSerializer(note, many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createFile(request):
    data = request.data
    file = File.objects.create(
        name=data['name'],
        s3_url=data['s3_url'],
        user=request.user
    )
    serializer = FileSerializer(file, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateFile(request, pk):
    data = request.data
    file = File.objects.get(id=pk)
    serializer = FileSerializer(instance=file, data=data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteFile(request, pk):
    file = File.objects.get(id=pk)
    file.delete()
    return Response('File was deleted!')