// CountryCitySelect.js  – النسخة النهائية
import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import "./CountryCitySelect.css";

const VISIBLE_OPTIONS = 4;          // عدد البنود الظاهرة مع Scroll داخلى

/* حركة بسيطة للبطاقة */
const fadeSlide = {
  hidden : { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
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
    >
      {/* -------- الدولة -------- */}
      <label className="animated-label">{t("selectCountry")}:</label>
      <select
        size={VISIBLE_OPTIONS}
        value={selectedCountry}
        onChange={onCountryChange}
      >
        <option value="">{t("selectCountry")} --</option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {t(`countries.${c}`, { defaultValue: c })}
          </option>
        ))}
      </select>

      {/* -------- المدينة -------- */}
      {cities.length > 0 && (
        <>
          <label className="animated-label">{t("selectCity")}:</label>
          <select
            size={VISIBLE_OPTIONS}
            value={selectedCity}
            onChange={onCityChange}
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
