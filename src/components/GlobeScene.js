// src/components/GlobeScene.js
import React, { useRef, useEffect, useState, useMemo } from "react";
import Globe from "react-globe.gl";
import { feature } from "topojson-client";
import * as d3 from "d3-geo";
import cityCoords from "../assets/city_coords.json";   // 🆕

export default function GlobeScene({ activeCountry, activeCity }) {
  const globeRef = useRef();
  const [countries, setCountries] = useState([]);

  /* ➊ حمّل خريطة العالم مرّة واحدة */
  useEffect(() => {
    fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
      .then((r) => r.json())
      .then((topology) =>
        setCountries(feature(topology, topology.objects.countries).features)
      );
  }, []);

  /* ➋ حرّك الكاميرا عند تغيير الدولة/المدينة */
  useEffect(() => {
    if (!countries.length) return;

    /* أولوية المدينة ثم الدولة */
    if (activeCity && cityCoords[activeCity]) {
      const [lat, lng] = cityCoords[activeCity];
      globeRef.current.pointOfView({ lat, lng, altitude: 1.3 }, 2000);
    } else if (activeCountry) {
      const f = countries.find((c) => c.properties.name === activeCountry);
      if (f) {
        const [lng, lat] = d3.geoCentroid(f);
        globeRef.current.pointOfView({ lat, lng, altitude: 1.5 }, 2000);
      }
    }
  }, [activeCountry, activeCity, countries]);

  /* ➌ تهيئة بيانات الحلقة للمدينة */
  const ringsData = useMemo(() => {
    if (activeCity && cityCoords[activeCity]) {
      const [lat, lng] = cityCoords[activeCity];
      return [
        {
          lat,
          lng,
          maxR: 0.6,          // نصف قطر الحلقة
          propagationSpeed: 2,// مدى سرعة التمدد
          repeatPeriod: 1800  // كل كم مللي ثانية تكرّر
        }
      ];
    }
    return [];
  }, [activeCity]);

  return (
    <Globe
      ref={globeRef}
      /* مضلّعات الدول */
      polygonsData={countries}
      polygonCapColor={(d) =>
        d.properties.name === activeCountry
          ? "rgba(255,165,0,0.55)" // 🟧 الدولة المفعّلة
          : "rgba(0,150,255,0.35)"
      }
      polygonSideColor={() => "rgba(0,150,255,0.15)"}
      polygonStrokeColor={(d) =>
        d.properties.name === activeCountry ? "#ffa500" : "#0096ff"
      }
      polygonAltitude={(d) => (d.properties.name === activeCountry ? 0.08 : 0.003)}
      /* حلقة توهّج المدينة */
      ringsData={ringsData}
      ringColor={() => "#ffdf33"}
      ringMaxRadius={(d) => d.maxR}
      ringPropagationSpeed={(d) => d.propagationSpeed}
      ringRepeatPeriod={(d) => d.repeatPeriod}
      /* إعدادات شكلية */
      atmosphereAltitude={0.18}
      atmosphereColor="#9cf"
      backgroundColor="rgba(0,0,0,0)"
      waitForGlobeReady
      animateIn
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
}
