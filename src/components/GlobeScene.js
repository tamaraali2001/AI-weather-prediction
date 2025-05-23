// src/components/GlobeScene.js
import React, { useRef, useEffect, useState, useMemo } from "react";
import Globe from "react-globe.gl";
import { feature } from "topojson-client";
import * as d3 from "d3-geo";
import cityCoords from "../assets/city_coords.json";

const normalize = (s) => s.toLowerCase().replace(/\s+/g, "");

/* ثوابت ارتفاع الـ Navbar والفوتر (عدّلها إن تغيّر التصميم) */
const NAV_HEIGHT     = 64;   // px
const FOOTER_HEIGHT  = 110;  // px
const V_PADDING      = NAV_HEIGHT + FOOTER_HEIGHT; // 174px

export default function GlobeScene({
  activeCountry,
  activeCity,
  initialView = { lat: 20, lng: 45, alt: 2 }
}) {
  const globeRef = useRef();
  const [countries, setCountries] = useState([]);

  /* تحميل مضلّعات العالم */
  useEffect(() => {
    fetch("https://unpkg.com/world-atlas@2.0.2/countries-110m.json")
      .then((r) => r.json())
      .then((topology) =>
        setCountries(feature(topology, topology.objects.countries).features)
      );
  }, []);

  /* وضع الكاميرا الابتدائية */
  useEffect(() => {
    globeRef.current?.pointOfView(
      { lat: initialView.lat, lng: initialView.lng, altitude: initialView.alt },
      0
    );
  }, [initialView]);

  /* إيجاد إحداثيات المدينة */
  const findCoords = (city) => {
    if (cityCoords[city]) return cityCoords[city];
    const key = Object.keys(cityCoords).find((k) =>
      k.toLowerCase().endsWith("_" + city.toLowerCase())
    );
    return key ? cityCoords[key] : null;
  };

  /* تحريك الكاميرا عند اختيار مدينة أو دولة */
  useEffect(() => {
    if (!countries.length) return;

    if (activeCity) {
      const coords = findCoords(activeCity);
      if (coords) {
        const [lat, lng] = coords;
        globeRef.current.pointOfView({ lat, lng, altitude: 1.3 }, 2000);
        return;
      }
    }

    if (activeCountry) {
      const f = countries.find((c) =>
        normalize(c.properties.name).includes(normalize(activeCountry))
      );
      if (f) {
        const [lng, lat] = d3.geoCentroid(f);
        globeRef.current.pointOfView({ lat, lng, altitude: 1.5 }, 2000);
      }
    }
  }, [activeCountry, activeCity, countries]);

  /* بيانات حلقة المدينة */
  const ringsData = useMemo(() => {
    if (activeCity) {
      const coords = findCoords(activeCity);
      if (coords) {
        const [lat, lng] = coords;
        return [
          { lat, lng, maxR: 0.6, propagationSpeed: 2, repeatPeriod: 1800 }
        ];
      }
    }
    return [];
  }, [activeCity]);

  /* أبعاد آمنة */
  const safeWidth  = window.innerWidth  * 0.5;                 // 50% من العرض
  const safeHeight = window.innerHeight - V_PADDING;           // 100vh - Navbar - Footer

  return (
    <div
      dir="ltr"
      style={{
        position: "fixed",
        top: `${NAV_HEIGHT}px`,         // يبدأ تحت الـ Navbar
        right: 0,
        left: "auto",
        width: "50vw",                 // يشغل نصف الشاشة أفقياً
        height: `calc(100vh - ${V_PADDING}px)`, // لا يتجاوز الفوتر
        zIndex: 0,
        pointerEvents: "none"
      }}
    >
      <Globe
        ref={globeRef}
        width={safeWidth}
        height={safeHeight}
        /* تمييز الدولة المختارة */
        polygonsData={countries}
        polygonCapColor={(d) =>
          normalize(d.properties.name).includes(normalize(activeCountry))
            ? "rgba(255,165,0,0.55)"
            : "rgba(0,150,255,0.35)"
        }
        polygonSideColor={() => "rgba(0,150,255,0.15)"}
        polygonStrokeColor={(d) =>
          normalize(d.properties.name).includes(normalize(activeCountry))
            ? "#ffa500"
            : "#0096ff"
        }
        polygonAltitude={(d) =>
          normalize(d.properties.name).includes(normalize(activeCountry))
            ? 0.08
            : 0.003
        }
        /* الحلقة المتوهّجة للمدينة */
        ringsData={ringsData}
        ringColor={() => "#ffdf33"}
        ringMaxRadius={(d) => d.maxR}
        ringPropagationSpeed={(d) => d.propagationSpeed}
        ringRepeatPeriod={(d) => d.repeatPeriod}
        /* إعدادات إضافية */
        atmosphereAltitude={0.18}
        atmosphereColor="#9cf"
        backgroundColor="rgba(0,0,0,0)"
        waitForGlobeReady
        animateIn
      />
    </div>
  );
}
