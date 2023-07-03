import { FontAwesome } from "@expo/vector-icons";
import { CameraCapturedPicture } from "expo-camera";
import {
  AspectRatio,
  Box,
  Button,
  Center,
  HStack,
  Icon,
  Image,
  Input,
  Text,
} from "native-base";
import { useState } from "react";

export type InputReadingProps = {
  snapshot: CameraCapturedPicture;
  onReturn?: () => void;
  onConfirm?: (value: number) => void;
};

export default function InputReading({
  snapshot,
  onConfirm,
  onReturn,
}: InputReadingProps) {
  const [reading, setReading] = useState(0);

  return (
    <Box flex={1}>
      <Image
        bg="black"
        flex={1}
        source={snapshot}
        resizeMode="contain"
        w={"100%"}
        h={"100%"}
        alt="snapshot"
      />
      <Center p={3}>
        <Text mb={3}>Please input the current reading of the meter</Text>
        <Input
          mb={5}
          size="2xl"
          keyboardType="numeric"
          placeholder="Enter the reading here..."
          onChangeText={(v) => setReading(+v)}
        />
        <HStack space={3} alignItems={"center"}>
          <Button
            leftIcon={<Icon as={FontAwesome} name="arrow-left" />}
            colorScheme={"red"}
            size="lg"
            onPress={() => onReturn?.()}
          >
            Take another picture
          </Button>
          <Button size="lg" onPress={() => onConfirm?.(reading)}>
            Confirm
          </Button>
        </HStack>
      </Center>
    </Box>
  );
}
