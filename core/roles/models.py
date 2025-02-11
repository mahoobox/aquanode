from django.db import models

# Create your models here.


class Role(models.Model):
    name = models.CharField('name', max_length=100, null=False, unique=True)
    created_at = models.DateTimeField('created_at', auto_now_add=True)
    updated_at = models.DateTimeField('updated_at', auto_now=True)

    class Meta:
        ordering = ['id']
