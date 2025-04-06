// src/components/CountryCitySelect.js
import React from 'react';
import { useTranslation } from 'react-i18next';

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
      <label htmlFor="country-select">{t('selectCountry')}:</label>
      <select
        id="country-select"
        value={selectedCountry}
        onChange={onCountryChange}
      >
        <option value="">{t('selectCountry')}</option>
        {countries.map((country, index) => (
          <option key={index} value={country}>
            {t(`countries.${country}`, country)}
          </option>
        ))}
      </select>

      {selectedCountry && (
        <>
          <label htmlFor="city-select">{t('selectCity')}:</label>
          <select id="city-select" value={selectedCity} onChange={onCityChange}>
            <option value="">{t('selectCity')}</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {t(`cities.${city}`, city)}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default CountryCitySelect;
