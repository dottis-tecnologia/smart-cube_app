/**
 * AppDivider Component
 * Divisor horizontal estilizado
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import { spacing } from '../../theme';

interface AppDividerProps {
  inset?: boolean;
  insetType?: 'left' | 'right' | 'both';
  style?: ViewStyle;
  bold?: boolean;
}

export function AppDivider({
  inset = false,
  insetType = 'left',
  style,
  bold = false,
}: AppDividerProps) {
  const theme = useTheme();

  const getInsetStyle = () => {
    if (!inset) return {};
    
    const insetSize = spacing.xl;
    
    switch (insetType) {
      case 'left':
        return { marginLeft: insetSize };
      case 'right':
        return { marginRight: insetSize };
      case 'both':
        return { marginHorizontal: insetSize };
      default:
        return {};
    }
  };

  return (
    <Divider
      style={[
        styles.divider,
        {
          backgroundColor: theme.colors.outlineVariant,
          height: bold ? 2 : 1,
        },
        getInsetStyle(),
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    marginVertical: spacing.md,
  },
});
