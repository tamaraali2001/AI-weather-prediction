// src/components/CountryCitySelect.js
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import "./CountryCitySelect.css";

const fadeSlide = {
  hidden:  { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const VISIBLE_OPTIONS = 4;     // الحد الأقصى للعناصر المعرَضة

export default function CountryCitySelect({
  countries,
  selectedCountry,
  onCountryChange,
  cities,
  selectedCity,
  onCityChange
}) {
  const { t } = useTranslation();

  // مراجع للتحكم بسمة size
  const countryRef = useRef(null);
  const cityRef    = useRef(null);

  /* توسيع عند التركيز */
  const expandIfNeeded = (ref, len) => {
    if (ref.current && len > VISIBLE_OPTIONS) {
      ref.current.size = VISIBLE_OPTIONS;
    }
  };

  /* طيّ القائمة: إزالة السمة تمامًا */
  const collapse = (ref) => {
    if (ref.current) {
      ref.current.removeAttribute("size");
    }
  };

  /* معالجات الاختيار */
  const handleCountrySelect = (e) => {
    collapse(countryRef);
    onCountryChange(e);
  };

  const handleCitySelect = (e) => {
    collapse(cityRef);
    onCityChange(e);
  };

  return (
    <motion.div
      className="select-container fancy-border"
      variants={fadeSlide}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
    >
      {/* اختيار الدولة */}
      <label className="animated-label">{t("selectCountry")}:</label>
      <motion.select
        ref={countryRef}
        value={selectedCountry}
        onFocus={() => expandIfNeeded(countryRef, countries.length)}
        onBlur={()  => collapse(countryRef)}
        onChange={handleCountrySelect}
        whileFocus={{ scale: 1.01 }}
        whileTap={{ scale: 0.97 }}
      >
        <option value="">{t("selectCountry")} --</option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {t(`countries.${c}`, { defaultValue: c })}
          </option>
        ))}
      </motion.select>

      {/* اختيار المدينة */}
      {cities.length > 0 && (
        <>
          <label className="animated-label">{t("selectCity")}:</label>
          <motion.select
            ref={cityRef}
            value={selectedCity}
            onFocus={() => expandIfNeeded(cityRef, cities.length)}
            onBlur={()  => collapse(cityRef)}
            onChange={handleCitySelect}
            whileFocus={{ scale: 1.01 }}
            whileTap={{ scale: 0.97 }}
          >
            <option value="">{t("selectCity")} --</option>
            {cities.map((city) => (
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
