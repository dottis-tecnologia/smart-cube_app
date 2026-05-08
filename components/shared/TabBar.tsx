import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { ReactNode } from "react";
import { useTheme } from "react-native-paper";

export type TabBarProps = BottomTabBarProps;

export default function TabBar({
  descriptors,
  insets,
  navigation,
  state,
}: TabBarProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.primary,
          paddingBottom: insets.bottom,
        },
      ]}
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
    </View>
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
  const theme = useTheme();
  const white = theme.colors.onPrimary;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.tabItem,
        {
          opacity: isActive ? 1 : 0.5,
          transform: [{ scale: pressed ? 0.9 : 1 }],
        },
      ]}
    >
      <View style={styles.tabContent}>
        {icon ? icon({ color: white, focused: isActive ?? false, size: 24 }) : null}
        <Text style={[styles.label, { color: white }]}>{label.toUpperCase()}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
