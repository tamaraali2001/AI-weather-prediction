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
    countries = df["country"].unique().tolist()
    
    # إنشاء قائمة بأزواج (اسم الأصل، الاسم المترجم)
    translated_countries = [(country, _(country)) for country in countries]
    
    return render(request, 'weather/home.html', {
        "countries": translated_countries
    })

def load_weather_data():
    df = pd.read_csv("future_weather_predictions.csv")
    return df

def get_provinces(request):
    country = request.GET.get('country')
    if country:
        df = load_weather_data()
        provinces = df[df['country'] == country]['governorate'].unique().tolist()
        return JsonResponse({'provinces': provinces})
    return JsonResponse({'error': 'No country provided'}, status=400)

def get_weather(request):
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