from django.contrib import admin
from django.urls import path, include
from django.conf.urls.i18n import i18n_patterns
from django.conf import settings
from weather import views
from django.conf.urls.static import static

urlpatterns = [
    # مسار خاص لأوامر تغيير اللغة (يجب أن يكون خارج i18n_patterns)
    path('i18n/', include('django.conf.urls.i18n')),
]

urlpatterns += i18n_patterns(
    path('admin/', admin.site.urls),
    path('', include('weather.urls')),  # يشمل روابط التطبيق
    path('', views.home, name='home'),  # هذا هو المسار الذي يعرض الواجهة
    path('get_provinces/', views.get_provinces, name='get_provinces'),
    path('get_weather/', views.get_weather, name='get_weather'),
)

# إضافة مسارات ملفات الميديا (إن كنت تستخدمها)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
