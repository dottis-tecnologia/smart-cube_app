/**
 * AppFAB Component
 * Floating Action Button com animações
 */

import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { FAB, FABProps } from 'react-native-paper';

interface AppFABProps extends Omit<FABProps, 'icon'> {
  icon: string;
  onPress: () => void;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'tertiary' | 'surface';
  style?: StyleProp<ViewStyle>;
  visible?: boolean;
  label?: string;
}

export function AppFAB({
  icon,
  onPress,
  size = 'medium',
  variant = 'primary',
  style,
  visible = true,
  label,
  ...rest
}: AppFABProps) {
  const customMode = label ? 'extended' : 'flat';

  return (
    <FAB
      icon={icon}
      onPress={onPress}
      size={size}
      mode={customMode as any}
      visible={visible}
      label={label}
      style={[style]}
      {...rest}
    />
  );
}
