// i18n.ts

import i18n from 'i18next';
import detector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import enLang from './locale/en.json';
import ruLang from './locale/ru.json';

i18n
.use(detector)
.use(initReactI18next).init({
  resources: {
    en: enLang,
    ru: ruLang,
  },
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  }
});