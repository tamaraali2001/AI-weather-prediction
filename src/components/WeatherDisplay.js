// src/components/WeatherDisplay.js
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import {
  WiThermometer,
  WiHumidity,
  WiDaySunny,
  WiRain,
  WiSnow,
  WiCloudy,
} from "react-icons/wi";
import "./WeatherDisplay.css";

import snowWebP    from "../assets/snow.webp";
import cloudyWebP  from "../assets/cloudy.webp";
import defaultWebP from "../assets/default.webp";

// 🔹 Re-usable card for each metric
const MetricCard = ({ icon, label, value }) => (
  <div className="weather-card">
    <span className="icon">{icon}</span>
    <span className="label">{label}</span>
    <span className="value">{value}</span>
  </div>
);

const WeatherDisplay = ({ selectedRows, selectedCountry, selectedCity, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalDays   = selectedRows.length;
  const { t }       = useTranslation();

  const handleNext = () =>
    currentIndex < totalDays - 1 && setCurrentIndex(currentIndex + 1);
  const handlePrev = () =>
    currentIndex > 0         && setCurrentIndex(currentIndex - 1);

  const getMediaForCondition = (condition) => {
    const cond = condition?.toLowerCase() || "";
    if (cond.includes("snow"))  return snowWebP;
    if (cond.includes("cloud")) return cloudyWebP;
    return defaultWebP;
  };

  const getIconForCondition = (condition) => {
    const cond = condition?.toLowerCase() || "";
    if (cond.includes("rain"))  return <WiRain size={30} />;
    if (cond.includes("snow"))  return <WiSnow size={30} />;
    if (cond.includes("cloud")) return <WiCloudy size={30} />;
    if (cond.includes("sunny")) return <WiDaySunny size={30} />;
    return null;
  };

  return (
    <div className="weather-slider">
      {/* back button */}
      <button className="back-button" onClick={onBack}>
        {t("back")}
      </button>

      {/* slider */}
      <div className="slider-wrapper">
        <div
          className="slider"
          style={{ direction: "ltr", transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {selectedRows.map((data, idx) => (
            <div className="slide" key={idx}>
              <div className="media-container">
                <img
                  className="weather-media"
                  src={getMediaForCondition(data.conditions)}
                  alt={t("condition_text")}
                  loading="lazy"
                />

                {/* overlay with metric cards */}
                <div className="overlay-info">
                  <h2>
                    {selectedCity} - {data.date}
                  </h2>

                  <div className="weather-cards">
                    <MetricCard
                      icon={<WiThermometer size={26} />}
                      label={t("maxTemp")}
                      value={`${parseFloat(data.maxtemp_c).toFixed(1)}°C`}
                    />
                    <MetricCard
                      icon={<WiThermometer size={26} />}
                      label={t("minTemp")}
                      value={`${parseFloat(data.mintemp_c).toFixed(1)}°C`}
                    />
                    <MetricCard
                      icon={<WiThermometer size={26} />}
                      label={t("avgTemp")}
                      value={`${parseFloat(data.avgtemp_c).toFixed(1)}°C`}
                    />
                    <MetricCard
                      icon={<WiHumidity size={26} />}
                      label={t("humidity")}
                      value={`${parseFloat(data.humidity).toFixed(0)}%`}
                    />
                    <MetricCard
                      icon={getIconForCondition(data.conditions)}
                      label={t("condition_text")}
                      value={data.conditions}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* nav arrows */}
        <button
          className="nav-button prev"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <FaArrowLeft />
        </button>
        <button
          className="nav-button next"
          onClick={handleNext}
          disabled={currentIndex === totalDays - 1}
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default WeatherDisplay;
