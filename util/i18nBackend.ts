import { LanguageDetectorAsyncModule } from "i18next";
import AsyncStorage from "expo-sqlite/kv-store";

const key = "language";

const i18nBackend: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  async: true,
  detect: async function () {
    const storedLanguage = await AsyncStorage.getItemAsync(key);
    if (storedLanguage) {
      return storedLanguage;
    } else {
      return "en";
    }
  },
  cacheUserLanguage: async function (lng: string) {
    await AsyncStorage.setItemAsync(key, lng);
  },
};

export default i18nBackend;
