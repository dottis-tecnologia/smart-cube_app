import { CameraView, CameraCapturedPicture } from "expo-camera";
import { useRef, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import Camera from "../Camera";
import { FontAwesome5 } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";

export type SnapProps = {
  onSnapshot?: (picture: CameraCapturedPicture) => void;
  onSkip?: () => void;
};

export default function Snap({ onSnapshot, onSkip }: SnapProps) {
  const [isReady, setIsReady] = useState(false);
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();

  const cameraRef = useRef<CameraView>(null);

  return (
    <View style={styles.container}>
      <Camera ref={cameraRef} onCameraReady={() => setIsReady(true)} />
      <View style={styles.content}>
        <Text style={[styles.text, { color: theme.colors.onSurfaceVariant }]}>
          {t("createReading.pointCamera")}
        </Text>
        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.button, styles.skipButton, { backgroundColor: theme.colors.surfaceVariant }]}
            onPress={() => onSkip?.()}
          >
            <Text style={[styles.buttonText, { color: theme.colors.onSurfaceVariant }]}>
              {t("skip")}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.cameraButton, { backgroundColor: theme.colors.primary }]}
            disabled={!isReady || isTakingPicture}
            onPress={async () => {
              if (cameraRef.current == null) return;

              setIsTakingPicture(true);
              const picture = await cameraRef.current.takePictureAsync();
              setIsTakingPicture(false);
              if (picture) onSnapshot?.(picture);
            }}
          >
            {(!isReady || isTakingPicture) ? (
              <ActivityIndicator size="small" color={theme.colors.onPrimary} />
            ) : (
              <>
                <FontAwesome5 name="camera" size={16} color={theme.colors.onPrimary} style={styles.icon} />
                <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>
                  {t("createReading.takeSnap")}
                </Text>
              </>
            )}
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
  content: {
    padding: 20,
  },
  text: {
    textAlign: "center",
    marginBottom: 12,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cameraButton: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  icon: {
    marginRight: 8,
  },
});
