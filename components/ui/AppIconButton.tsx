/**
 * AppIconButton Component
 * Botão de ícone estilizado
 */

import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { IconButton, IconButtonProps, useTheme } from 'react-native-paper';

interface AppIconButtonProps extends Omit<IconButtonProps, 'icon' | 'size'> {
  icon: string;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'primary' | 'secondary' | 'surface';
  style?: StyleProp<ViewStyle>;
}

export function AppIconButton({
  icon,
  onPress,
  size = 'medium',
  variant = 'default',
  style,
  ...rest
}: AppIconButtonProps) {
  const theme = useTheme();

  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32,
  };

  const variantColors = {
    default: theme.colors.onSurfaceVariant,
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    surface: theme.colors.onSurface,
  };

  return (
    <IconButton
      icon={icon}
      onPress={onPress}
      size={sizeMap[size]}
      iconColor={variantColors[variant]}
      style={style}
      {...rest}
    />
  );
}
