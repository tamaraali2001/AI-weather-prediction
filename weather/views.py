import pandas as pd
from django.http import JsonResponse
from django.shortcuts import render
from datetime import datetime, timedelta
from django.utils.translation import gettext as _
from django.utils.translation import activate
from django.conf import settings


def home(request):
    # تغيير اللغة بناءً على طلب المستخدم
    lang = request.GET.get('lang')
    if lang:
        activate(lang)
        request.session[settings.LANGUAGE_COOKIE_NAME] = lang
    
    # تحميل البيانات وترجمة أسماء الدول
    df = load_weather_data()
    countries = df["country"].dropna().unique().tolist()  # التأكد من عدم وجود قيم مفقودة
    
    # إنشاء قائمة بأزواج (اسم الأصل، الاسم المترجم)
    translated_countries = [(country, _(country)) for country in countries]
    
    return render(request, 'weather/home.html', {
        "countries": translated_countries
    })


def load_weather_data():
    # تحميل ملف الطقس
    try:
        df = pd.read_csv("future_weather_predictions.csv")
        return df
    except FileNotFoundError:
        raise Exception("File 'future_weather_predictions.csv' not found. Please ensure it exists in the project directory.")


def get_provinces(request):
    # الحصول على المحافظات بناءً على الدولة المختارة
    country = request.GET.get('country')
    if country:
        df = load_weather_data()
        provinces = df[df['country'] == country]['governorate'].dropna().unique().tolist()  # التأكد من عدم وجود قيم مفقودة
        return JsonResponse({'provinces': provinces})
    return JsonResponse({'error': 'No country provided'}, status=400)

from django.http import JsonResponse
from .views import load_weather_data

def get_countries(request):
    # تحميل بيانات الطقس
    df = load_weather_data()
    # الحصول على قائمة الدول الفريدة
    countries = df['country'].dropna().unique().tolist()
    return JsonResponse({'countries': countries})


def get_weather(request):
    # الحصول على بيانات الطقس بناءً على الدولة والمحافظة المختارة
    country = request.GET.get('country')
    province = request.GET.get('province')
    
    if country and province:
        df = load_weather_data()
        today = datetime.now().date()
        tomorrow = today + timedelta(days=1)
        next_week = [tomorrow + timedelta(days=i) for i in range(7)]
        
        weather_data = df[
            (df['country'] == country) &
            (df['governorate'] == province) &
            (df['date'].isin([str(day) for day in next_week]))
        ]
        
        if not weather_data.empty:
            weather_list = weather_data.to_dict(orient='records')
            return JsonResponse({'weather': weather_list})
        return JsonResponse({'error': 'No weather data found for the next week.'}, status=404)
    
    return JsonResponse({'error': 'Country or province not provided.'}, status=400)
