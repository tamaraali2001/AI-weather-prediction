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

// import sunnyWebP from '../assets/sunny.webp';
// import rainWebP from '../assets/rain.webp';
import snowWebP from '../assets/snow.webp';
import cloudyWebP from '../assets/cloudy.webp';
import defaultWebP from '../assets/default.webp';

const WeatherDisplay = ({
  selectedRows,
  selectedCountry,
  selectedCity,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalDays = selectedRows.length;
  const { t } = useTranslation();

  const handleNext = () => {
    if (currentIndex < totalDays - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentData = selectedRows[currentIndex];

  const getMediaForCondition = (condition) => {
    const cond = condition?.toLowerCase() || "";
    // if (cond.includes("rain")) return rainWebP;
    if (cond.includes("snow")) return snowWebP;
    if (cond.includes("cloud")) return cloudyWebP;
    // if (cond.includes("sunny")) return sunnyWebP;
    return defaultWebP;
  };

  const getIconForCondition = (condition) => {
    const cond = condition?.toLowerCase() || "";
    if (cond.includes("rain")) return <WiRain size={30} />;
    if (cond.includes("snow")) return <WiSnow size={30} />;
    if (cond.includes("cloud")) return <WiCloudy size={30} />;
    if (cond.includes("sunny")) return <WiDaySunny size={30} />;
    return null;
  };

  return (
    <div className="weather-slider">
      <button className="back-button" onClick={onBack}>
        {t("back")}
      </button>

      <div className="slider-wrapper">
        <div
          className="slider"
          style={{
            direction: "ltr",
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {selectedRows.map((data, idx) => {
            const mediaSrc = getMediaForCondition(data.conditions);
            return (
              <div className="slide" key={idx}>
                <div className="media-container">
                  <img
                    className="weather-media"
                    src={mediaSrc}
                    alt={t("condition_text")}
                    loading="lazy"
                  />

                  <div className="overlay-info">
                    <h2>
                      {selectedCity} - {data.date}
                    </h2>

                    <p>
                      <WiThermometer
                        size={24}
                        style={{ verticalAlign: "middle" }}
                      />
                      &nbsp;{t("maxTemp")}:{" "}
                      {parseFloat(data.maxtemp_c).toFixed(1)}°C
                    </p>

                    <p>
                      <WiThermometer
                        size={24}
                        style={{ verticalAlign: "middle" }}
                      />
                      &nbsp;{t("minTemp")}:{" "}
                      {parseFloat(data.mintemp_c).toFixed(1)}°C
                    </p>

                    <p>
                      <WiThermometer
                        size={24}
                        style={{ verticalAlign: "middle" }}
                      />
                      &nbsp;{t("avgTemp")}:{" "}
                      {parseFloat(data.avgtemp_c).toFixed(1)}°C
                    </p>

                    <p>
                      <WiHumidity
                        size={24}
                        style={{ verticalAlign: "middle" }}
                      />
                      &nbsp;{t("humidity")}:{" "}
                      {parseFloat(data.humidity).toFixed(0)}%
                    </p>

                    <p>
                      {getIconForCondition(data.conditions)} &nbsp;
                      {data.conditions}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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
