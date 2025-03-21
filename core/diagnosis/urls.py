from django.urls import path
from . import views


urlpatterns = [
    path('register_event/', views.register_events, name='register_event'),

]
