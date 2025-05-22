import React from "react";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import "./CountryCitySelect.css";

const fadeSlide = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

// 🎨 أنماط مخصصة لــ react‑select
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#fff",
    borderRadius: "8px",
    borderColor: state.isFocused ? "#00a3ff" : "#ccc",
    boxShadow: state.isFocused ? "0 0 0 3px rgba(0,153,255,.35)" : "none",
    padding: "2px 6px",
    "&:hover": { borderColor: "#00a3ff" },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "8px",
    padding: "0.3rem",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#003366"
      : state.isFocused
      ? "#4074a8"
      : "#fff",
    color: state.isSelected || state.isFocused ? "#fff" : "#333",
    cursor: "pointer",
    textAlign: "center",
  }),
};

export default function CountryCitySelect({
  countries,
  selectedCountry,
  onCountryChange,
  cities,
  selectedCity,
  onCityChange,
}) {
  const { t, i18n } = useTranslation();

  // ﹥ خيارات الدول والبلدان
  const countryOptions = countries.map((c) => ({
    value: c,
    label: t(`countries.${c}`, { defaultValue: c }),
  }));

  const cityOptions = cities.map((c) => ({
    value: c,
    label: t(`cities.${c}`, { defaultValue: c }),
  }));

  return (
    <motion.div
      className="select-container fancy-border"
      variants={fadeSlide}
      initial="hidden"
      animate="visible"
    >
      {/* -------- الدولة -------- */}
      <label className="animated-label">{t("selectCountry")}:</label>
      <Select
        instanceId="country-select"
        options={countryOptions}
        value={countryOptions.find((o) => o.value === selectedCountry) || null}
        onChange={(opt) => onCountryChange(opt ? opt.value : "")}
        placeholder={t("selectCountry")}
        isClearable
        styles={customStyles}
        classNamePrefix="react-select"
        menuPlacement="auto"
        menuShouldScrollIntoView={false}
      />

      {/* -------- المدينة -------- */}
      {cityOptions.length > 0 && (
        <>
          <label className="animated-label">{t("selectCity")}:</label>
          <Select
            instanceId="city-select"
            options={cityOptions}
            value={cityOptions.find((o) => o.value === selectedCity) || null}
            onChange={(opt) => onCityChange(opt ? opt.value : "")}
            placeholder={t("selectCity")}
            isClearable
            styles={customStyles}
            classNamePrefix="react-select"
            menuPlacement="auto"
          />
        </>
      )}
    </motion.div>
  );
}
