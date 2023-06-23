import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { getHeaderTitle } from "@react-navigation/elements";
import { Box, Center, HStack, Heading } from "native-base";
import Animated, { FadeInUp } from "react-native-reanimated";

export type TabHeaderBarProps = BottomTabHeaderProps;

const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function TabHeaderBar({
  layout,
  navigation,
  route,
  options,
}: TabHeaderBarProps) {
  const title = getHeaderTitle(options, route.name);
  return (
    <AnimatedBox entering={FadeInUp} safeArea p={3} bg="light.50">
      <Center>
        <Heading>{title}</Heading>
      </Center>
    </AnimatedBox>
  );
}
