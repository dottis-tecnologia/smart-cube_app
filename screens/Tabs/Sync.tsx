/**
 * Sync Screen - Redesign Fase 3
 * Tela de sincronização moderna com Material Design 3
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { 
  Text, 
  Portal, 
  Dialog, 
  TextInput,
  ActivityIndicator,
  Snackbar
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import AsyncStorage from "expo-sqlite/kv-store";
import { shareAsync } from 'expo-sharing';
import Animated, { FadeInUp, FadeInLeft } from 'react-native-reanimated';

import { deleteDatabase, dbQuery, databasePath } from '../../util/db';
import useMutation from '../../hooks/useMutation';
import useQuery from '../../hooks/useQuery';
import { syncData } from '../../util/sync/sync';
import useAuth from '../../hooks/useAuth';
import { getToken } from '../../util/authToken';
import { useTranslation } from 'react-i18next';
import useStatusBar from '../../hooks/useStatusBar';

import { AppCard, AppCardContent } from '../../components/ui/AppCard';
import { AppButton } from '../../components/ui/AppButton';
import { AppDivider } from '../../components/ui/AppDivider';
import { spacing, borderRadius, colors as themeColors } from '../../theme';

const AnimatedView = Animated.createAnimatedComponent(View);

// Interface para leitura
interface UnsyncedReading {
  id: string;
  meterId: string;
  meterName: string;
  value: number;
  unit: string;
  createdAt: string;
  imagePath: string;
}

const getUnsyncedReadings = () =>
  dbQuery<UnsyncedReading>(
    `SELECT readings.*, meters.unit, meters.name as meterName 
     FROM readings 
     JOIN meters ON readings.meterId = meters.id 
     WHERE readings.synchedAt IS NULL;`
  );

export type SyncProps = {};

export default function Sync({}: SyncProps) {
  useStatusBar({ style: 'light' });
  const { refreshToken } = useAuth();
  const { t, i18n } = useTranslation();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const locale = i18n.language === 'pt' ? ptBR : undefined;

  const { data: readings, refetch: refetchReadings } = useQuery(
    getUnsyncedReadings,
    []
  );

  const { data: lastSync, refetch: refetchLastSync } = useQuery(async () => {
    const stored = await AsyncStorage.getItemAsync("last-sync");
    return stored ? new Date(stored) : null;
  }, []);

  const { mutate: syncMutate, isMutating: isSyncing } = useMutation(syncData, {
    onSuccess: () => {
      refetchReadings();
      refetchLastSync();
      showSnackbar(t('sync.success'));
    },
    onError: () => {
      showSnackbar(t('sync.error'));
    },
    async beforeRequest() {
      if (getToken() == null) await refreshToken();
    },
  });

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const unsyncedCount = readings?.rows.length || 0;

  return (
    <View style={styles.container}>
      {/* Header moderno */}
      <View style={styles.header}>
        <AnimatedView entering={FadeInUp} style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.headerIconWrap}>
              <MaterialCommunityIcons name="cloud-sync" size={28} color="rgba(255,255,255,0.9)" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerSubtitleSmall}>{t('sync.lastSync')}{' '}{lastSync ? formatDistanceToNow(lastSync, { addSuffix: true, locale }) : t('sync.never')}</Text>
              <Text style={styles.headerTitle}>{t('sync.sync')}</Text>
            </View>
            <AppButton
              mode="primary"
              onPress={() => syncMutate()}
              loading={isSyncing}
              icon="sync"
              size="small"
            >
              {t('sync.sync')}
            </AppButton>
          </View>

          {/* Stats pill */}
          <View style={styles.statsPill}>
            <View style={styles.statsPillIcon}>
              <MaterialCommunityIcons name="cloud-upload-outline" size={20} color={unsyncedCount > 0 ? themeColors.error : themeColors.primary} />
            </View>
            <View>
              <Text style={styles.statsCount}>{unsyncedCount}</Text>
              <Text style={styles.statsLabel}>{t('sync.pending')}</Text>
            </View>
          </View>
        </AnimatedView>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hint */}
        <AnimatedView entering={FadeInUp.delay(200)} style={styles.hint}>
          <MaterialCommunityIcons name="pencil" size={16} color={themeColors.outline} />
          <Text variant="bodySmall" style={{ color: themeColors.outline }}>
            {t('readings.longPressToEdit')}
          </Text>
        </AnimatedView>

        {/* Readings List */}
        <View style={styles.readingsList}>
          {readings?.rows.map((item, index) => (
            <AnimatedView 
              key={item.id} 
              entering={FadeInUp.delay(300 + index * 50)}
            >
              <ReadingItem
                item={item}
                onUpdate={() => refetchReadings()}
              />
            </AnimatedView>
          ))}
          
          {unsyncedCount === 0 && (
            <AnimatedView entering={FadeInUp.delay(300)} style={styles.emptyState}>
              <MaterialCommunityIcons 
                name="check-circle-outline" 
                size={64} 
                color={themeColors.primary} 
              />
              <Text variant="titleMedium" style={styles.emptyTitle}>
                {t('sync.allSynced')}
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtitle}>
                {t('sync.noPending')}
              </Text>
            </AnimatedView>
          )}
        </View>

        <AppDivider />

        {/* Actions */}
        <AnimatedView entering={FadeInUp.delay(500)} style={styles.actions}>
          <ShareDBButton />
          <DeleteDBButton 
            onSuccess={() => {
              refetchLastSync();
              refetchReadings();
            }}
          />
        </AnimatedView>

        <View style={{ height: 100 }} />
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: '#1A3A5C' }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

