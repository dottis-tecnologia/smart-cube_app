/**
 * AppBottomNav Component
 * Tab bar moderna com FAB central (estilo Instagram)
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { spacing, borderRadius, elevation } from '../../theme';

interface TabItem {
  name: string;
  icon: string;
  label: string;
  badge?: number;
}

interface AppBottomNavProps extends BottomTabBarProps {
  tabs: TabItem[];
  centerAction?: () => void;
  centerIcon?: string;
}

export function AppBottomNav({
  state,
  descriptors,
  navigation,
  tabs,
  centerAction,
  centerIcon = 'qrcode-scan',
}: AppBottomNavProps) {
  const theme = useTheme();

  const renderTab = (tab: TabItem, index: number) => {
    const isFocused = state.index === index;
    const route = state.routes[index];
    
    if (!route) return null;

    const { options } = descriptors[route.key];
    const label = options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
      ? options.title
      : tab.label;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <TouchableOpacity
        key={tab.name}
        onPress={onPress}
        style={styles.tab}
        activeOpacity={0.7}
      >
        <View style={styles.tabContent}>
          <MaterialCommunityIcons
            name={tab.icon as any}
            size={24}
            color={isFocused ? theme.colors.primary : theme.colors.onSurfaceVariant}
          />
          {tab.badge !== undefined && tab.badge > 0 && (
            <View style={[styles.badge, { backgroundColor: theme.colors.error }]}>
              <Text style={[styles.badgeText, { color: theme.colors.onError }]}>
                {tab.badge > 99 ? '99+' : tab.badge}
              </Text>
            </View>
          )}
          <Text
            variant="labelSmall"
            style={[
              styles.tabLabel,
              { color: isFocused ? theme.colors.primary : theme.colors.onSurfaceVariant },
            ]}
          >
            {label as string}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const leftTabs = tabs.slice(0, Math.floor(tabs.length / 2));
  const rightTabs = tabs.slice(Math.floor(tabs.length / 2));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }, elevation.level3]}>
      <View style={styles.tabsContainer}>
        {leftTabs.map((tab, index) => renderTab(tab, index))}
        
        {centerAction && (
          <View style={styles.centerButtonContainer}>
            <TouchableOpacity
              onPress={centerAction}
              style={[styles.centerButton, { backgroundColor: theme.colors.primary }]}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name={centerIcon as any}
                size={28}
                color={theme.colors.onPrimary}
              />
            </TouchableOpacity>
          </View>
        )}
        
        {rightTabs.map((tab, index) => 
          renderTab(tab, Math.floor(tabs.length / 2) + index)
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingBottom: spacing.md,
    paddingTop: spacing.sm,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  tabContent: {
    alignItems: 'center',
    position: 'relative',
  },
  tabLabel: {
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  centerButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...elevation.level3,
  },
});
