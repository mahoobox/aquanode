from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', views.register_user, name='register_user'),
    path('list/', views.get_users, name='list_users'),
    path('detail/<int:pk>/', views.get_user, name='detail_user'),
    path('edit/<int:pk>/', views.update_user, name='update_user'),
    path('login/', views.LoginUserView.as_view(), name='login_user'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
