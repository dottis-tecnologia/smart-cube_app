import { enUS, fr } from "date-fns/locale";

const dateFnsLocale = (locale: string | undefined) => {
  switch (locale) {
    case "en":
      return enUS;
    case "fr":
      return fr;
    default:
      return enUS;
  }
};

export default dateFnsLocale;
