from django.urls import path #type: ignore
from . import views


urlpatterns = [
    path('register_event/', views.register_events, name='register_event'),
    path('notifications/', views.unread_notifications, name='notifications'),
    path('mark_as_read/<int:pk>/', views.mark_as_read, name='mark_as_read'),
]
