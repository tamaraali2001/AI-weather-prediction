// src/components/CountryCitySelect.js
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './CountryCitySelect.css';

const fadeSlide = {
  hidden:  { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

export default function CountryCitySelect({
  countries,
  selectedCountry,
  onCountryChange,
  cities,
  selectedCity,
  onCityChange
}) {
  const { t } = useTranslation();

  return (
    <motion.div
      className="select-container fancy-border"
      variants={fadeSlide}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
    >
      <label className="animated-label">{t('selectCountry')}:</label>
      <motion.select
        value={selectedCountry}
        onChange={onCountryChange}
        whileFocus={{ scale: 1.01 }}
        whileTap={{ scale: 0.97 }}
      >
        <option value="">{t('selectCountry')} --</option>
        {countries.map(country => (
          <option key={country} value={country}>
            {t(`countries.${country}`, { defaultValue: country })}
          </option>
        ))}
      </motion.select>

      {cities.length > 0 && (
        <>
          <label className="animated-label">{t('selectCity')}:</label>
          <motion.select
            value={selectedCity}
            onChange={onCityChange}
            whileFocus={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
          >
            <option value="">{t('selectCity')} --</option>
            {cities.map(city => (
              <option key={city} value={city}>
                {t(`cities.${city}`, { defaultValue: city })}
              </option>
            ))}
          </motion.select>
        </>
      )}
    </motion.div>
  );
}
