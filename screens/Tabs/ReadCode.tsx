/**
 * ReadCode Screen - Redesign Fase 3
 * Scanner QR Code moderno com Material Design 3
 */

import React, { useRef, useState } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInUp, FadeInLeft, FadeIn } from 'react-native-reanimated';

import { TabParamList } from './Tabs';
import { RootStackParamList } from '../Root';
import Scanner from '../../components/Camera';
import { useTranslation } from 'react-i18next';
import useStatusBar from '../../hooks/useStatusBar';

import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { spacing, borderRadius, colors as themeColors } from '../../theme';

const AnimatedView = Animated.createAnimatedComponent(View);

export type ReadCodeProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'ReadCode'>,
  NativeStackScreenProps<RootStackParamList>
>;

export default function ReadCode({ navigation }: ReadCodeProps) {
  useStatusBar({ style: 'dark' });
  const theme = useTheme();
  const { t } = useTranslation();
  
  const [isFocused, setFocus] = useState(false);
  const [id, setId] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleScan = (data: string) => {
    if (!data) return;
    navigation.push('Meter', { id: data });
  };

  const handleManualConfirm = () => {
    if (!id.trim()) return;
    setId('');
    navigation.push('Meter', { id: id.trim() });
  };

  return (
    <View style={styles.container}>
      {/* Scanner */}
      <View style={styles.scannerContainer}>
        <Scanner
          onBarcodeScanned={(e: { data: any; }) => handleScan(e.data || '')}
        />
        
        {/* Overlay com instruções */}
        <View style={styles.overlay}>
          <AnimatedView entering={FadeIn} style={styles.scanFrame}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </AnimatedView>
          
          <AnimatedView entering={FadeInUp.delay(200)} style={styles.scanInstructions}>
            <MaterialCommunityIcons name="qrcode-scan" size={32} color="white" />
            <Text variant="titleMedium" style={styles.scanText}>
              {t('read.pointCamera')}
            </Text>
          </AnimatedView>
        </View>
      </View>

      {/* Input Manual */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <AnimatedView entering={FadeInUp.delay(300)} style={styles.inputCard}>
          <View style={styles.inputHeader}>
            <MaterialCommunityIcons name="keyboard" size={20} color={theme.colors.primary} />
            <Text variant="titleSmall" style={styles.inputTitle}>
              {t('read.or')}
            </Text>
          </View>

          <View style={styles.inputRow}>
            {isFocused && (
              <IconButton
                icon="arrow-left"
                onPress={() => {
                  setFocus(false);
                  setId('');
                  inputRef.current?.blur();
                }}
                style={styles.backButton}
              />
            )}
            
            <View style={styles.inputWrapper}>
              <AppInput
                ref={inputRef}
                label={t('read.meterId')}
                placeholder={t('read.meterIdPlaceholder')}
                value={id}
                onChangeText={(text) => setId(text.toUpperCase())}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                autoCapitalize="characters"
                leftIcon="identifier"
                style={styles.input}
              />
            </View>
          </View>

          {isFocused && id.trim() && (
            <AnimatedView entering={FadeInLeft} style={styles.confirmButton}>
              <AppButton
                mode="primary"
                onPress={handleManualConfirm}
                icon="arrow-right"
              >
                {t('confirm')}
              </AppButton>
            </AnimatedView>
          )}
        </AnimatedView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: 'white',
    borderWidth: 4,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanInstructions: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
    gap: spacing.sm,
  },
  scanText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
  },
  inputContainer: {
    backgroundColor: themeColors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
    elevation: 8,
  },
  inputCard: {
    gap: spacing.md,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inputTitle: {
    fontWeight: '600',
    color: themeColors.onSurface,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backButton: {
    margin: 0,
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    marginBottom: 0,
  },
  confirmButton: {
    marginTop: spacing.sm,
  },
});
