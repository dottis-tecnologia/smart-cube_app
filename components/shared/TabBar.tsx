import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { HStack, Pressable, Text, VStack, useToken } from "native-base";
import { ReactNode } from "react";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export type TabBarProps = BottomTabBarProps;

export default function TabBar({
  descriptors,
  insets,
  navigation,
  state,
}: TabBarProps) {
  return (
    <Animated.View entering={FadeInDown}>
      <HStack
        bg="primary.400"
        py={2}
        px={2}
        space={3}
        borderBottomWidth={1}
        borderBottomColor={"primary.600"}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? options.title ?? route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate({ name: route.name, merge: true } as any);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TabBarEntry
              key={index}
              icon={options.tabBarIcon}
              label={typeof label === "string" ? label : ""}
              isActive={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
            />
          );
        })}
      </HStack>
    </Animated.View>
  );
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function TabBarEntry({
  icon,
  label,
  onPress,
  onLongPress,
  isActive,
}: {
  icon?: (props: {
    color: string;
    focused: boolean;
    size: number;
  }) => ReactNode;
  label: string;
  onPress?: () => void;
  onLongPress?: () => void;
  isActive?: boolean;
}) {
  const white = useToken("colors", "white");
  const style = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isActive ? 1 : 0.8),
      transform: [{ translateY: withSpring(isActive ? -2 : 0) }],
    };
  }, [isActive]);

  return (
    <AnimatedPressable
      onPress={onPress}
      onLongPress={onLongPress}
      flex={1}
      style={style}
      entering={FadeInUp.delay(250).randomDelay()}
    >
      {({ isPressed }) => {
        const innerStyle = useAnimatedStyle(() => {
          return {
            opacity: withTiming(isPressed ? 0.6 : 1),
            transform: [{ scale: withSpring(isPressed ? 0.95 : 1) }],
          };
        }, [isPressed]);

        return (
          <Animated.View style={innerStyle}>
            <VStack alignItems={"center"} space={0}>
              {icon
                ? icon({ color: white, focused: isActive ?? false, size: 6 })
                : null}
              <Text fontSize="xs" color="white">
                {label.toUpperCase()}
              </Text>
            </VStack>
          </Animated.View>
        );
      }}
    </AnimatedPressable>
  );
}
