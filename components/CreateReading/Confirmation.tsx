import { FontAwesome } from "@expo/vector-icons";
import { CameraCapturedPicture } from "expo-camera";
import { Box, Button, Center, HStack, Icon, Image, Text } from "native-base";

export type ConfirmationProps = {
  snapshot: CameraCapturedPicture;
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
  return (
    <Box flex={1}>
      <Image
        flex={1}
        source={snapshot}
        resizeMode="contain"
        bg="black"
        w={"100%"}
        h={"100%"}
        alt="snapshot"
      />
      <Center p={3}>
        <Text mb={5} fontSize={"4xl"}>
          {reading}
        </Text>
        <Text mb={3}>Do you confirm these values?</Text>
        <HStack space={3} alignItems={"center"}>
          <Button
            size="lg"
            leftIcon={<Icon as={FontAwesome} name="arrow-left" />}
            colorScheme={"red"}
            onPress={() => onReturn?.()}
          >
            Go back
          </Button>
          <Button size="lg" onPress={() => onConfirm?.()} colorScheme={"green"}>
            Confirm
          </Button>
        </HStack>
      </Center>
    </Box>
  );
}
