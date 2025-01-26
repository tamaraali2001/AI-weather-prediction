// src/components/WeatherDisplay.js
import React from 'react';
import { useTranslation } from 'react-i18next';

const WeatherDisplay = ({ selectedRow, onBack }) => {
  const { t } = useTranslation();

  if (!selectedRow) return null;

  return (
    <div className="weather-card animate-fade-in">
      <button onClick={onBack} className="back-button">
        {t('backToSelect')}
      </button>
      <h2>{selectedRow.city} - {selectedRow.country}</h2>
      <p>{t('date')}: {selectedRow.date}</p>
      <p>{t('season')}: {selectedRow.season}</p>
      <p>{t('maxTemp')}: {Number(selectedRow.maxtemp_c).toFixed(1)}</p>
      <p>{t('minTemp')}: {Number(selectedRow.mintemp_c).toFixed(1)}</p>
      <p>{t('avgTemp')}: {((Number(selectedRow.maxtemp_c) + Number(selectedRow.mintemp_c)) / 2).toFixed(1)}</p>
      <p>{t('predictedTemp')}: {Number(selectedRow["Predicted Avg Temp"]).toFixed(1)}</p>
      <p>{t('rangeTemp')}: {Number(selectedRow.temp_range).toFixed(1)}</p>
      <p>{t('humidity')}: {Number(selectedRow.avghumidity).toFixed(1)}</p>
      <p>{t('wind')}: {Number(selectedRow.maxwind_mph).toFixed(1)}</p>
      <p>{t('precip')}: {Number(selectedRow.totalprecip_mm).toFixed(2)}</p>
      <p>{t('visibility')}: {Number(selectedRow.avgvis_km).toFixed(1)}</p>
      <p>{t('uvIndex')}: {Number(selectedRow.uv_index).toFixed(1)}</p>
    </div>
  );
};

export default WeatherDisplay;
