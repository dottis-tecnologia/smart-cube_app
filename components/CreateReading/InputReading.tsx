import { FontAwesome } from "@expo/vector-icons";
import { CameraCapturedPicture } from "expo-camera";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  StyleSheet,
  Alert,
} from "react-native";
import { useTheme } from "react-native-paper";

export type InputReadingProps = {
  snapshot: CameraCapturedPicture | null;
  onReturn?: () => void;
  onConfirm?: (value: number) => void;
};

export default function InputReading({
  snapshot,
  onConfirm,
  onReturn,
}: InputReadingProps) {
  const [reading, setReading] = useState("");
  const { t } = useTranslation();
  const theme = useTheme();

  const handleConfirm = () => {
    const numberValue = +reading;
    if (isNaN(numberValue)) {
      Alert.alert(
        t("error", "Error"),
        t(
          "reading.invalidValue",
          "This value is invalid, please input a number",
        )
      );
      return;
    }
    onConfirm?.(numberValue);
  };

  return (
    <View style={styles.container}>
      {snapshot && (
        <Image
          source={{ uri: snapshot.uri }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
      <View style={styles.content}>
        <Text style={[styles.label, { color: theme.colors.onSurface }]}>
          {t(
            "createReading.pleaseInput",
            "Please input the current reading of the meter",
          )}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.surface,
              color: theme.colors.onSurface,
              borderColor: theme.colors.outline,
            },
          ]}
          keyboardType="numeric"
          placeholder={t(
            "createReading.enterReading",
            "Enter the reading here...",
          )}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          value={reading}
          onChangeText={setReading}
        />
        <View style={styles.buttonRow}>
          <Pressable
            style={[
              styles.button,
              styles.secondaryButton,
              { backgroundColor: theme.colors.errorContainer },
            ]}
            onPress={() => onReturn?.()}
          >
            <FontAwesome name="arrow-left" size={16} color={theme.colors.onErrorContainer} style={styles.icon} />
            <Text style={[styles.buttonText, { color: theme.colors.onErrorContainer }]}>
              {t("createReading.anotherPicture", "Take another picture")}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={handleConfirm}
          >
            <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>
              {t("confirm", "Confirm")}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    backgroundColor: "black",
    width: "100%",
  },
  content: {
    padding: 16,
    gap: 16,
  },
  label: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 20,
    textAlign: "center",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
  },
  secondaryButton: {
    flex: 1.2,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  icon: {
    marginRight: 8,
  },
});
