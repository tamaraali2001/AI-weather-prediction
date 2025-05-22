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

  // تحميل بيانات CSV من مجلد public
  useEffect(() => {
    Papa.parse("/future_weather_predictions.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data;
        // فلترة الصفوف التي تحتوي على البلد واسم المدينة أو المحافظة
        const filteredData = data.filter(
          (row) => row.country && (row.governorate || row.city)
        );
        setCsvData(filteredData);
        // استخراج قائمة البلدان الفريدة وترتيبها
        const uniqueCountries = [
          ...new Set(filteredData.map((row) => row.country)),
        ];
        setCountries(uniqueCountries.sort());
      },
      error: (err) => {
        console.error("Error parsing CSV:", err);
      },
    });
  }, []);

  // عند تغيير البلد
  const handleCountryChange = (e) => {
    const selected = e.target.value;
    setSelectedCountry(selected);
    setSelectedCity("");
    setSelectedRows([]);

    if (selected) {
      const filtered = csvData.filter((row) => row.country === selected);
      const uniqueCities = [
        ...new Set(filtered.map((row) => row.governorate || row.city)),
      ];
      setCities(uniqueCities.sort());
    } else {
      setCities([]);
    }
  };

  // عند تغيير المدينة – نزيل شرط التاريخ لعرض جميع البيانات المتوفرة
  const handleCityChange = (e) => {
    const selected = e.target.value;
    setSelectedCity(selected);

    if (selected) {
      const filteredRows = csvData.filter(
        (row) =>
          row.country === selectedCountry &&
          (row.governorate === selected || row.city === selected)
      );
      // ترتيب البيانات حسب التاريخ (اختياري)
      filteredRows.sort((a, b) => new Date(a.date) - new Date(b.date));
      setSelectedRows(filteredRows);
    } else {
      setSelectedRows([]);
    }
  };

  // زر العودة لإعادة تعيين الاختيارات
  const handleBack = () => {
    setSelectedRows([]);
    setSelectedCountry("");
    setSelectedCity("");
  };

  // تبديل اللغة
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  };

  useEffect(() => {
    document.title = t("logo");
  }, [i18n.language, t]);

  // إذا تم اختيار مدينة (أي selectedRows غير فارغة)، اعرض شاشة السلايدر فقط
  if (selectedRows.length > 0) {
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

  // في حالة عدم وجود بيانات السلايدر، اعرض الواجهة الكاملة مع خيارات الاختيار
  return (
    <div className={i18n.language === "ar" ? "rtl" : ""}>
      <nav className="navbar">
        <div className="logo">{t("logo")}</div>
        <div className="lang-switch">
          <button className="language-button" onClick={toggleLanguage}>
            <FaGlobe style={{ marginRight: "4px" }} />
            {i18n.language === "en" ? "AR" : "EN"}
          </button>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">{/* يمكنك وضع عنوان أو شعار هنا */}</div>
      </section>

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

      <footer className="footer">
  

{/* 🟡 سطر الجامعة المختصَر */}
  <p className="university">UOITC – University of Information Technology & Communications</p>

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
