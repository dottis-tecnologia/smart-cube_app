import { FontAwesome } from "@expo/vector-icons";
import { CameraCapturedPicture } from "expo-camera";
import { Box, Button, Center, HStack, Icon, Image, Text } from "native-base";
import { useTranslation } from "react-i18next";

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

  return (
    <Box flex={1}>
      {snapshot && (
        <Image
          flex={1}
          source={snapshot}
          resizeMode="contain"
          bg="black"
          w={"100%"}
          h={"100%"}
          alt="snapshot"
        />
      )}
      <Center p={3}>
        <Text mb={5} fontSize={"4xl"}>
          {reading}
        </Text>
        <Text mb={3}>
          {t("createReading.doYouConfirm", "Do you confirm these values?")}
        </Text>
        <HStack space={3} alignItems={"center"}>
          <Button
            size="lg"
            leftIcon={<Icon as={FontAwesome} name="arrow-left" />}
            colorScheme={"red"}
            onPress={() => onReturn?.()}
          >
            {t("back", "Go back")}
          </Button>
          <Button size="lg" onPress={() => onConfirm?.()} colorScheme={"green"}>
            {t("confirm", "Confirm")}
          </Button>
        </HStack>
      </Center>
    </Box>
  );
}
