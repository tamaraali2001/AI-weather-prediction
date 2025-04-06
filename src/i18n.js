// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// استيراد ملفات الترجمة
import translationEN from './locales/en/translation.json';
import translationAR from './locales/ar/translation.json';

const resources = {
  en: {
    translation: translationEN,
  },
  ar: {
    translation: translationAR,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',             // اللغة الافتراضية
    fallbackLng: 'en',     // في حال عدم توفر ترجمة 
    interpolation: {
      escapeValue: false,  // react موجودة بالفعل
    },
  });

export default i18n;
