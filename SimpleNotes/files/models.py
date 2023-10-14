from django.db import models

# Create your models here.

class File(models.Model):
    name = models.CharField(max_length=200)
    owner = models.ForeignKey('auth.User', related_name='files', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    s3_url = models.CharField(max_length=200)
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['updated_at']