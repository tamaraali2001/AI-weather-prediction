// src/components/CountryCitySelect.js
import React from 'react';
import './CountryCitySelect.css';

const CountryCitySelect = ({ countries, selectedCountry, onCountryChange, cities, selectedCity, onCityChange }) => {
  return (
    <div className="select-container">
      <label>Choose a Country:</label>
      <select value={selectedCountry} onChange={onCountryChange}>
        <option value="">--Select Country--</option>
        {countries.map((country, idx) => (
          <option key={idx} value={country}>{country}</option>
        ))}
      </select>
      {cities.length > 0 && (
        <>
          <label>Choose a City:</label>
          <select value={selectedCity} onChange={onCityChange}>
            <option value="">--Select City--</option>
            {cities.map((city, idx) => (
              <option key={idx} value={city}>{city}</option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default CountryCitySelect;
