import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { getHeaderTitle } from "@react-navigation/elements";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { colors } from "../../theme";

export type TabHeaderBarProps = BottomTabHeaderProps;

const AnimatedView = Animated.createAnimatedComponent(View);

export default function TabHeaderBar({
  layout,
  navigation,
  route,
  options,
}: TabHeaderBarProps) {
  const title = getHeaderTitle(options, route.name);

  return (
    <SafeAreaView style={{ backgroundColor: colors.surface }}>
      <AnimatedView
        entering={FadeInUp}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.onSurface }]}>
            {title}
          </Text>
        </View>
      </AnimatedView>
    </SafeAreaView>
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
