// src/components/WeatherDisplay.js
import React from 'react';
import { useTranslation } from 'react-i18next';

function WeatherDisplay({ selectedRows, selectedCountry, selectedCity, onBack }) {
  const { t } = useTranslation();

  return (
    <div className="weather-cards-container">
      <button className="back-button" onClick={onBack}>
        {t('back')}
      </button>
      <h2>
        {t('weatherForecastFor')} {selectedCity}, {selectedCountry}
      </h2>
      <div className="cards-wrapper">
        {selectedRows.map((row, index) => (
          <div key={index} className="forecast-card">
            <h3>{row.date}</h3>
            <p>{t('maxtemp_c')}: {Number(row.maxtemp_c).toFixed(2)}°C</p>
            <p>{t('mintemp_c')}: {Number(row.mintemp_c).toFixed(2)}°C</p>
            <p>{t('predicted_avgtemp_c')}: {Number(row.predicted_avgtemp_c).toFixed(2)}°C</p>
            <p>{t('avgtemp_c')}: {Number(row.avgtemp_c).toFixed(2)}°C</p>
            <p>{t('temp_range')}: {Number(row.temp_range).toFixed(2)}°C</p>
            <p>{t('humidity')}: {Number(row.avghumidity).toFixed(2)}%</p>
            <p>{t('wind')}: {Number(row.maxwind_mph).toFixed(2)} mph</p>
            <p>{t('precip')}: {Number(row.totalprecip_mm).toFixed(2)} mm</p>
            <p>{t('visibility')}: {Number(row.avgvis_km).toFixed(2)} km</p>
            <p>{t('condition_text')}: {row.condition_text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDisplay;
