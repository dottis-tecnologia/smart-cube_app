import { useTranslation } from "react-i18next";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { colors } from "../theme";

export type ChangeLanguageButtonsProps = {};

const availableLanguages = {
  en: "En",
  fr: "Fr",
};

export default function ChangeLanguageButtons({}: ChangeLanguageButtonsProps) {
  const { i18n } = useTranslation();

  return (
    <View style={styles.container}>
      {Object.entries(availableLanguages).map(([key, value], index) => {
        const isActive = i18n.resolvedLanguage === key;
        const isFirst = index === 0;
        const isLast = index === Object.keys(availableLanguages).length - 1;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => i18n.changeLanguage(key)}
            style={[
              styles.button,
              {
                backgroundColor: isActive ? '#fff' : '#1A3A5C',
                borderTopLeftRadius: isFirst ? 8 : 0,
                borderBottomLeftRadius: isFirst ? 8 : 0,
                borderTopRightRadius: isLast ? 8 : 0,
                borderBottomRightRadius: isLast ? 8 : 0,
                borderWidth: 1,
                borderRightWidth: !isLast ? 0 : 1,
                borderColor: '#fff',
              },
            ]}
          >
            <Text
              style={{
                color: isActive ? '#1A3A5C' : '#fff',
                fontSize: 12,
                fontWeight: isActive ? '700' : '600',
              }}
            >
              {value}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "flex-end",
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
