from django.shortcuts import render
from django.http import HttpResponse
from .models import File

# Create your views here.

def index(request):
    file_list = File.objects.order_by('-created_at') 
    output = ', '.join([f.name for f in file_list])
    return HttpResponse(output)

def detail(request, file_id):
    return HttpResponse("You're looking at file %s." % file_id)

def results(request, file_id):
    response = "You're looking at the results of file %s."
    return HttpResponse(response % file_id)
