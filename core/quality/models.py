from django.db import models

# Create your models here.

class Quality(models.Model):
    ubication = models.CharField(max_length=255, null=True, blank=True)
    od = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    odc = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    tc = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    ph = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    ce = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    tds = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    salinity = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    date = models.DateField(null=True, blank=True)
    hour = models.TimeField(null=True, blank=True)
    observation = models.TextField("observation", blank=True, null=True)
    
class Parameters(models.Model):
    od = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    odc = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    tc = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    ph = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    ce = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    tds = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    salinity = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    orp = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    date = models.DateField(null=True, blank=True)
    hour = models.TimeField(null=True, blank=True)
    observation = models.TextField("observation", blank=True, null=True)    
    