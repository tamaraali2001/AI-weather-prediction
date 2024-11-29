import streamlit as st
import pandas as pd
import joblib
import os
import plotly.express as px

# تحميل CSS مخصص لتنسيق الواجهة
def load_css():
    st.markdown("""
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f5f5f5;
        }
        .main {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h1, h2, h3 {
            text-align: center;
            color: #333;
        }
    </style>
    """, unsafe_allow_html=True)

# المسارات لملفات النموذج والبيانات
model_path = 'rf_model.pkl'
data_path = 'weather_data.parquet'

try:
    # تحميل النموذج
    if os.path.exists(model_path):
        model = joblib.load(model_path)
    else:
        raise FileNotFoundError(f"الملف '{model_path}' غير موجود. يرجى التأكد من وجوده.")

    # تحميل البيانات
    if os.path.exists(data_path):
        df_weather = pd.read_parquet(data_path)
    else:
        raise FileNotFoundError(f"الملف '{data_path}' غير موجود. يرجى التأكد من وجوده.")

    # تحميل CSS
    load_css()

    # عنوان التطبيق
    st.title('🌤️ تطبيق تحليل وتنبؤ الطقس')

    # اختيار اللغة
    language = st.sidebar.radio('🌐 اختر اللغة / Select Language', ['العربية', 'English'])

    # النصوص المترجمة
    if language == 'العربية':
        temp_text = 'درجة الحرارة'
        humidity_text = 'الرطوبة'
        wind_speed_text = 'سرعة الرياح'
        predict_text = 'تنبؤ'
        city_text = 'اختر المدينة'
        date_text = 'اختر التاريخ'
        graph_title = 'الرسم البياني للطقس'
    else:
        temp_text = 'Temperature'
        humidity_text = 'Humidity'
        wind_speed_text = 'Wind Speed'
        predict_text = 'Predict'
        city_text = 'Select City'
        date_text = 'Select Date'
        graph_title = 'Weather Graph'

    # اختيار المدينة
    cities = df_weather['city'].unique()
    selected_city = st.sidebar.selectbox(city_text, cities)

    # تصفية البيانات للمدينة المحددة
    city_data = df_weather[df_weather['city'] == selected_city]

    # اختيار الأعمدة الموجودة فقط
    available_columns = [col for col in ['temperature', 'humidity', 'wind_speed', 'rain'] if col in city_data.columns]

    if not available_columns:
        st.warning("لا توجد بيانات كافية لعرض الرسم البياني.")
    else:
        # تصفية القيم الفارغة
        city_data = city_data[['date'] + available_columns].dropna()

        # إعادة تشكيل البيانات باستخدام melt
        city_data_long = city_data.melt(
            id_vars='date',
            value_vars=available_columns,
            var_name='Variable',
            value_name='Value'
        )

        # الرسم البياني
        st.subheader(graph_title)
        fig = px.line(
            city_data_long,
            x='date',
            y='Value',
            color='Variable',
            labels={'Variable': 'Parameter', 'Value': 'Value', 'date': 'Date'},
            title=f'{graph_title} - {selected_city}'
        )
        st.plotly_chart(fig)

except FileNotFoundError as e:
    st.error(str(e))
except Exception as e:
    st.error(f"حدث خطأ غير متوقع: {str(e)}")
