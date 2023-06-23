import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { getHeaderTitle } from "@react-navigation/elements";
import { Box, Center, HStack, Heading, IconButton } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";

export type HeaderBarProps = NativeStackHeaderProps;

const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function HeaderBar({
  navigation,
  route,
  options,
  back,
}: HeaderBarProps) {
  const title = getHeaderTitle(options, route.name);

  return (
    <AnimatedBox entering={FadeInUp} safeArea p={3} bg="light.50">
      <Center>
        {back && (
          <AnimatedBox
            entering={FadeInUp.delay(200)}
            position={"absolute"}
            left={0}
          >
            <IconButton
              colorScheme={"secondary"}
              variant="ghost"
              _icon={{ as: FontAwesome, name: "chevron-left" }}
              onPress={() => navigation.goBack()}
            />
          </AnimatedBox>
        )}
        <Heading>{title}</Heading>
      </Center>
    </AnimatedBox>
  );
}
