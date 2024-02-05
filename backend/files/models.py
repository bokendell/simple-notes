from django.db import models

class File (models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey('users.UserAccount', on_delete=models.CASCADE, null=True, blank=True, related_name='files') 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    s3_key = models.CharField(max_length=255)

    class Meta:
        unique_together = ['name', 'user']

        verbose_name = 'file'
        verbose_name_plural = 'files'

    def __str__(self):
        return self.name