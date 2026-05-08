import { Feather, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { CameraView, useCameraPermissions, CameraViewProps } from "expo-camera";
import { forwardRef, useState } from "react";
import { useWindowDimensions, StyleSheet, View, Text, Pressable } from "react-native";
import Animated, { FadeIn, FadeInUp, FadeOut } from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedView = Animated.createAnimatedComponent(View);

const Camera = forwardRef<CameraView, CameraViewProps>((props, ref) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [flashlight, setFlashlight] = useState(false);
  const [frontCamera, setFrontCamera] = useState(false);
  const { width } = useWindowDimensions();
  const height = Math.round((width * 4) / 3);
  const isFocused = useIsFocused();

  if (!permission) {
    return (
      <AnimatedView style={[styles.center, styles.black]} entering={FadeIn} exiting={FadeOut}>
        <FontAwesome5 name="camera" size={24} color="#666" />
      </AnimatedView>
    );
  }

  if (!permission.granted) {
    return (
      <AnimatedView style={[styles.center, styles.black]} entering={FadeIn} exiting={FadeOut}>
        <Text style={styles.whiteText}>We need permission to use your camera</Text>
        <Pressable onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant permission</Text>
        </Pressable>
      </AnimatedView>
    );
  }

  return (
    <AnimatedView
      style={[styles.container, styles.black]}
      entering={FadeIn}
      exiting={FadeOut}
    >
      {isFocused ? (
        <CameraView
          style={{
            height,
            width,
          }}
          facing={frontCamera ? 'front' : 'back'}
          enableTorch={flashlight}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          ref={ref}
          {...props}
        />
      ) : (
        <View style={[styles.cameraPlaceholder, { width, height: width }]}>
          <FontAwesome5 name="camera" size={24} color="#666" />
        </View>
      )}
      <View style={styles.controls}>
        <AnimatedPressable
          style={styles.iconButton}
          onPress={() => setFlashlight((v) => !v)}
          entering={FadeInUp}
        >
          <FontAwesome name="flash" size={24} color="white" />
        </AnimatedPressable>
        <AnimatedPressable
          style={styles.iconButton}
          onPress={() => setFrontCamera((v) => !v)}
          entering={FadeInUp.delay(100)}
        >
          <FontAwesome name="repeat" size={24} color="white" />
        </AnimatedPressable>
      </View>
    </AnimatedView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  black: {
    backgroundColor: 'black',
  },
  whiteText: {
    color: 'white',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
  },
  cameraPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  controls: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
});

export default Camera;
