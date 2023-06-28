import React, { useRef, useState } from "react";
import Scanner from "../../components/Camera";
import {
  Box,
  Button,
  Center,
  HStack,
  Icon,
  IconButton,
  Input,
  Text,
  VStack,
} from "native-base";
import { CompositeScreenProps, useIsFocused } from "@react-navigation/native";
import { TabParamList } from "./Tabs";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import FocusAwareStatusBar from "../../components/util/FocusAwareStatusBar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Root";
import { FontAwesome } from "@expo/vector-icons";
import { TextInput } from "react-native";
import Animated, { FadeInLeft } from "react-native-reanimated";
import ScanIcon from "../../assets/qr-code-scan-icon.svg";

export type ReadCodeProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "ReadCode">,
  NativeStackScreenProps<RootStackParamList>
>;

const AnimatedButton = Animated.createAnimatedComponent(Button);
const AnimatedText = Animated.createAnimatedComponent(Text);
const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function ReadCode({ navigation }: ReadCodeProps) {
  const [isFocused, setFocus] = useState(false);
  const [id, setId] = useState("");
  const inputRef = useRef<TextInput>(null);

  return (
    <Box flex={1}>
      <FocusAwareStatusBar style="dark" />
      <Scanner
        onBarCodeScanned={(e) => {
          if (e.data == null) return;

          navigation.push("Meter", { id: e.data });
        }}
      >
        <Center flex={1}>
          <ScanIcon width={200} height={200} fill="white" opacity={0.2} />
        </Center>
      </Scanner>
      <VStack space={2} p={5} alignItems={"center"} justifyContent={"center"}>
        <AnimatedText entering={FadeInLeft.delay(100)} color={"dark.400"}>
          Point your camera to the QR Code attached to the meter
        </AnimatedText>
        <AnimatedText entering={FadeInLeft.delay(200)} color={"dark.400"}>
          OR
        </AnimatedText>
        <AnimatedText entering={FadeInLeft.delay(300)} color={"dark.400"}>
          Enter the ID manually below
        </AnimatedText>
        <HStack>
          {isFocused && (
            <IconButton
              _icon={{ as: FontAwesome, name: "arrow-left" }}
              onPress={() => {
                setFocus(false);
                setId("");
                inputRef.current?.blur();
              }}
            />
          )}
          <AnimatedBox entering={FadeInLeft.delay(500)} flex={1}>
            <Input
              size="lg"
              bg="white"
              placeholder="Meter ID..."
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              ref={inputRef}
              autoCapitalize="characters"
              onChangeText={(v) => setId(v.toUpperCase())}
              value={id}
            />
          </AnimatedBox>
        </HStack>
        {isFocused && id && (
          <AnimatedButton
            entering={FadeInLeft}
            size="lg"
            onPress={() => {
              setId("");
              navigation.push("Meter", { id });
            }}
          >
            Confirm
          </AnimatedButton>
        )}
      </VStack>
    </Box>
  );
}
