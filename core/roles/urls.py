from django.urls import path, include
from . import views

urlpatterns = [
    path('register/', views.register_role, name='register_role'),
    path('list/', views.get_roles, name='list_roles'),
    path('detail/<int:pk>/', views.get_role, name='detail_role'),
    path('edit/<int:pk>/', views.update_role, name='update_role'),
    path('delete/<int:pk>/', views.delete_role, name='delete_role'),
]
