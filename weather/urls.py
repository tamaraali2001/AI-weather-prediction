from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('get_provinces/', views.get_provinces, name='get_provinces'),
    path('get_weather/', views.get_weather, name='get_weather'),
]
