from django.db import models

# Create your models here.

class File (models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, null=True, blank=True, related_name='files') 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    s3_url = models.URLField(max_length=200)

    def __str__(self):
        return self.name