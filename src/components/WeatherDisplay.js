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
      <h2>
        {t(`cities.${selectedRow.city}`, selectedRow.city)} - {t(`countries.${selectedRow.country}`, selectedRow.country)}
      </h2>

      {/* جدول أكثر احترافية لعرض المعلومات */}
      <table className="weather-table">
        <tbody>
          <tr>
            <td>{t('date')}</td>
            <td>{selectedRow.date}</td>
          </tr>
          <tr>
            <td>{t('season')}</td>
            <td>{selectedRow.season}</td>
          </tr>
          <tr>
            <td>{t('maxTemp')}</td>
            <td>{Number(selectedRow.maxtemp_c).toFixed(1)}</td>
          </tr>
          <tr>
            <td>{t('minTemp')}</td>
            <td>{Number(selectedRow.mintemp_c).toFixed(1)}</td>
          </tr>
          <tr>
            <td>{t('avgTemp')}</td>
            <td>
              {(
                (Number(selectedRow.maxtemp_c) + Number(selectedRow.mintemp_c)) /
                2
              ).toFixed(1)}
            </td>
          </tr>
          <tr>
            <td>{t('predictedTemp')}</td>
            <td>{Number(selectedRow['Predicted Avg Temp']).toFixed(1)}</td>
          </tr>
          <tr>
            <td>{t('rangeTemp')}</td>
            <td>{Number(selectedRow.temp_range).toFixed(1)}</td>
          </tr>
          <tr>
            <td>{t('humidity')}</td>
            <td>{Number(selectedRow.avghumidity).toFixed(1)}</td>
          </tr>
          <tr>
            <td>{t('wind')}</td>
            <td>{Number(selectedRow.maxwind_mph).toFixed(1)}</td>
          </tr>
          <tr>
            <td>{t('precip')}</td>
            <td>{Number(selectedRow.totalprecip_mm).toFixed(2)}</td>
          </tr>
          <tr>
            <td>{t('visibility')}</td>
            <td>{Number(selectedRow.avgvis_km).toFixed(1)}</td>
          </tr>
          <tr>
            <td>{t('uvIndex')}</td>
            <td>{Number(selectedRow.uv_index).toFixed(1)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WeatherDisplay;
