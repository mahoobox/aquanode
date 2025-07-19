from django.db import models #type: ignore
from core.users.models import User
from django.contrib.postgres.fields import JSONField #type: ignore

# Create your models here.
class Diagnosis(models.Model):
    analyzed_image = models.ImageField(upload_to='diagnosticos/', null=True, blank=True)
    model_result = models.JSONField("model_result", blank=True, null=True)
    model_answer = models.TextField("model_answer", blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    ubicacion = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField('created_at', auto_now_add=True)
    
    class Meta:
        db_table = 'Diagnosis'
        ordering = ['id'] 
        
class Events(models.Model):
    events = models.CharField("events", max_length=255 , blank=True, null=True) 
    url = models.URLField("events", blank=True, null=True)
    video_file = models.FileField(upload_to='videos/', blank=True, null=True)
    aprobbed = models.BooleanField(null=True, default=None)
    observation = models.TextField("observation", blank=True, null=True)
    is_read = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField('created_at', auto_now_add=True)   
    updated_at = models.DateTimeField('updated_at', auto_now=True)     
    
    def __str__(self):
        return f"Video {self.id} - {self.events}"
    
    class Meta:
        db_table = 'Events'
        ordering = ['id'] 