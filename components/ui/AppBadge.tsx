/**
 * AppBadge Component
 * Badges para status e contadores
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Badge as PaperBadge, useTheme } from 'react-native-paper';
import { spacing, borderRadius } from '../../theme';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'small' | 'medium' | 'large';

interface AppBadgeProps {
  content?: string | number;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  style?: ViewStyle;
}

export function AppBadge({
  content,
  variant = 'default',
  size = 'medium',
  dot = false,
  style,
}: AppBadgeProps) {
  const theme = useTheme();

  // Cores por variante
  const variantColors = {
    default: {
      background: theme.colors.primaryContainer,
      text: theme.colors.onPrimaryContainer,
    },
    primary: {
      background: theme.colors.primary,
      text: theme.colors.onPrimary,
    },
    success: {
      background: '#2E7D32',
      text: '#FFFFFF',
    },
    warning: {
      background: '#ED6C02',
      text: '#FFFFFF',
    },
    error: {
      background: '#D32F2F',
      text: '#FFFFFF',
    },
    info: {
      background: '#0288D1',
      text: '#FFFFFF',
    },
  };

  // Tamanhos
  const sizeStyles = {
    small: {
      height: 16,
      minWidth: 16,
      fontSize: 10,
      paddingHorizontal: 4,
    },
    medium: {
      height: 20,
      minWidth: 20,
      fontSize: 12,
      paddingHorizontal: 6,
    },
    large: {
      height: 24,
      minWidth: 24,
      fontSize: 14,
      paddingHorizontal: 8,
    },
  };

  const colors = variantColors[variant];
  const dimensions = sizeStyles[size];

  if (dot) {
    return (
      <View
        style={[
          styles.dot,
          {
            backgroundColor: colors.background,
            width: dimensions.height / 2,
            height: dimensions.height / 2,
          },
          style,
        ]}
      />
    );
  }

  // Se tiver apenas número pequeno, usar Paper Badge
  if (typeof content === 'number' && content > 0 && !dot) {
    return (
      <PaperBadge
        style={[style]}
        size={size === 'small' ? 10 : size === 'large' ? 14 : 12}
      >
        {content > 99 ? '99+' : content}
      </PaperBadge>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          height: dimensions.height,
          minWidth: dimensions.minWidth,
          paddingHorizontal: dimensions.paddingHorizontal,
          borderRadius: borderRadius.full,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: colors.text, fontSize: dimensions.fontSize }]}>
        {content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '500',
  },
  dot: {
    borderRadius: borderRadius.full,
  },
});
