import { LanguageDetectorAsyncModule } from "i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const key = "language";

const i18nBackend: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  async: true,
  detect: async function () {
    const storedLanguage = await AsyncStorage.getItem(key);
    if (storedLanguage) {
      return storedLanguage;
    } else {
      return "en";
    }
  },
  cacheUserLanguage: async function (lng) {
    await AsyncStorage.setItem(key, lng);
  },
};

export default i18nBackend;
