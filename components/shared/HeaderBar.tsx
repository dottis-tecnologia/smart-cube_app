import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { getHeaderTitle } from "@react-navigation/elements";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { colors } from "../../theme";

export type HeaderBarProps = NativeStackHeaderProps;

const AnimatedView = Animated.createAnimatedComponent(View);

export default function HeaderBar({
  navigation,
  route,
  options,
  back,
}: HeaderBarProps) {
  const title = getHeaderTitle(options, route.name);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]}>
      <AnimatedView entering={FadeInUp} style={styles.content}>
        {back && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <FontAwesome name="chevron-left" size={20} color={colors.onSurface} />
          </TouchableOpacity>
        )}
        <Text style={[styles.title, { color: colors.onSurface }]} numberOfLines={1}>
          {title}
        </Text>
      </AnimatedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    padding: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
  },
});
