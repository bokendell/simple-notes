from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.views import generic

from .models import File

# Create your views here.

class IndexView(generic.ListView):
    template_name = 'files/index.html'
    context_object_name = 'file_list'
    
    def get_queryset(self):
        """Return the last five created files."""
        return File.objects.order_by('-created_at')[:5]

class DetailView(generic.DetailView):
    model = File
    template_name = 'files/detail.html'

class ResultsView(generic.DetailView):
    model = File
    template_name = 'files/results.html'

class UploadView(generic.DetailView):
    model = File
    template_name = 'files/upload.html'