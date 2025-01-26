// src/App.js
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import CountryCitySelect from './components/CountryCitySelect';
import WeatherDisplay from './components/WeatherDisplay';
import { useTranslation } from 'react-i18next';
import './App.css';

function App() {
  const [csvData, setCsvData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  
  // سيتم تخزين كل الصفوف التابعة للمحافظة المختارة في هذا المتغيّر
  const [selectedRows, setSelectedRows] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const { i18n } = useTranslation();

  // عند تحميل التطبيق نجلب ملف CSV من فولدر public
  useEffect(() => {
    Papa.parse('/future_weather_predictions.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data;
        setCsvData(data);

        // استخلاص قائمة الدول
        const uniqueCountries = [...new Set(data.map((row) => row.country))];
        setCountries(uniqueCountries.sort());
      },
      error: (err) => {
        console.error('Error parsing CSV:', err);
      },
    });
  }, []);

  // عند تغيير الدولة، نُظهر المدن/المحافظات الخاصة بها
  const handleCountryChange = (e) => {
    const selected = e.target.value;
    setSelectedCountry(selected);
    setSelectedCity('');
    setSelectedRows([]); // إعادة التهيئة

    if (selected) {
      // جلب كل المدن/المحافظات المرتبطة بهذه الدولة
      const filtered = csvData.filter((row) => row.country === selected);
      const uniqueCities = [...new Set(filtered.map((row) => row.governorate || row.city))];
      setCities(uniqueCities.sort());
    } else {
      setCities([]);
    }
  };

  // عند اختيار مدينة/محافظة
  const handleCityChange = (e) => {
    const selected = e.target.value;
    setSelectedCity(selected);

    if (selected) {
      // نجلب جميع السجلات الخاصة بهذه المدينة (أو المحافظة)
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

  // زر الرجوع إلى اختيار الدولة/المحافظة
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
    <div className="app-container">
      {/* زر اللغة (أيقونة) */}
      <div className="lang-switch">
        <button className="language-button" onClick={toggleLanguage}>
          {/* يمكنك وضع أيقونة Font Awesome مثلاً أو أيقونة SVG تعبّر عن المشروع */}
          <span className="material-icons">
            translate
          </span>
        </button>
      </div>

      {/* حاوية لعرض عناصر الاختيار إما في اليسار أو اليمين حسب اللغة */}
      <div className={`layout-container ${i18n.language === 'ar' ? 'rtl' : 'ltr'}`}>
        <CountryCitySelect
          countries={countries}
          selectedCountry={selectedCountry}
          onCountryChange={handleCountryChange}
          cities={cities}
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
        />
      </div>

      {/* إذا كان لدينا صفوف مختارة (مدينة مختارة) نعرض الطقس */}
      {selectedRows.length > 0 && (
        <WeatherDisplay
          selectedRows={selectedRows}
          selectedCountry={selectedCountry}
          selectedCity={selectedCity}
          onBack={handleBack}
        />
      )}
    </div>
  );
}

export default App;
