from django.conf import settings  #type: ignore
from django.conf.urls.static import static  #type: ignore
from django.urls import path #type: ignore
from . import views


urlpatterns = [
    path('register_event/', views.register_events, name='register_event'),
    path('register_diagnosis/', views.register_diagnosis, name='register_diagnosis'),
    path('notifications/', views.unread_notifications, name='notifications'),
    path('detail/<int:pk>/', views.get_event, name='detail_event'),
    path('mark_as_read/<int:pk>/', views.mark_as_read, name='mark_as_read'),
    path('events/', views.get_all, name='events'),
    path('update/<int:pk>/', views.update_event, name='update_event'),
    path('update_answer/<int:pk>/', views.update_answer, name='update_answer'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
