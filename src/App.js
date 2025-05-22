// src/App.js
import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import CountryCitySelect from "./components/CountryCitySelect";
import WeatherDisplay from "./components/WeatherDisplay";
import { useTranslation } from "react-i18next";
import { FaGlobe } from "react-icons/fa";
import "./App.css";

function App() {
  const [csvData, setCsvData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const { i18n, t } = useTranslation();

  /* ➊ تحميل CSV مرة واحدة */
  useEffect(() => {
    Papa.parse("/future_weather_predictions.csv", {
      download: true,
      header: true,
      complete: ({ data }) => {
        const filtered = data.filter(
          (row) => row.country && (row.governorate || row.city)
        );
        setCsvData(filtered);
        setCountries([...new Set(filtered.map((r) => r.country))].sort());
      },
      error: (err) => console.error("Error parsing CSV:", err)
    });
  }, []);

  /* ➋ عند اختيار دولة */
  const handleCountryChange = (e) => {
    const selected = e.target.value;
    setSelectedCountry(selected);
    setSelectedCity("");
    setSelectedRows([]);

    if (selected) {
      const filtered = csvData.filter((r) => r.country === selected);
      setCities([...new Set(filtered.map((r) => r.governorate || r.city))].sort());
    } else {
      setCities([]);
    }
  };

  /* ➌ عند اختيار مدينة */
  const handleCityChange = (e) => {
    const selected = e.target.value;
    setSelectedCity(selected);

    if (selected) {
      const rows = csvData
        .filter(
          (r) =>
            r.country === selectedCountry &&
            (r.governorate === selected || r.city === selected)
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      setSelectedRows(rows);
    } else {
      setSelectedRows([]);
    }
  };

  /* ➍ زر «عودة» من شاشة الطقس */
  const handleBack = () => {
    setSelectedRows([]);
    setSelectedCountry("");
    setSelectedCity("");
  };

  /* ➎ التبديل بين العربية/الإنجليزية */
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  };

  /* ➏ تحديث عنوان التبويب */
  useEffect(() => {
    document.title = t("logo");
  }, [i18n.language, t]);

  /* ــــــــــ واجهة السلايدر عند اختيار مدينة ــــــــــ */
  if (selectedRows.length) {
    return (
      <div className={i18n.language === "ar" ? "rtl" : ""}>
        <WeatherDisplay
          selectedRows={selectedRows}
          selectedCountry={selectedCountry}
          selectedCity={selectedCity}
          onBack={handleBack}
        />
      </div>
    );
  }

  /* ــــــــــ الواجهة الرئيسيّة مع صندوق الاختيار ــــــــــ */
  return (
    <div className={i18n.language === "ar" ? "rtl" : ""}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">{t("logo")}</div>
        <button className="language-button" onClick={toggleLanguage}>
          <FaGlobe style={{ marginRight: 4 }} />
          {i18n.language === "en" ? "AR" : "EN"}
        </button>
      </nav>

      {/* بانر علوي */}
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content" />
      </section>

      {/* خلفيّة جماليّة + بطاقة الاختيار */}
      <section className="selection-bg">
        <div className="container">
          <CountryCitySelect
            countries={countries}
            selectedCountry={selectedCountry}
            onCountryChange={handleCountryChange}
            cities={cities}
            selectedCity={selectedCity}
            onCityChange={handleCityChange}
          />
        </div>
      </section>

      {/* Footer ثابت */}
      <footer className="footer">
        <p className="university">
          UOITC – University of Information Technology &amp; Communications
        </p>

        <p className="credits">
          <strong>Supervised by&nbsp;</strong>
          Lecture&nbsp;Zena&nbsp;Jamal&nbsp;Jabbar • Dr.&nbsp;Ola&nbsp;Adel&nbsp;Qasim
        </p>

        <p className="credits">
          <strong>By&nbsp;</strong>
          Tamara&nbsp;Ali&nbsp;Fadel • Mohammed&nbsp;Abbas • Qassem&nbsp;Sarem
        </p>

        <p className="copyright">© 2024-2025 Weather Platform</p>
      </footer>
    </div>
  );
}

export default App;
