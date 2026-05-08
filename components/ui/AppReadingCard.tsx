/**
 * AppReadingCard Component
 * Card específico para exibir leituras de medidores
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing, borderRadius } from '../../theme';

export interface ReadingData {
  id: string;
  meterName: string;
  location?: string;
  value: number;
  unit: string;
  createdAt: string;
  technicianName?: string;
  syncedAt?: string | null;
}

interface AppReadingCardProps {
  reading: ReadingData;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
  compact?: boolean;
}

export function AppReadingCard({
  reading,
  onPress,
  onLongPress,
  style,
  compact = false,
}: AppReadingCardProps) {
  const theme = useTheme();

  const isSynced = !!reading.syncedAt;
  const isRecent = new Date(reading.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Cores baseadas no status
  const statusColors = {
    synced: {
      bg: '#E8F5E9',
      text: '#2E7D32',
      icon: '#4CAF50',
    },
    pending: {
      bg: '#FFF3E0',
      text: '#ED6C02',
      icon: '#FF9800',
    },
    recent: {
      bg: '#E3F2FD',
      text: '#0288D1',
      icon: '#03A9F4',
    },
  };

  const status = isSynced ? 'synced' : isRecent ? 'recent' : 'pending';
  const colors = statusColors[status];

  // Format time ago
  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return past.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const timeAgo = formatTimeAgo(reading.createdAt);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg,
          borderLeftWidth: 4,
          borderLeftColor: colors.icon,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.meterInfo}>
            <MaterialCommunityIcons
              name="lightning-bolt"
              size={compact ? 16 : 20}
              color={colors.icon}
            />
            <Text
              variant={compact ? 'bodyMedium' : 'titleMedium'}
              style={[styles.meterName, { color: theme.colors.onSurface }]}
              numberOfLines={1}
            >
              {reading.meterName}
            </Text>
          </View>
          
          <View style={styles.statusContainer}>
            <MaterialCommunityIcons
              name={isSynced ? 'check-circle' : 'clock-outline'}
              size={16}
              color={colors.icon}
            />
          </View>
        </View>

        {!compact && reading.location && (
          <View style={styles.location}>
            <MaterialCommunityIcons
              name="map-marker"
              size={14}
              color={theme.colors.onSurfaceVariant}
            />
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
              numberOfLines={1}
            >
              {reading.location}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.valueContainer}>
            <Text
              variant={compact ? 'titleMedium' : 'headlineSmall'}
              style={[styles.value, { color: colors.text }]}
            >
              {reading.value.toLocaleString()}
            </Text>
            <Text
              variant="bodySmall"
              style={[styles.unit, { color: theme.colors.onSurfaceVariant }]}
            >
              {reading.unit}
            </Text>
          </View>

          <View style={styles.meta}>
            {reading.technicianName && !compact && (
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant }}
                numberOfLines={1}
              >
                {reading.technicianName}
              </Text>
            )}
            <Text
              variant="bodySmall"
              style={[styles.time, { color: theme.colors.onSurfaceVariant }]}
            >
              {timeAgo}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  content: {
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  meterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  meterName: {
    flex: 1,
    fontWeight: '600',
  },
  statusContainer: {
    padding: spacing.xs,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  value: {
    fontWeight: '700',
  },
  unit: {
    fontWeight: '500',
  },
  meta: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  time: {
    fontStyle: 'italic',
  },
});
