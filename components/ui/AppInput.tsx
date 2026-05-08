/**
 * AppInput Component
 * TextInput estilizado Material Design 3
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { TextInput, TextInputProps, HelperText, useTheme } from 'react-native-paper';
import { spacing } from '../../theme';

interface AppInputProps extends Omit<TextInputProps, 'mode' | 'ref' | 'error'> {
  label?: string;
  errorMessage?: string;
  helper?: string;
  mode?: 'flat' | 'outlined';
  containerStyle?: ViewStyle;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

export const AppInput = React.forwardRef<any, AppInputProps>(function AppInput({
  label,
  errorMessage,
  helper,
  mode = 'outlined',
  containerStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  style,
  ...rest
}, ref) {
  const theme = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        ref={ref as any}
        mode={mode}
        label={label}
        error={!!errorMessage}
        style={[styles.input, style]}
        outlineStyle={styles.outline}
        left={leftIcon ? <TextInput.Icon icon={leftIcon} /> : undefined}
        right={rightIcon ? <TextInput.Icon icon={rightIcon} onPress={onRightIconPress} /> : undefined}
        theme={{
          ...theme,
          colors: {
            ...theme.colors,
            primary: theme.colors.primary,
          },
        }}
        {...rest}
      />
      {(errorMessage || helper) && (
        <HelperText type={errorMessage ? 'error' : 'info'} visible={!!(errorMessage || helper)}>
          {errorMessage || helper}
        </HelperText>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: 'transparent',
  },
  outline: {
    borderRadius: 12,
  },
});
