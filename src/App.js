import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import CountryCitySelect from "./components/CountryCitySelect";
import WeatherDisplay from "./components/WeatherDisplay";
import GlobeScene from "./components/GlobeScene";
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

  /* تحميل CSV */
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
      error: (err) => console.error("Error parsing CSV:", err),
    });
  }, []);

  /* تبديل الخلفية */
  useEffect(() => {
    document.body.classList.toggle("alt-bg", !!selectedCountry);
  }, [selectedCountry]);

  /* تغيير الدولة */
  const handleCountryChange = (val) => {
    setSelectedCountry(val);
    setSelectedCity("");
    setSelectedRows([]);

    if (val) {
      const filtered = csvData.filter((r) => r.country === val);
      setCities([...new Set(filtered.map((r) => r.governorate || r.city))].sort());
    } else {
      setCities([]);
    }
  };

  /* تغيير المدينة */
  const handleCityChange = (val) => {
    setSelectedCity(val);
    if (val) {
      const rows = csvData
        .filter(
          (r) =>
            r.country === selectedCountry &&
            (r.governorate === val || r.city === val)
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      setSelectedRows(rows);
    } else {
      setSelectedRows([]);
    }
  };

  /* زر العودة */
  const handleBack = () => {
    setSelectedRows([]);
    setSelectedCountry("");
    setSelectedCity("");
  };

  /* تبديل اللغة */
  const toggleLanguage = () =>
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");

  /* تحديث العنوان */
  useEffect(() => {
    document.title = t("logo");
  }, [i18n.language, t]);

  /* شاشة الطقس */
  if (selectedRows.length) {
    return (
      <div className={i18n.language === "ar" ? "rtl" : ""}>
        <WeatherDisplay
          selectedRows={selectedRows}
          selectedCountry={selectedCountry}
          selectedCity={selectedCity}
          onBack={handleBack}
        />
        {/* زر اللغة يظل ظاهرًا دائماً */}
        <button className="lang-switch" onClick={toggleLanguage}>
          <FaGlobe style={{ marginRight: 4 }} />
          {i18n.language === "en" ? "AR" : "EN"}
        </button>
      </div>
    );
  }

  /* شاشة الاختيار */
  return (
    <div className={i18n.language === "ar" ? "rtl" : ""}>
      {/* كرة الأرضية عند اختيار دولة */}
      {selectedCountry && (
        <GlobeScene
          activeCountry={selectedCountry}
          activeCity={selectedCity}
          initialView={{ lat: 20, lng: 45, alt: 3.5 }}
        />
      )}

      {/* زرّ تبديل اللغة (ثابت بأعلى الصفحة) */}
      <button className="lang-switch" onClick={toggleLanguage}>
        <FaGlobe style={{ marginRight: 4 }} />
        {i18n.language === "en" ? "AR" : "EN"}
      </button>

      {/* اختيار الدولة / المدينة */}
      <section className="selection-bg">
        <CountryCitySelect
          countries={countries}
          selectedCountry={selectedCountry}
          onCountryChange={handleCountryChange}
          cities={cities}
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
        />
      </section>

      {/* Footer المحدث */}
      <footer className="footer">
        <div className="footer-inner">
      
          <p className="credits-line">
            By&nbsp;Tamara&nbsp;Ali&nbsp;Fadel&nbsp;•&nbsp;Mohammed&nbsp;Abbas&nbsp;•&nbsp;Qassem&nbsp;Sarem&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;
            Supervised&nbsp;by&nbsp;Lecture&nbsp;Zena&nbsp;Jamal&nbsp;Jabbar&nbsp;•&nbsp;Dr.&nbsp;Ola&nbsp;Adel&nbsp;Qasim
          </p>
          <p className="copyright">UOITC – MTCE © 2024-2025 Weather Platform</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
