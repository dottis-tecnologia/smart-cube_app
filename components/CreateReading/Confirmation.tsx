import { FontAwesome } from "@expo/vector-icons";
import { CameraCapturedPicture } from "expo-camera";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from "react-native";
import { useTheme } from "react-native-paper";

export type ConfirmationProps = {
  snapshot: CameraCapturedPicture | null;
  reading: number;
  onReturn?: () => void;
  onConfirm?: () => void;
};

export default function Confirmation({
  snapshot,
  reading,
  onConfirm,
  onReturn,
}: ConfirmationProps) {
  const { t } = useTranslation();
  const theme = useTheme();

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
        <Text style={[styles.readingValue, { color: theme.colors.onSurface }]}>
          {reading}
        </Text>
        <Text style={[styles.message, { color: theme.colors.onSurfaceVariant }]}>
          {t("createReading.doYouConfirm", "Do you confirm these values?")}
        </Text>
        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.button, styles.backButton, { backgroundColor: theme.colors.errorContainer }]}
            onPress={() => onReturn?.()}
          >
            <FontAwesome name="arrow-left" size={16} color={theme.colors.onErrorContainer} style={styles.icon} />
            <Text style={[styles.buttonText, { color: theme.colors.onErrorContainer }]}>
              {t("back", "Go back")}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.confirmButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => onConfirm?.()}
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
    alignItems: "center",
    gap: 16,
  },
  readingValue: {
    fontSize: 32,
    fontWeight: "bold",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    width: "100%",
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
  backButton: {
    flex: 1,
  },
  confirmButton: {
    flex: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  icon: {
    marginRight: 8,
  },
});
