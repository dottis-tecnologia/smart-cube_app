import { useTranslation } from "react-i18next";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export type ChangeLanguageButtonsProps = {};

const availableLanguages = {
  en: "En",
  fr: "Fr",
};

export default function ChangeLanguageButtons({}: ChangeLanguageButtonsProps) {
  const { i18n } = useTranslation();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {Object.entries(availableLanguages).map(([key, value], index) => {
        const isActive = i18n.resolvedLanguage === key;
        return (
          <TouchableOpacity
            key={key}
            onPress={() => i18n.changeLanguage(key)}
            style={[
              styles.button,
              {
                backgroundColor: isActive
                  ? theme.colors.primary
                  : theme.colors.surface,
                borderTopLeftRadius: index === 0 ? 4 : 0,
                borderBottomLeftRadius: index === 0 ? 4 : 0,
                borderTopRightRadius:
                  index === Object.keys(availableLanguages).length - 1
                    ? 4
                    : 0,
                borderBottomRightRadius:
                  index === Object.keys(availableLanguages).length - 1
                    ? 4
                    : 0,
                borderRightWidth:
                  index < Object.keys(availableLanguages).length - 1 ? 1 : 0,
                borderColor: theme.colors.outline,
              },
            ]}
          >
            <Text
              style={{
                color: isActive ? theme.colors.onPrimary : theme.colors.onSurface,
                fontSize: 12,
                fontWeight: "500",
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
