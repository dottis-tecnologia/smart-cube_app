/**
 * AppCard Component
 * Card estilizado com elevação Material Design 3
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { colors, spacing } from '../../theme';

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
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.card,
          { opacity: pressed ? 0.85 : 1 },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
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
    <View style={[styles.content, style]}>
      {children}
    </View>
  );
}

interface AppCardFooterProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function AppCardFooter({ children, style }: AppCardFooterProps) {
  return (
    <View style={[styles.footer, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 12,
    backgroundColor: colors.surface,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
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
