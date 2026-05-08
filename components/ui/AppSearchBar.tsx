/**
 * AppSearchBar Component
 * Barra de busca estilizada Material Design 3
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';
import { spacing, borderRadius } from '../../theme';

interface AppSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  onClear?: () => void;
  style?: ViewStyle;
  autoFocus?: boolean;
}

export function AppSearchBar({
  value,
  onChangeText,
  placeholder = 'Buscar...',
  onSubmit,
  onClear,
  style,
  autoFocus = false,
}: AppSearchBarProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Searchbar
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        onIconPress={onSubmit}
        onClearIconPress={onClear}
        autoFocus={autoFocus}
        style={styles.searchbar}
        inputStyle={styles.input}
        iconColor={theme.colors.onSurfaceVariant}
        placeholderTextColor={theme.colors.onSurfaceVariant}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchbar: {
    borderRadius: borderRadius.lg,
    elevation: 0,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  input: {
    fontSize: 16,
  },
});
