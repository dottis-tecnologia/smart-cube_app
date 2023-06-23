import React, { useRef, useState } from "react";
import Scanner from "../../components/Scanner";
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
      {isFocused ? null : (
        <Scanner onBarCode={(code) => navigation.push("Meter", { id: code })} />
      )}
      <VStack
        space={2}
        p={3}
        alignItems={"center"}
        flex={1}
        justifyContent={"center"}
      >
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
