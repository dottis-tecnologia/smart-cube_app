import { View, ScrollView, Box } from "native-base";
import type { ColorType } from "native-base/lib/typescript/components/types";
import type { ReactNode } from "react";
import { ScrollViewProps } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

export type ParallaxScrollProps = ScrollViewProps & {
  headerHeight: number;
  header?: ReactNode | ReactNode[];
  bg?: ColorType;
};

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function ParallaxScroll({
  children,
  header,
  headerHeight,
  bg,
  ...props
}: ParallaxScrollProps) {
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const animatedStyles = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, headerHeight],
      [1, 1.5],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, headerHeight],
      [0, headerHeight * 0.5],
      Extrapolate.CLAMP
    );
    const opacity = interpolate(
      scrollY.value,
      [0, headerHeight],
      [1, 0],
      Extrapolate.CLAMP
    );

    return { transform: [{ translateY }, { scale }], opacity };
  });

  return (
    <AnimatedScrollView onScroll={scrollHandler} bg={bg} {...props}>
      <AnimatedBox
        style={[
          {
            height: headerHeight,
            overflow: "hidden",
          },
          animatedStyles,
        ]}
      >
        {header}
      </AnimatedBox>
      <View bg={bg || "white"}>{children}</View>
    </AnimatedScrollView>
  );
}
