/**
 * CreateReading Screen - Redesign Fase 4
 * Tela de criação de leitura com Material Design 3
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, Portal, Dialog, Button } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CameraCapturedPicture } from 'expo-camera';
import { randomUUID } from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import { isAfter, sub } from 'date-fns';
import Animated, { FadeIn } from 'react-native-reanimated';

import { RootStackParamList } from './Root';
import NewReading from '../components/CreateReading/NewReading';
import { dbQuery } from '../util/db';
import useMutation from '../hooks/useMutation';
import useAuth from '../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import useStatusBar from '../hooks/useStatusBar';

import { colors as themeColors } from '../theme';

const AnimatedView = Animated.createAnimatedComponent(View);

export type CreateReadingProps = NativeStackScreenProps<
  RootStackParamList,
  'CreateReading'
>;

export default function CreateReading({
  navigation,
  route: { params },
}: CreateReadingProps) {
  useStatusBar({ style: 'dark' });
  const { meterId } = params;
  const { userData } = useAuth();
  const { t } = useTranslation();
  
  const [showAlert, setShowAlert] = useState(false);

  const { isMutating, mutate } = useMutation(
    async (snapshot: CameraCapturedPicture | null, reading: number) => {
      const readingId = randomUUID();
      let filePath: string | null = null;

      if (snapshot != null) {
        const uri = snapshot.uri;
        const extSplit = uri.split('.');
        const ext = extSplit[extSplit.length - 1];
        filePath = `${FileSystem.documentDirectory}pictures/${meterId}/${readingId}.${ext}`;

        await FileSystem.copyAsync({
          from: uri,
          to: filePath,
        });
      }

      await dbQuery(
        `INSERT INTO readings (id, meterId, value, createdAt, imagePath, technicianName, technicianId) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          readingId,
          meterId,
          reading,
          new Date().toISOString(),
          filePath,
          userData?.name ?? 'Técnico',
          userData?.id ?? null,
        ],
        false
      );
    },
    {
      onSuccess: () => {
        navigation.navigate('Tabs');
      },
    }
  );

  // Check for recent reading (last 24h)
  useEffect(() => {
    (async () => {
      const result = await dbQuery<{ createdAt: string }>(
        'SELECT MAX(createdAt) as createdAt FROM readings WHERE meterId = ?',
        [meterId]
      );

      const createdAt = result?.rows[0].createdAt;
      if (createdAt == null) return;

      if (isAfter(new Date(createdAt), sub(new Date(), { hours: 24 }))) {
        setShowAlert(true);
      }
    })();
  }, [meterId]);

  return (
    <View style={styles.container}>
      {/* Alert Dialog */}
      <Portal>
        <Dialog 
          visible={showAlert} 
          onDismiss={() => setShowAlert(false)}
          style={styles.alertDialog}
        >
          <Dialog.Icon icon="alert" color={themeColors.warning} size={40} />
          <Dialog.Title style={styles.alertTitle}>
            {t('createReading.careful')}
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={styles.alertText}>
              {t('createReading.carefulMessage')}
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.alertActions}>
            <Button
              mode="contained"
              onPress={() => setShowAlert(false)}
              buttonColor={themeColors.warning}
              textColor={themeColors.onWarning}
              style={styles.alertButton}
            >
              {t('createReading.understand')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Loading or Content */}
      {isMutating ? (
        <AnimatedView entering={FadeIn} style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text variant="bodyMedium" style={styles.loadingText}>
            {t('createReading.saving')}
          </Text>
        </AnimatedView>
      ) : (
        <NewReading onConfirm={mutate} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  alertDialog: {
    borderRadius: 28,
  },
  alertTitle: {
    textAlign: 'center',
    fontWeight: '600',
  },
  alertText: {
    textAlign: 'center',
    lineHeight: 20,
  },
  alertActions: {
    justifyContent: 'center',
    paddingBottom: 16,
  },
  alertButton: {
    minWidth: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: themeColors.onSurfaceVariant,
  },
});
