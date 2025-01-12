from django.db import models
from ckeditor.fields import RichTextField

class Documentation(models.Model):
    title = models.CharField(max_length=100)
    body = RichTextField(null=True, blank=True)
    is_active = models.BooleanField()
    
    created_at = models.DateTimeField()
    modified_by = models.DateTimeField()
