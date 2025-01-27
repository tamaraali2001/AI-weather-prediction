// src/components/WeatherDisplay.js
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie-player';

// استيراد رسوم متحركة Lottie
import rainAnimation from '../lotties/rain.json';

const WeatherDisplay = ({ selectedRows, selectedCountry, selectedCity, onBack }) => {
  const { t } = useTranslation();
  const [showRainEffect, setShowRainEffect] = useState(false);

  if (!selectedRows || selectedRows.length === 0) return null;

  // اليوم
  const today = new Date();
  // الغد
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // تصفية بيانات المستقبل
  const futureData = selectedRows.filter((row) => {
    const rowDate = new Date(row.date);
    return rowDate >= tomorrow;
  });

  // ترتيب بيانات المستقبل
  futureData.sort((a, b) => new Date(a.date) - new Date(b.date));

  // تحديد ما إذا كان هناك أمطار
  useEffect(() => {
    const rainy = futureData.some((row) => {
      const cond = (row.condition_text || '').toLowerCase();
      return cond.includes('rain') || cond.includes('drizzle') || cond.includes('storm');
    });
    setShowRainEffect(rainy);
  }, [futureData]);

  return (
    <div className="weather-cards-container">
      {/* تأثير الأمطار */}
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
          // حساب متوسط الحرارة
          const avgTempCalc = ((Number(row.maxtemp_c) + Number(row.mintemp_c)) / 2).toFixed(2);

          // استخراج الحرارة المتوقعة
          const predicted = Number(row['Predicted Avg Temp'] || row['predicted_avgtemp_c'] || 0).toFixed(2);

          return (
            <div className="forecast-card" key={index}>
              <h3>{t('date')}: {row.date}</h3>
              <p>{t('season')}: {t(`seasons.${row.season}`, row.season)}</p>
              <p>{t('maxTemp')}: {Number(row.maxtemp_c).toFixed(2)}°C</p>
              <p>{t('minTemp')}: {Number(row.mintemp_c).toFixed(2)}°C</p>
              <p>{t('avgTemp')}: {avgTempCalc}°C</p>
              <p>{t('predictedTemp')}: {predicted}°C</p>
              <p>{t('rangeTemp')}: {Number(row.temp_range).toFixed(2)}°C</p>
              <p>{t('humidity')}: {Number(row.avghumidity).toFixed(2)}%</p>
              <p>{t('wind')}: {Number(row.maxwind_mph).toFixed(2)} mph</p>
              <p>{t('precip')}: {Number(row.totalprecip_mm).toFixed(2)} mm</p>
              <p>{t('visibility')}: {Number(row.avgvis_km).toFixed(2)} km</p>
              {/* عرض مؤشر UV إذا كان موجودًا */}
              <p>{t('uvIndex')}: {Number(row.uv_index || 0).toFixed(2)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherDisplay;
