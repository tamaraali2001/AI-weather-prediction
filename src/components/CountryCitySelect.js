// src/components/CountryCitySelect.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import './CountryCitySelect.css';

const CountryCitySelect = ({ 
  countries, 
  selectedCountry, 
  onCountryChange, 
  cities, 
  selectedCity, 
  onCityChange 
}) => {
  const { t } = useTranslation();

  return (
    <div className="select-container">
      <label>{t('selectCountry')}:</label>
      <select value={selectedCountry} onChange={onCountryChange}>
        <option value="">{t('selectCountry')} --</option>
        {countries.map((country, idx) => (
          <option key={idx} value={country}>
            {t(`countries.${country}`, { defaultValue: country })}
          </option>
        ))}
      </select>

      {cities.length > 0 && (
        <>
          <label>{t('selectCity')}:</label>
          <select value={selectedCity} onChange={onCityChange}>
            <option value="">{t('selectCity')} --</option>
            {cities.map((city, idx) => (
              <option key={idx} value={city}>
                {t(`cities.${city}`, { defaultValue: city })}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default CountryCitySelect;
