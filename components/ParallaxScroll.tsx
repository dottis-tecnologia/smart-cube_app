import { View, ScrollView, Box } from "native-base";
import type { ColorType } from "native-base/lib/typescript/components/types";
import { ComponentProps, useState, type ReactNode } from "react";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const AnimatedBox = Animated.createAnimatedComponent(Box);

export type ParallaxScrollProps = ComponentProps<typeof ScrollView> & {
  header?: ReactNode | ReactNode[];
  bg?: ColorType;
};

export default function ParallaxScroll({
  children,
  header,
  bg = "light.100",
  ...props
}: ParallaxScrollProps) {
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });
  const [headerHeight, setHeaderHeight] = useState(0);

  const animatedStyles = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, headerHeight],
      [0, headerHeight * 0.9],
      Extrapolate.EXTEND
    );
    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight],
      [1, 0],
      Extrapolate.CLAMP
    );

    return { opacity, transform: [] };
  });

  return (
    <AnimatedScrollView onScroll={scrollHandler} bg={bg} {...props}>
      <AnimatedBox
        style={[animatedStyles]}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        {header}
      </AnimatedBox>
      <View bg={bg}>{children}</View>
    </AnimatedScrollView>
  );
}
