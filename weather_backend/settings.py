import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-REPLACE_WITH_YOUR_SECRET_KEY'

DEBUG = True

ALLOWED_HOSTS = []

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # إذا كان لديك تطبيق لعرض الطقس اسمه مثلاً 'weather_app' أضفه هنا
     'weather',
]

MIDDLEWARE = [
    'django.contrib.sessions.middleware.SessionMiddleware',
    # LocaleMiddleware يجب أن يكون بعد SessionMiddleware وقبل CommonMiddleware
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.security.SecurityMiddleware',
]

ROOT_URLCONF = 'weather_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            # ضف المسار إلى قوالبك إن وجد
            BASE_DIR / 'templates',
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',  # مهم للوصول إلى request في القوالب
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'weather_backend.wsgi.application'

# Database
# مثال: استخدام قاعدة بيانات SQLite
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Internationalization
# اجعل اللغة الافتراضية الإنجليزية
LANGUAGE_CODE = 'en'

TIME_ZONE = 'UTC'

USE_I18N = True
USE_L10N = True
USE_TZ = True

# إعداد اللغات المتاحة (إنجليزي وعربي)
from django.utils.translation import gettext_lazy as _

LANGUAGES = [
    ('en', _('English')),
    ('ar', _('Arabic')),
]

# مسار ملفات الترجمة
LOCALE_PATHS = [
    BASE_DIR / 'locale',
]

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
