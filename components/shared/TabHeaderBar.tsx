import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { getHeaderTitle } from "@react-navigation/elements";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";

export type TabHeaderBarProps = BottomTabHeaderProps;

const AnimatedView = Animated.createAnimatedComponent(View);

export default function TabHeaderBar({
  layout,
  navigation,
  route,
  options,
}: TabHeaderBarProps) {
  const title = getHeaderTitle(options, route.name);
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  return (
    <AnimatedView
      entering={FadeInUp}
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>
          {title}
        </Text>
      </View>
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
  },
});
