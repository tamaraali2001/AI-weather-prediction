// src/components/WeatherDisplay.js
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';   // <-- استدعاء الترجمة
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { 
  WiThermometer, 
  WiHumidity, 
  WiDaySunny, 
  WiRain, 
  WiSnow, 
  WiCloudy 
} from 'react-icons/wi';
import './WeatherDisplay.css';

// استيراد ملفات الفيديو من مجلد src/assets
import sunnyVideo from '../assets/sunny.mp4';
import rainVideo from '../assets/rain.mp4';
import snowVideo from '../assets/snow.mp4';
import cloudyVideo from '../assets/cloudy.mp4';
import defaultVideo from '../assets/default.mp4';

const WeatherDisplay = ({ selectedRows, selectedCountry, selectedCity, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalDays = selectedRows.length;

  // <-- إضافة الترجمة
  const { t } = useTranslation();

  const handleNext = () => {
    if (currentIndex < totalDays - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // تحديد الصف الحالي المعروض
  const currentData = selectedRows[currentIndex];

  // دالة لتحديد ملف الفيديو بناءً على حالة الطقس
  const getMediaForCondition = (condition) => {
    const lowerCond = condition.toLowerCase();
    if (lowerCond.includes('rain')) {
      return rainVideo;
    } else if (lowerCond.includes('snow')) {
      return snowVideo;
    } else if (lowerCond.includes('cloud')) {
      return cloudyVideo;
    } else if (lowerCond.includes('sunny')) {
      return sunnyVideo;
    } else {
      return defaultVideo;
    }
  };

  // دالة للحصول على أيقونة الحالة المناسبة
  const getIconForCondition = (condition) => {
    const lowerCond = condition.toLowerCase();
    if (lowerCond.includes('rain')) {
      return <WiRain size={30} />;
    } else if (lowerCond.includes('snow')) {
      return <WiSnow size={30} />;
    } else if (lowerCond.includes('cloud')) {
      return <WiCloudy size={30} />;
    } else if (lowerCond.includes('sunny')) {
      return <WiDaySunny size={30} />;
    } else {
      return null;
    }
  };

  return (
    <div className="weather-slider">
      {/* زر الرجوع يستخدم مفتاح الترجمة 'back' */}
      <button className="back-button" onClick={onBack}>
        {t('back')}
      </button>

      <div className="slider-wrapper">
        <div
          className="slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {selectedRows.map((data, index) => {
            const mediaSrc = getMediaForCondition(data.condition_text);
            return (
              <div className="slide" key={index}>
                <div className="media-container">
                  <video className="weather-media" autoPlay loop muted>
                    <source src={mediaSrc} type="video/mp4" />
                    {/* مفتاح ترجمة اختياري مثلاً 'noVideoSupport' أو أي نص تريده */}
                    {t('noVideoSupport', 'Your browser does not support the video tag.')}
                  </video>

                  <div className="overlay-info">
                    {/* هنا عنوان المدينة والتاريخ */}
                    <h2>
                      {selectedCity} - {data.date}
                    </h2>

                    {/* عرض البيانات مع مفاتيح الترجمة */}
                    <p>
                      <WiThermometer size={24} style={{ verticalAlign: 'middle' }} /> 
                      &nbsp;{t('maxTemp')}: {data.maxtemp_c}°C
                    </p>

                    <p>
                      <WiThermometer size={24} style={{ verticalAlign: 'middle' }} /> 
                      &nbsp;{t('minTemp')}: {data.mintemp_c}°C
                    </p>

                    <p>
                      <WiThermometer size={24} style={{ verticalAlign: 'middle' }} /> 
                      &nbsp;{t('avgTemp')}: {data.avgtemp_c}°C
                    </p>

                    <p>
                      <WiHumidity size={24} style={{ verticalAlign: 'middle' }} /> 
                      &nbsp;{t('humidity')}: {data.avghumidity}%
                    </p>

                    <p>
                      {getIconForCondition(data.condition_text)} &nbsp; 
                      {/* يمكن استبدال النص الانجليزي بعرضه كما هو من CSV 
                          أو بترجمة جزئية إن كان لديك مفاتيح لظروف الطقس المختلفة */}
                      {data.condition_text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* أزرار التنقل بالسلايدر */}
        <button 
          className="nav-button prev" 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
        >
          <FaArrowLeft />
        </button>

        <button 
          className="nav-button next" 
          onClick={handleNext} 
          disabled={currentIndex === totalDays - 1}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default WeatherDisplay;
