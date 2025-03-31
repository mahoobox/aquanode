from django.db import models #type: ignore
from core.users.models import User

# Create your models here.
class Diagnosis(models.Model):
    diagnosis = models.TextField("diagnosis", blank=True, null=True)
    events = models.TextField("events", blank=True, null=True)
    water = models.CharField("water", max_length=200, blank=True, null=True)
    feeding = models.CharField("feeding", max_length=200, blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField('created_at', auto_now_add=True)
    
    class Meta:
        db_table = 'Diagnosis'
        ordering = ['id'] 
        
class Events(models.Model):
    events = models.CharField("events", max_length=255 , blank=True, null=True) 
    url = models.URLField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField('created_at', auto_now_add=True)        
    
    class Meta:
        db_table = 'Events'
        ordering = ['id'] 