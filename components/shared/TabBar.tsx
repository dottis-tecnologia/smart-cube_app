import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { HStack, Pressable, Text, VStack, useToken } from "native-base";
import { ReactNode } from "react";

export type TabBarProps = BottomTabBarProps;

export default function TabBar({
  descriptors,
  insets,
  navigation,
  state,
}: TabBarProps) {
  return (
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
  );
}

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

  return (
    <Pressable onPress={onPress} onLongPress={onLongPress} flex={1}>
      {({ isPressed }) => {
        return (
          <VStack
            alignItems={"center"}
            space={0}
            opacity={isActive ? 1 : 0.5}
            style={{ transform: [{ scale: isPressed ? 0.9 : 1 }] }}
          >
            {icon
              ? icon({ color: white, focused: isActive ?? false, size: 6 })
              : null}
            <Text fontSize="xs" color="white">
              {label.toUpperCase()}
            </Text>
          </VStack>
        );
      }}
    </Pressable>
  );
}
