import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { TextInput, View, TouchableOpacity, TextInputProps, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

export type PasswordFieldProps = TextInputProps;

export default function PasswordField({ style, ...props }: PasswordFieldProps) {
  const [isShown, setIsShown] = useState(false);
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }] }>
      <TextInput
        {...props}
        secureTextEntry={!isShown}
        autoCapitalize="none"
        style={[styles.input, { color: theme.colors.onSurface }, style]}
        placeholderTextColor={theme.colors.onSurfaceVariant}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsShown((v) => !v)}
      >
        <FontAwesome
          name={isShown ? "eye-slash" : "eye"}
          size={20}
          color={theme.colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
  },
  button: {
    padding: 8,
  },
});
