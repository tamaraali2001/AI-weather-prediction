// App.js
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import CountryCitySelect from './components/CountryCitySelect';
import WeatherDisplay from './components/WeatherDisplay';
import { useTranslation } from 'react-i18next';

// مكتبة الأيقونات
import { FaGlobe } from 'react-icons/fa';

import './App.css';

function App() {
  const [csvData, setCsvData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const { i18n, t } = useTranslation();

  // عند تحميل التطبيق نجلب ملف CSV من فولدر public
  useEffect(() => {
    Papa.parse('/future_weather_predictions.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data;
        setCsvData(data);

        // استخراج قائمة الدول
        const uniqueCountries = [...new Set(data.map((row) => row.country))];
        setCountries(uniqueCountries.sort());
      },
      error: (err) => {
        console.error('Error parsing CSV:', err);
      },
    });
  }, []);

  // تغيير الدولة
  const handleCountryChange = (e) => {
    const selected = e.target.value;
    setSelectedCountry(selected);
    setSelectedCity('');
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

  // اختيار المدينة
  const handleCityChange = (e) => {
    const selected = e.target.value;
    setSelectedCity(selected);

    if (selected) {
      const filteredRows = csvData.filter(
        (r) =>
          r.country === selectedCountry &&
          (r.governorate === selected || r.city === selected)
      );
      setSelectedRows(filteredRows);
    } else {
      setSelectedRows([]);
    }
  };

  // زر الرجوع للاختيار
  const handleBack = () => {
    setSelectedRows([]);
    setSelectedCountry('');
    setSelectedCity('');
  };

  // تبديل اللغة
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  return (
    <div className={i18n.language === 'ar' ? 'rtl' : ''}>
      {/* شريط علوي (Navbar) */}
      <nav className="navbar">
        <div className="logo">AI Weather</div>
        <div className="lang-switch">
          <button className="language-button" onClick={toggleLanguage}>
            {/* أيقونة من react-icons */}
            <FaGlobe style={{ marginRight: '4px' }} />
            {/* يمكن كتابة أي نص أو جعله مجرد أيقونة */}
          </button>
        </div>
      </nav>

      {/* قسم بانر (Hero Section) */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>{t('appTitle') || 'AI Weather Prediction'}</h1>
          <p>{t('appSubtitle') || 'Accurate future weather predictions powered by AI'}</p>
        </div>
      </section>

      {/* حاوية عامة تحتوى صندوق اختيار الدولة/المدينة */}
      <div className="container">
        {/* مكون الاختيار */}
        {selectedRows.length === 0 && (
          <CountryCitySelect
            countries={countries}
            selectedCountry={selectedCountry}
            onCountryChange={handleCountryChange}
            cities={cities}
            selectedCity={selectedCity}
            onCityChange={handleCityChange}
          />
        )}

        {/* إذا تم اختيار صفوف معينة نعرض الطقس */}
        {selectedRows.length > 0 && (
          <WeatherDisplay
            selectedRows={selectedRows}
            selectedCountry={selectedCountry}
            selectedCity={selectedCity}
            onBack={handleBack}
          />
        )}
      </div>

      {/* فوتر اختياري */}
      <footer className="footer">
        &copy; 2025 AI Weather. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
