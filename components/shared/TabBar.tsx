import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  View,
  Pressable,
  Text,
  StyleSheet,
} from "react-native";
import { ReactNode } from "react";

export type TabBarProps = BottomTabBarProps;

const ACTIVE_COLOR = '#FFFFFF';
const INACTIVE_COLOR = 'rgba(255,255,255,0.55)';
const BG_COLOR = '#5A9BD6';

export default function TabBar({
  descriptors,
  insets,
  navigation,
  state,
}: TabBarProps) {
  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
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
          navigation.emit({ type: "tabLongPress", target: route.key });
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
  icon?: (props: { color: string; focused: boolean; size: number }) => ReactNode;
  label: string;
  onPress?: () => void;
  onLongPress?: () => void;
  isActive?: boolean;
}) {
  const iconColor = isActive ? ACTIVE_COLOR : INACTIVE_COLOR;

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [styles.tabItem, { opacity: pressed ? 0.7 : 1 }]}
    >
      {/* Ícone com pill no ativo */}
      <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
        {icon ? icon({ color: iconColor, focused: isActive ?? false, size: 22 }) : null}
      </View>

      {/* Label */}
      <Text style={[styles.label, { color: iconColor, fontWeight: isActive ? '700' : '400' }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: BG_COLOR,
    borderTopWidth: 0,
    paddingTop: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 8,
  },
  iconWrap: {
    marginBottom: 2,
    paddingVertical: 4,
  },
  iconWrapActive: {},
  label: {
    fontSize: 10,
    letterSpacing: 0.2,
  },
});