function ReadingItem({
  item,
  onUpdate,
}: {
  item: UnsyncedReading;
  onUpdate?: () => void;
}) {
  const { t, i18n } = useTranslation();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [reading, setReading] = useState(item.value ? item.value.toString() : '');
  const [error, setError] = useState('');

  const locale = i18n.language === 'pt' ? ptBR : undefined;

  const { isMutating, mutate } = useMutation(
    async (newValue: number) => {
      await dbQuery(
        'UPDATE readings SET value = ? WHERE id = ?',
        [newValue, item.id],
        false
      );
    },
    {
      onSuccess: () => {
        onUpdate?.();
        setDialogVisible(false);
        setError('');
      },
    }
  );

  const handleSave = () => {
    const numberValue = parseFloat(reading);
    if (isNaN(numberValue)) {
      setError(t('reading.invalidValue'));
      return;
    }
    mutate(numberValue);
  };

  return (
    <>
      <Portal>
        <Dialog 
          visible={dialogVisible} 
          onDismiss={() => {
            setDialogVisible(false);
            setReading(item.value ? item.value.toString() : '');
            setError('');
          }}
        >
          <Dialog.Title>{t('readings.update')}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ marginBottom: spacing.md }}>
              {t('readings.mistakes')}
            </Text>
            <TextInput
              label={t('reading.currentReading')}
              value={reading}
              onChangeText={setReading}
              keyboardType="numeric"
              selectTextOnFocus
              error={!!error}
            />
            {error ? (
              <Text variant="bodySmall" style={{ color: themeColors.error, marginTop: spacing.xs }}>
                {error}
              </Text>
            ) : null}
          </Dialog.Content>
          <Dialog.Actions>
            <AppButton
              mode="text"
              onPress={() => {
                setDialogVisible(false);
                setReading(item.value ? item.value.toString() : '');
                setError('');
              }}
            >
              {t('cancel')}
            </AppButton>
            <AppButton
              mode="primary"
              onPress={handleSave}
              loading={isMutating}
            >
              {t('save')}
            </AppButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Pressable 
        onLongPress={() => setDialogVisible(true)}
        style={({ pressed }: { pressed: boolean }) => [
          styles.readingItem,
          { transform: [{ scale: pressed ? 0.98 : 1 }] }
        ]}
      >
        <View style={styles.readingCard}>
          <View style={styles.readingContent}>
            <View style={styles.readingIconWrap}>
              <MaterialCommunityIcons name="lightning-bolt" size={20} color={themeColors.error} />
            </View>
            <View style={styles.readingInfo}>
              <Text variant="titleSmall" style={{ fontWeight: '600', color: themeColors.onSurface }}>
                {item.meterName}
              </Text>
              <Text variant="bodySmall" style={{ color: themeColors.onSurfaceVariant }}>
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale })}
              </Text>
            </View>
            <View style={styles.readingValue}>
              <Text variant="titleMedium" style={{ fontWeight: '700', color: themeColors.error }}>
                {item.value}
              </Text>
              <Text variant="bodySmall" style={{ color: themeColors.onSurfaceVariant }}>
                {item.unit}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </>
  );
}

function DeleteDBButton({ onSuccess }: { onSuccess?: () => void }) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const { mutate: deleteDb, isMutating } = useMutation(deleteDatabase, {
    onSuccess: () => {
      onSuccess?.();
      setDialogVisible(false);
    },
  });
  const { t } = useTranslation();

  return (
    <>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>{t('sync.deleteDatabaseTitle')}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {t('sync.deleteDatabaseBody')}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <AppButton mode="text" onPress={() => setDialogVisible(false)}>
              {t('cancel')}
            </AppButton>
            <AppButton 
              mode="primary" 
              onPress={() => deleteDb()}
              loading={isMutating}
              style={{ backgroundColor: themeColors.error }}
            >
              {t('delete')}
            </AppButton>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <AppButton
        mode="outline"
        onPress={() => setDialogVisible(true)}
        icon="delete"
        style={styles.actionButton}
      >
        {t('sync.deleteLocal')}
      </AppButton>
    </>
  );
}

function ShareDBButton() {
  const { mutate: shareDb, isMutating } = useMutation(
    () => shareAsync(databasePath),
    {}
  );
  const { t } = useTranslation();

  return (
    <AppButton
      mode="outline"
      onPress={() => shareDb()}
      loading={isMutating}
      icon="share-variant"
      style={styles.actionButton}
    >
      {t('sync.exportDb')}
    </AppButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  header: {
    backgroundColor: '#5A9BD6',
    paddingTop: 52,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl + 8,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerContent: {
    gap: spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  headerIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSubtitleSmall: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
  },
  statsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsPillIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: themeColors.errorContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsCount: {
    fontSize: 20,
    fontWeight: '700',
    color: themeColors.error,
    lineHeight: 24,
  },
  statsLabel: {
    fontSize: 11,
    color: themeColors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    backgroundColor: themeColors.background,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
    justifyContent: 'center',
  },
  readingsList: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  readingItem: {
    marginBottom: spacing.sm,
  },
  readingCard: {
    borderRadius: borderRadius.lg,
    backgroundColor: themeColors.errorContainer,
    overflow: 'hidden',
  },
  readingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  readingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  readingInfo: {
    flex: 1,
  },
  readingValue: {
    alignItems: 'flex-end',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  emptyTitle: {
    color: themeColors.onBackground,
    marginTop: spacing.md,
    fontWeight: '600',
  },
  emptySubtitle: {
    color: themeColors.outline,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
});
