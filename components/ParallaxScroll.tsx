import React, { ComponentProps, useState, type ReactNode } from "react";
import { View, ScrollView } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useTheme } from "react-native-paper";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const AnimatedView = Animated.createAnimatedComponent(View);

export type ParallaxScrollProps = ComponentProps<typeof ScrollView> & {
  header?: ReactNode | ReactNode[];
  bg?: string;
};

export default function ParallaxScroll({
  children,
  header,
  bg = "#f5f5f5",
  ...props
}: ParallaxScrollProps) {
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });
  const [headerHeight, setHeaderHeight] = useState(0);
  const theme = useTheme();

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

    return { opacity, transform: [{ translateY }] };
  });

  const backgroundColor = bg === "light.100" || bg === "light.50" 
    ? "#f5f5f5" 
    : bg;

  return (
    <AnimatedScrollView
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      style={{ backgroundColor }}
      {...props}
    >
      <AnimatedView
        style={[animatedStyles, { backgroundColor }]}
        onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
      >
        {header}
      </AnimatedView>
      <View style={{ backgroundColor }}>{children}</View>
    </AnimatedScrollView>
  );
}
