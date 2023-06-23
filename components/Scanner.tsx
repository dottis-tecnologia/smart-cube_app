import { Feather, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { Camera, CameraType, FlashMode, Point } from "expo-camera";
import {
  Center,
  Text,
  Spinner,
  Button,
  IconButton,
  HStack,
  Input,
  Icon,
  Box,
} from "native-base";
import { useState } from "react";
import { useWindowDimensions, StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  ZoomIn,
} from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";
import { Path, Rect, Svg } from "react-native-svg";
import ScanIcon from "../assets/qr-code-scan-icon.svg";

export type ScannerProps = {
  onBarCode?: (value: string) => void;
};

const AnimatedIconButton = Animated.createAnimatedComponent(IconButton);
const AnimatedCenter = Animated.createAnimatedComponent(Center);

export default function Scanner({ onBarCode }: ScannerProps) {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [flashlight, setFlashlight] = useState(false);
  const [frontCamera, setFrontCamera] = useState(false);
  const { width } = useWindowDimensions();
  const height = Math.round((width * 4) / 3);
  const isFocused = useIsFocused();

  if (!permission) {
    return (
      <AnimatedCenter
        width={width}
        height={width}
        entering={FadeIn}
        exiting={FadeOut}
        bg="black"
      >
        <Icon as={FontAwesome5} name="camera" size={24} color="light.800" />
      </AnimatedCenter>
    );
  }

  if (!permission.granted) {
    return (
      <AnimatedCenter
        width={width}
        height={width}
        entering={FadeIn}
        exiting={FadeOut}
        bg={"black"}
      >
        <Text color="white" mb={2}>
          We need permission to use your camera
        </Text>
        <Button onPress={requestPermission}>Grant permission</Button>
      </AnimatedCenter>
    );
  }

  return (
    <AnimatedCenter
      width={width}
      height={width}
      overflow={"hidden"}
      entering={FadeIn}
      exiting={FadeOut}
    >
      {isFocused ? (
        <Camera
          ratio="4:3"
          style={{
            height,
            width,
          }}
          type={frontCamera ? CameraType.front : CameraType.back}
          flashMode={flashlight ? FlashMode.torch : FlashMode.off}
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
          onBarCodeScanned={(e) => {
            if (e.data == null) return;
            onBarCode?.(e.data);
          }}
        >
          <Center flex={1}>
            <ScanIcon width={200} height={200} fill="white" opacity={0.2} />
          </Center>
        </Camera>
      ) : (
        <Center width={width} height={width} bg="black">
          <Icon as={FontAwesome5} name="camera" size={24} color="light.800" />
        </Center>
      )}
      <HStack alignSelf={"flex-end"} position={"absolute"} top={0} right={0}>
        <AnimatedIconButton
          colorScheme={"dark"}
          size="lg"
          onPress={() => setFlashlight((v) => !v)}
          _icon={{
            as: FontAwesome,
            name: "flash",
          }}
          entering={FadeInUp}
        />
        <AnimatedIconButton
          colorScheme={"dark"}
          size="lg"
          onPress={() => setFrontCamera((v) => !v)}
          _icon={{
            as: FontAwesome,
            name: "repeat",
          }}
          entering={FadeInUp.delay(100)}
        />
      </HStack>
    </AnimatedCenter>
  );
}
