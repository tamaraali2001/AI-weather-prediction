// src/components/WeatherDisplay.js
import React from 'react';
import { useTranslation } from 'react-i18next';

const WeatherDisplay = ({ selectedRows, selectedCountry, selectedCity, onBack }) => {
  const { t, i18n } = useTranslation();

  if (!selectedRows || selectedRows.length === 0) return null;

  // اليوم (الوقت الحالي)
  const today = new Date();
  // نريد عرض الأيام التي تكون >= الغد
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // تصفية السجلات بحيث تكون تواريخها مستقبلية (أكبر أو يساوي tomorrow)
  const futureData = selectedRows.filter((row) => {
    const rowDate = new Date(row.date);
    return rowDate >= tomorrow;
  });

  // ترتيب السجلات تصاعدياً حسب التاريخ
  futureData.sort((a, b) => new Date(a.date) - new Date(b.date));

  // إذا لم يوجد أي أيام مستقبلية، يمكن عرض رسالة أو شيء
  if (futureData.length === 0) {
    return (
      <div className="weather-cards-container">
        <button onClick={onBack} className="back-button">
          {t('backToSelect')}
        </button>
        <h2>
          {t(`cities.${selectedCity}`, selectedCity)} - {t(`countries.${selectedCountry}`, selectedCountry)}
        </h2>
        <p>{t('noFutureData') || 'No Future Data Available.'}</p>
      </div>
    );
  }

  return (
    <div className="weather-cards-container">
      <button onClick={onBack} className="back-button">
        {t('backToSelect')}
      </button>

      <h2>
        {t(`cities.${selectedCity}`, selectedCity)} - {t(`countries.${selectedCountry}`, selectedCountry)}
      </h2>

      <div className="cards-wrapper">
        {futureData.map((row, index) => {
          return (
            <div className="forecast-card" key={index}>
              <h3>{t('date')}: {row.date}</h3>
              <p>{t('season')}: {row.season}</p>
              <p>{t('maxTemp')}: {Number(row.maxtemp_c).toFixed(2)}</p>
              <p>{t('minTemp')}: {Number(row.mintemp_c).toFixed(2)}</p>
              <p>{t('avgTemp')}: {(
                (Number(row.maxtemp_c) + Number(row.mintemp_c)) / 2
              ).toFixed(2)}</p>
              <p>{t('predictedTemp')}: {Number(row['Predicted Avg Temp']).toFixed(2)}</p>
              <p>{t('rangeTemp')}: {Number(row.temp_range).toFixed(2)}</p>
              <p>{t('humidity')}: {Number(row.avghumidity).toFixed(2)}</p>
              <p>{t('wind')}: {Number(row.maxwind_mph).toFixed(2)}</p>
              <p>{t('precip')}: {Number(row.totalprecip_mm).toFixed(2)}</p>
              <p>{t('visibility')}: {Number(row.avgvis_km).toFixed(2)}</p>
              <p>{t('uvIndex')}: {Number(row.uv_index).toFixed(2)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherDisplay;
