/**
 * Meter Screen - Redesign Fase 4
 * Tela de detalhes do medidor com Material Design 3
 */

import React from 'react';
import { View, StyleSheet, Image, Pressable } from 'react-native';
import { Text, useTheme, ActivityIndicator, IconButton, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useIsFocused } from '@react-navigation/native';
import Animated, { FadeInUp, FadeInLeft } from 'react-native-reanimated';

import { RootStackParamList } from './Root';
import useQuery from '../hooks/useQuery';
import { dbQuery } from '../util/db';
import ParallaxScroll from '../components/ParallaxScroll';
import { useTranslation } from 'react-i18next';
import useStatusBar from '../hooks/useStatusBar';

import { AppCard, AppCardContent } from '../components/ui/AppCard';
import { AppFAB } from '../components/ui/AppFAB';
import { spacing, borderRadius, colors as themeColors } from '../theme';

const AnimatedView = Animated.createAnimatedComponent(View);

export type MeterProps = NativeStackScreenProps<RootStackParamList, 'Meter'>;

// Interfaces
interface MeterData {
  id: string;
  name: string;
  location: string;
  unit: string;
  imagePath: string;
  notes: string;
  type: string;
}

interface Reading {
  id: string;
  meterId: string;
  value: number;
  createdAt: string;
  synchedAt?: string;
  imagePath: string;
  technicianName?: string;
}

