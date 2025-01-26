// WeatherDisplay.js
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie-player';

// استيراد أنيميشن المطر
import rainAnimation from '../lotties/rain.json'; // تأكدي من وجود هذا الملف

const WeatherDisplay = ({ selectedRows, selectedCountry, selectedCity, onBack }) => {
  const { t } = useTranslation();
  const [showRainEffect, setShowRainEffect] = useState(false);

  if (!selectedRows || selectedRows.length === 0) return null;

  // اليوم (الوقت الحالي)
  const today = new Date();
  // نعرض الأيام التي تاريخها >= الغد
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // تصفية السجلات بحيث تكون تواريخها مستقبلية
  const futureData = selectedRows.filter((row) => {
    const rowDate = new Date(row.date);
    return rowDate >= tomorrow;
  });

  // ترتيب السجلات تصاعديًّا
  futureData.sort((a, b) => new Date(a.date) - new Date(b.date));

  // إذا لم توجد بيانات مستقبلية
  if (futureData.length === 0) {
    return (
      <div className="weather-cards-container">
        <button onClick={onBack} className="back-button">
          {t('backToSelect')}
        </button>
        <h2>
          {t(`cities.${selectedCity}`, selectedCity)} - {t(`countries.${selectedCountry}`, selectedCountry)}
        </h2>
        <p>{t('noFutureData') || 'No future data available'}</p>
      </div>
    );
  }

  // التحقق من وجود حالة جوية تشير للمطر في البيانات المستقبلية
  useEffect(() => {
    // لو وجدنا أي row حالته تحتوي كلمة Rain (يمكن تحسينها بحيث تكون أكثر دقة)
    const rainy = futureData.some((row) => {
      const cond = (row.condition_text || '').toLowerCase();
      return cond.includes('rain'); // or cond.includes('drizzle')...
    });
    setShowRainEffect(rainy);
  }, [futureData]);

  return (
    <div className="weather-cards-container">
      {/* إذا أردتِ أن تظهر مؤثر المطر على كل الشاشة، ممكن وضع العنصر خارجًا */}
      {showRainEffect && (
        <div className="weather-effect-overlay">
          <Lottie
            loop
            animationData={rainAnimation}
            play
            style={{ width: 200, height: 200 }}
          />
        </div>
      )}

      <button onClick={onBack} className="back-button">
        {t('backToSelect')}
      </button>

      <h2>
        {t(`cities.${selectedCity}`, selectedCity)} - {t(`countries.${selectedCountry}`, selectedCountry)}
      </h2>

      <div className="cards-wrapper">
        {futureData.map((row, index) => {
          // حساب متوسط الحرارة يدوياً
          const avgTempCalc = ((Number(row.maxtemp_c) + Number(row.mintemp_c)) / 2).toFixed(2);

          // تأكدي من أن اسم العمود في CSV هو "Predicted Avg Temp" أو "predicted_avgtemp_c"
          // هنا استعملنا نفس الاسم الظاهر في سؤالك:
          const predicted = Number(row['Predicted Avg Temp'] || row['predicted_avgtemp_c'] || 0).toFixed(2);

          return (
            <div className="forecast-card" key={index}>
              <h3>{t('date')}: {row.date}</h3>
              <p>{t('season')}: {row.season}</p>
              <p>{t('maxTemp')}: {Number(row.maxtemp_c).toFixed(2)}</p>
              <p>{t('minTemp')}: {Number(row.mintemp_c).toFixed(2)}</p>
              <p>{t('avgTemp')}: {avgTempCalc}</p>
              <p>{t('predictedTemp')}: {predicted}</p>
              <p>{t('rangeTemp')}: {Number(row.temp_range).toFixed(2)}</p>
              <p>{t('humidity')}: {Number(row.avghumidity).toFixed(2)}</p>
              <p>{t('wind')}: {Number(row.maxwind_mph).toFixed(2)}</p>
              <p>{t('precip')}: {Number(row.totalprecip_mm).toFixed(2)}</p>
              <p>{t('visibility')}: {Number(row.avgvis_km).toFixed(2)}</p>
              {/* إذا كان لديكِ حقل uv_index يمكن عرضه أيضاً */}
              <p>{t('uvIndex')}: {Number(row.uv_index || 0).toFixed(2)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherDisplay;
