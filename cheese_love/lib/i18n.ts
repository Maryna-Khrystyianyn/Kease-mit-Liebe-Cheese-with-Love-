"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import deTranslation from "./locales/de/common.json";
import ukTranslation from "./locales/uk/common.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "de",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      de: { translation: deTranslation },
      uk: { translation: ukTranslation },
    },
  });

export default i18n;