import { Button } from "native-base";
import { useTranslation } from "react-i18next";

export type ChangeLanguageButtonsProps = {};

const availableLanguages = {
  en: "En",
  fr: "Fr",
};

export default function ChangeLanguageButtons({}: ChangeLanguageButtonsProps) {
  const { i18n } = useTranslation();
  return (
    <Button.Group
      colorScheme={"primary"}
      isAttached
      size={"sm"}
      alignSelf={"flex-end"}
    >
      {Object.entries(availableLanguages).map(([key, value]) => (
        <Button
          key={key}
          onPress={() => i18n.changeLanguage(key)}
          variant={i18n.resolvedLanguage == key ? "solid" : "subtle"}
        >
          {value}
        </Button>
      ))}
    </Button.Group>
  );
}
