// src/components/CountryCitySelect.js
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import "./CountryCitySelect.css";

const VISIBLE_OPTIONS = 4;   // الحدّ الأقصى لعدد الخيارات الظاهرة

/* حركة بسيطة لظهور البطاقة */
const fadeSlide = {
  hidden:  { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
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

  /* مراجع لتغيير/إزالة سمة size */
  const countryRef = useRef(null);
  const cityRef    = useRef(null);

  /* توسعة القائمة أثناء التركيز */
  const expandIfNeeded = (ref, len) => {
    if (ref.current && len > VISIBLE_OPTIONS) {
      ref.current.size = VISIBLE_OPTIONS;   // يعرض 4 عناصر مع Scroll
    }
  };

  /* طيّ القائمة بإزالة السمة size */
  const collapse = (ref) => {
    if (ref.current) {
      ref.current.removeAttribute("size");
    }
  };

  /* معالجات الاختيار */
  const handleCountrySelect = (e) => {
    collapse(countryRef);
    onCountryChange(e);         // إبلاغ المكوّن الأب
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
    >
      {/* -------- اختيار الدولة -------- */}
      <label className="animated-label">{t("selectCountry")}:</label>
      <select
        ref={countryRef}
        value={selectedCountry}
        onFocus={() => expandIfNeeded(countryRef, countries.length)}
        onBlur={()  => collapse(countryRef)}
        onChange={handleCountrySelect}
      >
        <option value="">{t("selectCountry")} --</option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {t(`countries.${c}`, { defaultValue: c })}
          </option>
        ))}
      </select>

      {/* -------- اختيار المدينة -------- */}
      {cities.length > 0 && (
        <>
          <label className="animated-label">{t("selectCity")}:</label>
          <select
            ref={cityRef}
            value={selectedCity}
            onFocus={() => expandIfNeeded(cityRef, cities.length)}
            onBlur={()  => collapse(cityRef)}
            onChange={handleCitySelect}
          >
            <option value="">{t("selectCity")} --</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {t(`cities.${city}`, { defaultValue: city })}
              </option>
            ))}
          </select>
        </>
      )}
    </motion.div>
  );
}
