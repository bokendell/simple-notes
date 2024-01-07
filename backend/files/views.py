from rest_framework.response import Response
from .models import File
from .serializers import FileSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import boto3
import uuid
import time
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
    uploaded_file = request.FILES['file']  # Assuming the key for the file is 'file'

    # Generate a unique file name
    if s3.head_object(Bucket='simplenotes', Key=uploaded_file.name):
        # If the file already exists, generate a unique name
        uploaded_file.name = generate_unique_filename(uploaded_file)

    s3 = boto3.client('s3')
    s3_response = s3.upload_fileobj(
        uploaded_file, 
        'simplenotes',  # Your S3 bucket name
        uploaded_file.name,  # Use the original file name
        ExtraArgs={
            "ACL": "public-read",  # Set appropriate ACL permissions
            "ContentType": uploaded_file.content_type  # Use content type for proper MIME type
        }
    )

    s3_url = f"https://simplenotes.s3.amazonaws.com/{uploaded_file.name}"  # Replace with your bucket name

    # Assuming you have a File model with 'name', 's3_url', and 'user' fields
    file = File.objects.create(
        name=uploaded_file.name,
        s3_url=s3_url,
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
    return Response({'message': 'File deleted', 'id': pk})

def generate_unique_filename(file):
    timestamp = str(int(time.time()))
    unique_id = str(uuid.uuid4())[:8]  # Generate a unique ID
    filename, file_extension = os.path.splitext(file.name)
    return f"{filename}_{timestamp}_{unique_id}{file_extension}"