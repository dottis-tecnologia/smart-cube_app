import "intl-pluralrules";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import fr from "./locales/fr/translation.json";
import i18nBackend from "./util/i18nBackend";

i18n
  .use(initReactI18next)
  .use(i18nBackend)
  .init({
    debug: true,
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
  });
