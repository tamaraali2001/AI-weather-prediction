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
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);

  const { t, i18n } = useTranslation();

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

  // عند تغيير الدولة، نظهر المدن الخاصة بها
  const handleCountryChange = (e) => {
    const selected = e.target.value;
    setSelectedCountry(selected);
    setSelectedCity('');
    setSelectedRow(null);

    if (selected) {
      // جلب كل المدن المربوطة بهذه الدولة
      const filtered = csvData.filter((row) => row.country === selected);
      const uniqueCities = [...new Set(filtered.map((row) => row.governorate || row.city || row.governorate))];
      setCities(uniqueCities.sort());
    } else {
      setCities([]);
    }
  };

  // عند اختيار مدينة، نستخرج الصف المناسب من البيانات
  const handleCityChange = (e) => {
    const selected = e.target.value;
    setSelectedCity(selected);

    if (selected) {
      const row = csvData.find(
        (r) =>
          r.country === selectedCountry &&
          (r.governorate === selected || r.city === selected)
      );
      if (row) {
        // يمكن تخزين أكثر من صف لو كان هناك تواريخ متعددة
        setSelectedRow({ ...row, city: selected }); 
      }
    } else {
      setSelectedRow(null);
    }
  };

  const handleBack = () => {
    setSelectedRow(null);
    setSelectedCountry('');
    setSelectedCity('');
  };

  // تبديل اللغة
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="app-container">
      <div className="lang-switch">
        <button onClick={toggleLanguage}>{t('languageSwitch')}</button>
      </div>

      {!selectedRow && (
        <CountryCitySelect
          countries={countries}
          selectedCountry={selectedCountry}
          onCountryChange={handleCountryChange}
          cities={cities}
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
        />
      )}

      {selectedRow && (
        <WeatherDisplay 
          selectedRow={selectedRow} 
          onBack={handleBack} 
        />
      )}
    </div>
  );
}

export default App;