export default function Meter({ route: { params }, navigation }: MeterProps) {
  const { id } = params;
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const locale = i18n.language === 'pt' ? ptBR : undefined;
  
  useStatusBar({ style: 'dark' });
  const isFocused = useIsFocused();

  const { data: meterData } = useQuery(
    () => dbQuery<MeterData>('SELECT * FROM meters WHERE id = ?;', [id]),
    [id]
  );

  const { data: readings } = useQuery(
    () => dbQuery<Reading>(
      'SELECT * FROM readings WHERE meterId = ? ORDER BY createdAt DESC LIMIT 5;',
      [id]
    ),
    [id]
  );

  // Loading state
  if (meterData == null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Not found state
  if (meterData.rows.length === 0) {
    return (
      <View style={styles.notFoundContainer}>
        <MaterialCommunityIcons name="alert-circle" size={64} color={theme.colors.error} />
        <Text variant="titleMedium" style={styles.notFoundText}>
          {t('meter.notFound', { id })}
        </Text>
        <IconButton
          icon="arrow-left"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </View>
    );
  }

  const meter = meterData.rows[0];

  return (
    <View style={styles.container}>
      <ParallaxScroll
        header={
          <View style={styles.imageContainer}>
            {meter.imagePath ? (
              <Image
                source={{ uri: meter.imagePath }}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.image, styles.placeholderImage]}>
                <MaterialCommunityIcons name="image-off" size={48} color={themeColors.outline} />
                <Text variant="bodyMedium" style={{ color: themeColors.outline }}>
                  {t('meter.noImage')}
                </Text>
              </View>
            )}
          </View>
        }
      >
        {/* Meter Info Card */}
        <AnimatedView entering={FadeInUp} style={styles.infoCard}>
          <AppCard>
            <AppCardContent style={styles.cardContent}>
              {/* Meter ID */}
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="identifier" size={20} color={theme.colors.primary} />
                <View style={styles.infoText}>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {t('meter.meterId')}
                  </Text>
                  <Text variant="titleMedium" style={styles.meterName}>
                    {meter.name}
                  </Text>
                </View>
              </View>

              {/* Location */}
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="map-marker" size={20} color={theme.colors.secondary} />
                <View style={styles.infoText}>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {t('meter.location')}
                  </Text>
                  <Text variant="bodyMedium">{meter.location}</Text>
                </View>
              </View>

              {/* Type */}
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="information" size={20} color={theme.colors.tertiary} />
                <View style={styles.infoText}>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {t('meter.type')}
                  </Text>
                  <Chip compact style={styles.typeChip}>
                    {meter.type.toUpperCase()}
                  </Chip>
                </View>
              </View>
            </AppCardContent>
          </AppCard>
        </AnimatedView>

        {/* Notes */}
        {meter.notes && (
          <AnimatedView entering={FadeInUp.delay(100)} style={styles.notesSection}>
            <Text variant="titleSmall" style={styles.sectionTitle}>
              {t('meter.notes')}
            </Text>
            <AppCard style={styles.notesCard}>
              <AppCardContent>
                <Text variant="bodyMedium">{meter.notes}</Text>
              </AppCardContent>
            </AppCard>
          </AnimatedView>
        )}

        {/* Latest Readings */}
        <AnimatedView entering={FadeInUp.delay(200)} style={styles.readingsSection}>
          <Text variant="titleSmall" style={styles.sectionTitle}>
            {t('meter.latestReadings')}
          </Text>

          {readings?.rows.map((item, index) => (
            <AnimatedView 
              key={item.id} 
              entering={FadeInLeft.delay(300 + index * 100)}
            >
              <Pressable
                onPress={() => navigation.navigate('Reading', { id: item.id })}
                style={({ pressed }: { pressed: boolean }) => [
                  styles.readingCard,
                  { 
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                    backgroundColor: item.synchedAt 
                      ? theme.colors.primaryContainer 
                      : theme.colors.errorContainer
                  }
                ]}
              >
                <View style={styles.readingContent}>
                  <View style={styles.readingMain}>
                    <MaterialCommunityIcons 
                      name="account" 
                      size={16} 
                      color={item.synchedAt ? theme.colors.primary : theme.colors.error} 
                    />
                    <View>
                      <Text 
                        variant="bodyMedium" 
                        style={{ 
                          fontWeight: '600',
                          color: item.synchedAt ? theme.colors.onPrimaryContainer : theme.colors.onErrorContainer
                        }}
                      >
                        {item.technicianName || t('common.unknown')}
                      </Text>
                      <Text 
                        variant="bodySmall"
                        style={{ 
                          color: item.synchedAt 
                            ? theme.colors.onPrimaryContainer 
                            : theme.colors.onErrorContainer,
                          opacity: 0.7
                        }}
                      >
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale })}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.readingValue}>
                    <Text 
                      variant="titleMedium" 
                      style={{ 
                        fontWeight: '700',
                        color: item.synchedAt ? theme.colors.primary : theme.colors.error
                      }}
                    >
                      {item.value} {meter.unit}
                    </Text>
                    {item.synchedAt ? (
                      <MaterialCommunityIcons name="check-circle" size={16} color={theme.colors.primary} />
                    ) : (
                      <MaterialCommunityIcons name="clock-outline" size={16} color={theme.colors.error} />
                    )}
                  </View>
                </View>
              </Pressable>
            </AnimatedView>
          ))}

          {readings?.rows.length === 0 && (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="inbox-outline" size={48} color={themeColors.outline} />
              <Text variant="bodyMedium" style={{ color: themeColors.outline }}>
                {t('meter.noReadings', 'Nenhuma leitura registrada')}
              </Text>
            </View>
          )}
        </AnimatedView>

        <View style={{ height: 100 }} />
      </ParallaxScroll>

      {/* FAB */}
      {isFocused && (
        <AppFAB
          icon="plus"
          onPress={() => navigation.navigate('CreateReading', { meterId: id })}
          style={styles.fab}
          variant="primary"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  notFoundText: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  backButton: {
    marginTop: spacing.md,
  },
  imageContainer: {
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    backgroundColor: themeColors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoCard: {
    marginHorizontal: spacing.md,
    marginTop: -spacing.xl,
    zIndex: 1,
  },
  cardContent: {
    gap: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  infoText: {
    flex: 1,
  },
  meterName: {
    fontWeight: '700',
  },
  typeChip: {
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  notesSection: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.md,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: spacing.sm,
    color: themeColors.onBackground,
  },
  notesCard: {
    backgroundColor: themeColors.secondaryContainer,
  },
  readingsSection: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.md,
  },
  readingCard: {
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  readingContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  readingMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  readingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: spacing.md,
    bottom: spacing.xl,
  },
});
