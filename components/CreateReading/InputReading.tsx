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
  useToast,
} from "native-base";
import { useState } from "react";
import { useTranslation } from "react-i18next";

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
  const toast = useToast();
  const { t } = useTranslation();

  return (
    <Box flex={1}>
      {snapshot && (
        <Image
          bg="black"
          flex={1}
          source={snapshot}
          resizeMode="contain"
          w={"100%"}
          h={"100%"}
          alt="snapshot"
        />
      )}
      <Center p={3}>
        <Text mb={3}>
          {t(
            "createReading.pleaseInput",
            "Please input the current reading of the meter",
          )}
        </Text>
        <Input
          mb={5}
          size="2xl"
          keyboardType="numeric"
          placeholder={t(
            "createReading.enterReading",
            "Enter the reading here...",
          )}
          value={reading}
          onChangeText={(v) => setReading(v)}
        />
        <HStack space={3} alignItems={"center"}>
          <Button
            leftIcon={<Icon as={FontAwesome} name="arrow-left" />}
            colorScheme={"red"}
            size="lg"
            onPress={() => onReturn?.()}
          >
            {t("createReading.anotherPicture", "Take another picture")}
          </Button>
          <Button
            size="lg"
            onPress={() => {
              const numberValue = +reading;
              if (isNaN(numberValue)) {
                toast.show({
                  description: t(
                    "reading.invalidValue",
                    "This value is invalid, please input a number",
                  ),
                });
                return;
              }

              onConfirm?.(numberValue);
            }}
          >
            {t("confirm", "Confirm")}
          </Button>
        </HStack>
      </Center>
    </Box>
  );
}
