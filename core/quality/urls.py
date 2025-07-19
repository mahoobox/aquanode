from django.urls import path #type: ignore
from . import views

urlpatterns = [
    path('register_quality/', views.register_quality, name='register_quality'),
    path('register_parameters/', views.register_parameters, name='register_parameters'),    
    
]