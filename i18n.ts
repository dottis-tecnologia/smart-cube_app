import "intl-pluralrules";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./extractedTranslations/en/translation.json";
import fr from "./extractedTranslations/fr/translation.json";

i18n.use(initReactI18next).init({
  debug: true,
  fallbackLng: "en",
  resources: {
    en: { translation: en },
    fr: { translation: fr },
  },
});
