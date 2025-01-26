from django.contrib import admin
from django.urls import path, include
from weather import views
from django.conf.urls.i18n import i18n_patterns

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('weather.urls')),  # يشمل روابط التطبيق
    path('', views.home, name='home'),  # هذا هو المسار الذي يعرض الواجهة
    path('get_provinces/', views.get_provinces, name='get_provinces'),
    path('get_weather/', views.get_weather, name='get_weather'),
    path('i18n/', include('django.conf.urls.i18n')),  # لدعم تغيير اللغة
]

urlpatterns += i18n_patterns(
    path('', include('weather.urls')),  # يشمل روابط تطبيق الطقس
)