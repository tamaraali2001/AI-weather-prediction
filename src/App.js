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

  /* تبديل الخلفية عند اختيار دولة */
  useEffect(() => {
    const body = document.body;
    if (selectedCountry) body.classList.add("alt-bg");
    else body.classList.remove("alt-bg");
  }, [selectedCountry]);

  /* تعطيل التمرير عندما تكون شاشة الاختيار مكبرة */
  useEffect(() => {
    if (selectedRows.length === 0) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");
    return () => document.body.classList.remove("no-scroll");
  }, [selectedRows]);

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

  /* رجوع من شاشة الطقس */
  const handleBack = () => {
    setSelectedRows([]);
    setSelectedCountry("");
    setSelectedCity("");
  };

  /* تبديل اللغة */
  const toggleLanguage = () =>
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");

  /* تحديث عنوان التبويب */
  useEffect(() => {
    document.title = t("logo");
  }, [i18n.language, t]);

  /* —— شاشة الطقس —— */
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

  /* —— شاشة الاختيار —— */
  return (
    <div className={i18n.language === "ar" ? "rtl" : ""}>
      {/* Globe يظهر فقط بعد اختيار دولة */}
      {selectedCountry && (
        <GlobeScene
          activeCountry={selectedCountry}
          activeCity={selectedCity}
          initialView={{ lat: 20, lng: 45, alt: 2 }}  /* اضبط كما تريد */
        />
      )}

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">{t("logo")}</div>
        <button className="language-button" onClick={toggleLanguage}>
          <FaGlobe style={{ marginRight: 4 }} />
          {i18n.language === "en" ? "AR" : "EN"}
        </button>
      </nav>

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

      {/* Footer */}
      <footer className="footer">
        <p className="university">
          UOITC – University of Information Technology &amp; Communications
        </p>
        <p className="credits">
          <strong>Supervised&nbsp;by&nbsp;</strong>
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
