/**
 * AppCard Component
 * Card estilizado com elevação Material Design 3
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { spacing } from '../../theme';

interface AppCardProps {
  children: ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
  mode?: 'elevated' | 'outlined' | 'contained';
}

export function AppCard({ 
  children, 
  style, 
  onPress, 
  disabled = false,
  mode = 'elevated'
}: AppCardProps) {
  const theme = useTheme();

  return (
    <Card
      mode={mode}
      onPress={onPress}
      disabled={disabled || !onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface,
        },
        style,
      ]}
    >
      {children}
    </Card>
  );
}

interface AppCardHeaderProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function AppCardHeader({ children, style }: AppCardHeaderProps) {
  return (
    <View style={[styles.header, style]}>
      {children}
    </View>
  );
}

interface AppCardContentProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function AppCardContent({ children, style }: AppCardContentProps) {
  return (
    <Card.Content style={[styles.content, style]}>
      {children}
    </Card.Content>
  );
}

interface AppCardFooterProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function AppCardFooter({ children, style }: AppCardFooterProps) {
  return (
    <Card.Actions style={[styles.footer, style]}>
      {children}
    </Card.Actions>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 12,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.sm,
    justifyContent: 'flex-end',
  },
});
