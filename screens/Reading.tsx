/**
 * Reading Screen - Redesign Fase 5
 * Tela de detalhes da leitura com Material Design 3
 */

import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { 
  Text, 
  useTheme, 
  ActivityIndicator, 
  IconButton, 
  Chip,
  Button 
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Animated, { FadeInUp, FadeInLeft } from 'react-native-reanimated';

import { RootStackParamList } from './Root';
import useQuery from '../hooks/useQuery';
import { dbQuery } from '../util/db';
import { useTranslation } from 'react-i18next';
import useStatusBar from '../hooks/useStatusBar';

import { AppCard, AppCardContent } from '../components/ui/AppCard';
import { spacing, borderRadius, colors as themeColors } from '../theme';

const AnimatedView = Animated.createAnimatedComponent(View);

export type ReadingProps = NativeStackScreenProps<
  RootStackParamList,
  'Reading'
>;

interface ReadingData {
  id: string;
  meterName: string;
  meterId: string;
  value: number;
  createdAt: string;
  synchedAt?: string;
  imagePath?: string;
  unit: string;
  technicianName?: string;
}

export default function Reading({
  route: { params },
  navigation,
}: ReadingProps) {
  const { id } = params;
  useStatusBar({ style: 'dark' });
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'pt' ? ptBR : undefined;

  const { data: meterData } = useQuery(
    () =>
      dbQuery<ReadingData>(
        `SELECT readings.*, meters.name as meterName, meters.unit 
         FROM readings 
         JOIN meters ON readings.meterId = meters.id 
         WHERE readings.id = ?;`,
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
          {t('reading.notFound', { id })}
        </Text>
        <IconButton
          icon="arrow-left"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </View>
    );
  }

  const reading = meterData.rows[0];
  const isSynced = !!reading.synchedAt;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Image Section */}
      <AnimatedView entering={FadeInUp} style={styles.imageContainer}>
        {reading.imagePath ? (
          <Image
            source={{ uri: reading.imagePath }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <MaterialCommunityIcons name="image-off" size={48} color={themeColors.outline} />
            <Text variant="bodyMedium" style={{ color: themeColors.outline }}>
              {t('reading.noImage')}
            </Text>
          </View>
        )}
      </AnimatedView>

      {/* Status Chip */}
      <AnimatedView entering={FadeInUp.delay(100)} style={styles.statusContainer}>
        <Chip 
          icon={isSynced ? 'check-circle' : 'clock-outline'}
          style={[
            styles.statusChip,
            { 
              backgroundColor: isSynced 
                ? theme.colors.primaryContainer 
                : theme.colors.errorContainer 
            }
          ]}
          textStyle={{
            color: isSynced 
              ? theme.colors.onPrimaryContainer 
              : theme.colors.onErrorContainer
          }}
        >
          {isSynced 
            ? t('reading.synchronized')
            : t('reading.notSynchronized')
          }
        </Chip>
      </AnimatedView>

      {/* Reading Value Card */}
      <AnimatedView entering={FadeInUp.delay(200)} style={styles.valueCard}>
        <AppCard>
          <AppCardContent style={styles.valueCardContent}>
            <Text variant="displaySmall" style={styles.readingValue}>
              {reading.value}
            </Text>
            <Text variant="titleMedium" style={styles.readingUnit}>
              {reading.unit}
            </Text>
          </AppCardContent>
        </AppCard>
      </AnimatedView>

      {/* Details Card */}
      <AnimatedView entering={FadeInUp.delay(300)}>
        <AppCard>
          <AppCardContent style={styles.detailsContent}>
            {/* Meter */}
            <AnimatedView entering={FadeInLeft.delay(400)} style={styles.detailRow}>
              <MaterialCommunityIcons name="identifier" size={20} color={theme.colors.primary} />
              <View style={styles.detailText}>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {t('reading.meterId')}
                </Text>
                <Text variant="titleMedium" style={styles.detailValue}>
                  {reading.meterName}
                </Text>
              </View>
            </AnimatedView>

            {/* Technician */}
            <AnimatedView entering={FadeInLeft.delay(500)} style={styles.detailRow}>
              <MaterialCommunityIcons name="account" size={20} color={theme.colors.secondary} />
              <View style={styles.detailText}>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {t('reading.doneBy')}
                </Text>
                <Text variant="bodyMedium">
                  {reading.technicianName || t('common.unknown')}
                </Text>
              </View>
            </AnimatedView>

            {/* Created At */}
            <AnimatedView entering={FadeInLeft.delay(600)} style={styles.detailRow}>
              <MaterialCommunityIcons name="calendar" size={20} color={theme.colors.tertiary} />
              <View style={styles.detailText}>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {t('reading.createdAt')}
                </Text>
                <Text variant="bodyMedium">
                  {formatDistanceToNow(new Date(reading.createdAt), { addSuffix: true, locale })}
                </Text>
              </View>
            </AnimatedView>

            {/* Synched At (if synced) */}
            {isSynced && (
              <AnimatedView entering={FadeInLeft.delay(700)} style={styles.detailRow}>
                <MaterialCommunityIcons name="cloud-check" size={20} color={theme.colors.primary} />
                <View style={styles.detailText}>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {t('reading.synchedAt')}
                  </Text>
                  <Text variant="bodyMedium">
                    {formatDistanceToNow(new Date(reading.synchedAt!), { addSuffix: true, locale })}
                  </Text>
                </View>
              </AnimatedView>
            )}
          </AppCardContent>
        </AppCard>
      </AnimatedView>

      {/* Go to Meter Button */}
      <AnimatedView entering={FadeInUp.delay(800)} style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Meter', { id: reading.meterId })}
          icon="arrow-right"
          contentStyle={styles.buttonContent}
        >
          {t('reading.goToMeter')}
        </Button>
      </AnimatedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  content: {
    paddingBottom: spacing.xl,
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
  statusContainer: {
    alignItems: 'center',
    marginTop: -spacing.lg,
    zIndex: 1,
  },
  statusChip: {
    borderRadius: borderRadius.xl,
  },
  valueCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
  },
  valueCardContent: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  readingValue: {
    fontWeight: '700',
    color: themeColors.primary,
  },
  readingUnit: {
    color: themeColors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  detailsContent: {
    gap: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  detailText: {
    flex: 1,
  },
  detailValue: {
    fontWeight: '600',
  },
  buttonContainer: {
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  buttonContent: {
    flexDirection: 'row-reverse',
  },
});
