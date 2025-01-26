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
  const { t, i18n } = useTranslation();

  return (
    <div className="select-container">
      {/* اختيار الدولة */}
      <label htmlFor="country-select">{t('selectCountry')}: </label>
      <select
        id="country-select"
        value={selectedCountry}
        onChange={onCountryChange}
      >
        <option value="">{t('selectCountry')}</option>
        {countries.map((country, index) => (
          <option key={index} value={country}>
            {/* نستخدم الترجمة بناءً على مفتاح countries في translation.json */}
            {t(`countries.${country}`, country)}
          </option>
        ))}
      </select>

      {/* اختيار المدينة */}
      {selectedCountry && (
        <>
          <label htmlFor="city-select">{t('selectCity')}: </label>
          <select id="city-select" value={selectedCity} onChange={onCityChange}>
            <option value="">{t('selectCity')}</option>
            {cities.map((city, index) => (
              <option key={index} value={city}>
                {/* نستخدم الترجمة بناءً على مفتاح cities في translation.json */}
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
