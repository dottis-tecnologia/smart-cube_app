import { Feather, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import {
  Camera as BaseCamera,
  CameraProps,
  CameraType,
  FlashMode,
  Point,
} from "expo-camera";
import { Center, Text, Button, IconButton, HStack, Icon } from "native-base";
import { forwardRef, useState } from "react";
import { useWindowDimensions, StyleSheet } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import Animated, { FadeIn, FadeInUp, FadeOut } from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";

const AnimatedIconButton = Animated.createAnimatedComponent(IconButton);
const AnimatedCenter = Animated.createAnimatedComponent(Center);

const Camera = forwardRef<BaseCamera, CameraProps>((props, ref) => {
  const [permission, requestPermission] = BaseCamera.useCameraPermissions();
  const [flashlight, setFlashlight] = useState(false);
  const [frontCamera, setFrontCamera] = useState(false);
  const { width } = useWindowDimensions();
  const height = Math.round((width * 4) / 3);
  const isFocused = useIsFocused();

  if (!permission) {
    return (
      <AnimatedCenter flex={1} entering={FadeIn} exiting={FadeOut} bg="black">
        <Icon as={FontAwesome5} name="camera" size={24} color="light.800" />
      </AnimatedCenter>
    );
  }

  if (!permission.granted) {
    return (
      <AnimatedCenter flex={1} entering={FadeIn} exiting={FadeOut} bg={"black"}>
        <Text color="white" mb={2}>
          We need permission to use your camera
        </Text>
        <Button onPress={requestPermission}>Grant permission</Button>
      </AnimatedCenter>
    );
  }

  return (
    <AnimatedCenter
      overflow={"hidden"}
      entering={FadeIn}
      exiting={FadeOut}
      flex={1}
      bg="black"
    >
      {isFocused ? (
        <BaseCamera
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
          ref={ref}
          {...props}
        ></BaseCamera>
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
});

export default Camera;
