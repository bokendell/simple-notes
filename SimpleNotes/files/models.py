from django.db import models

# Create your models here.

class File(models.Model):
    name = models.CharField(max_length=200)
    # user = models.ForeignKey('users.User', on_delete=models.CASCADE)
    created_at = models.DateTimeField('date created')
    updated_at = models.DateTimeField('date updated')
    s3_url = models.CharField(max_length=200)
    def __str__(self):
        return self.name