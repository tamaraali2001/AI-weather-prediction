// src/App.js
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import CountryCitySelect from './components/CountryCitySelect';
import WeatherDisplay from './components/WeatherDisplay';
import { useTranslation } from 'react-i18next';
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

  // تحميل بيانات CSV من public
  useEffect(() => {
    Papa.parse('/future_weather_predictions.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data;
        // فلترة البيانات التي تحتوي على البلد والمدينة أو المحافظات
        const filteredData = data.filter(row => row.country && (row.governorate || row.city));
        setCsvData(filteredData);

        // استخراج البلدان الفريدة وترتيبها
        const uniqueCountries = [...new Set(filteredData.map((row) => row.country))];
        setCountries(uniqueCountries.sort());
      },
      error: (err) => {
        console.error('Error parsing CSV:', err);
      },
    });
  }, []);

  // تحديد نطاق التواريخ (اليوم التالي ولمدة 7 أيام)
  const getDateRange = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 1); // اليوم التالي

    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 7); // لمدة 7 أيام من اليوم التالي

    // صياغة التواريخ بصيغة YYYY-MM-DD
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      start: formatDate(startDate),
      end: formatDate(endDate),
    };
  };

  const { start, end } = getDateRange();

  // معالجة تغيير البلد
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

  // معالجة تغيير المدينة
  const handleCityChange = (e) => {
    const selected = e.target.value;
    setSelectedCity(selected);

    if (selected) {
      const filteredRows = csvData.filter(
        (r) =>
          r.country === selectedCountry &&
          (r.governorate === selected || r.city === selected) &&
          r.date >= start &&
          r.date <= end
      );
      setSelectedRows(filteredRows);
    } else {
      setSelectedRows([]);
    }
  };

  // زر العودة
  const handleBack = () => {
    setSelectedRows([]);
    setSelectedCountry('');
    setSelectedCity('');
  };

  // تغيير اللغة
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  // تحديث عنوان الصفحة بناءً على اللغة
  useEffect(() => {
    document.title = t('logo');
  }, [i18n.language, t]);

  return (
    <div className={i18n.language === 'ar' ? 'rtl' : ''}>
      {/* شريط التنقل (Navbar) */}
      <nav className="navbar">
        <div className="logo">{t('logo')}</div>
        <div className="lang-switch">
          <button className="language-button" onClick={toggleLanguage}>
            {/* أيقونة الكرة الأرضية من react-icons */}
            <FaGlobe style={{ marginRight: '4px' }} />
            {i18n.language === 'en' ? 'AR' : 'EN'}
          </button>
        </div>
      </nav>

      {/* قسم البطل */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          {/* محتوى قسم البطل إذا لزم الأمر */}
        </div>
      </section>

      {/* حاوية المحتوى الرئيسي */}
      <div className="container">
        {/* نموذج اختيار البلد والمدينة */}
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

        {/* عرض بيانات الطقس */}
        {selectedRows.length > 0 && (
          <WeatherDisplay
            selectedRows={selectedRows}
            selectedCountry={selectedCountry}
            selectedCity={selectedCity}
            onBack={handleBack}
          />
        )}
      </div>

      {/* الفوتر إذا لزم الأمر */}
    </div>
  );
}

export default App;
