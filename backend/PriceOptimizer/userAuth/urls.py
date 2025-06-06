from django.urls import path
from .views import LoginView, LogoutAPIView, RegisterView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
]
