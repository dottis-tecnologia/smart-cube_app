/**
 * AppButton Component
 * Botões estilizados Material Design 3
 */

import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { Button, ButtonProps } from 'react-native-paper';

interface AppButtonProps extends Omit<ButtonProps, 'mode'> {
  mode?: 'primary' | 'secondary' | 'outline' | 'text' | 'tonal';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function AppButton({
  mode = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  children,
  ...rest
}: AppButtonProps) {
  // Mapear modes custom para modes do Paper
  const paperModeMap = {
    primary: 'contained',
    secondary: 'contained-tonal',
    outline: 'outlined',
    text: 'text',
    tonal: 'contained-tonal',
  };

  // Tamanhos
  const sizeStyles = {
    small: { paddingVertical: 4, paddingHorizontal: 8 },
    medium: { paddingVertical: 8, paddingHorizontal: 16 },
    large: { paddingVertical: 12, paddingHorizontal: 24 },
  };

  return (
    <Button
      mode={paperModeMap[mode] as ButtonProps['mode']}
      loading={loading}
      disabled={disabled}
      style={[sizeStyles[size], style]}
      labelStyle={{
        fontSize: size === 'small' ? 12 : size === 'large' ? 16 : 14,
        fontWeight: '500',
      }}
      {...rest}
    >
      {children}
    </Button>
  );
}
