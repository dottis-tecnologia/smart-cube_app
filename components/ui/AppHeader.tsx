/**
 * AppHeader Component
 * Header de navegação Material Design 3
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '../../theme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  actions?: Array<{
    icon: string;
    onPress: () => void;
    color?: string;
  }>;
  style?: ViewStyle;
  elevated?: boolean;
}

export function AppHeader({
  title,
  subtitle,
  onBack,
  actions = [],
  style,
  elevated = false,
}: AppHeaderProps) {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface }]}>
      <Appbar.Header
        style={[styles.header, style]}
        elevated={elevated}
      >
        {onBack && (
          <Appbar.BackAction onPress={onBack} color={theme.colors.onSurface} />
        )}
        
        <View style={styles.titleContainer}>
          <Appbar.Content
            title={
              <Text variant="titleLarge" style={{ color: theme.colors.onSurface }}>
                {title}
              </Text>
            }
            subtitle={subtitle}
          />
        </View>

        {actions.map((action, index) => (
          <Appbar.Action
            key={index}
            icon={action.icon}
            onPress={action.onPress}
            color={action.color || theme.colors.onSurface}
          />
        ))}
      </Appbar.Header>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    zIndex: 100,
  },
  header: {
    elevation: 0,
    shadowOpacity: 0,
  },
  titleContainer: {
    flex: 1,
  },
});
