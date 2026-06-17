/**
 * AppEmptyState Component
 * Estado vazio com ilustração e call-to-action
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { spacing, typography } from '../../theme';

interface AppEmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function AppEmptyState({
  icon = 'inbox-outline',
  title,
  description,
  actionLabel,
  onAction,
  style,
}: AppEmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Text
        variant="displaySmall"
        style={[styles.icon, { color: theme.colors.outline }]}
      >
        📭
      </Text>
      
      <Text
        variant="titleLarge"
        style={[styles.title, { color: theme.colors.onSurface }]}
      >
        {title}
      </Text>
      
      {description && (
        <Text
          variant="bodyMedium"
          style={[styles.description, { color: theme.colors.onSurfaceVariant }]}
        >
          {description}
        </Text>
      )}
      
      {actionLabel && onAction && (
        <Button
          mode="contained"
          onPress={onAction}
          style={styles.button}
        >
          {actionLabel}
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    marginTop: spacing.md,
  },
});
