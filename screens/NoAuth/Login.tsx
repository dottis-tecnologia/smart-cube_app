/**
 * Login Screen - Redesign Fase 4
 * Tela de login moderna com Material Design 3
 */

import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { TRPCClientError } from '@trpc/client';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '../Root';
import useAuth from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import ChangeLanguageButtons from '../../components/ChangeLanguageButtons';
import useStatusBar from '../../hooks/useStatusBar';
import Logo from '../../assets/logo.svg';

import { AppInput } from '../../components/ui/AppInput';
import { AppButton } from '../../components/ui/AppButton';
import { AppCard } from '../../components/ui/AppCard';
import { spacing, borderRadius, colors as themeColors } from '../../theme';

const AnimatedView = Animated.createAnimatedComponent(View);

export type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

type FormValues = {
  email: string;
  password: string;
};

export default function Login({}: LoginProps) {
  useStatusBar({ style: 'dark' });
  const insets = useSafeAreaInsets();
  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const auth = useAuth();
  const { t } = useTranslation();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await auth.signIn({ email: data.email.trim(), password: data.password });
    } catch (e) {
      if (e instanceof TRPCClientError) {
        const message = e.message;
        if (message === 'Invalid email') {
          setError('email', { message: t('error_notFound') });
        } else if (message === 'Incorrect password') {
          setError('password', { message: t('error_incorrect') });
        } else {
          setError('root', { message: t('error_couldNotConnect') });
        }
        __DEV__ && console.log(e);
        return;
      }
      setError('root', { message: t('error_couldNotConnect') });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + spacing.md }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Idioma */}
        <View style={styles.languageContainer}>
          <ChangeLanguageButtons />
        </View>

        {/* Logo */}
        <AnimatedView entering={FadeInDown} style={styles.logoSection}>
          <View style={styles.logoCard}>
            <Logo width={240} height={96} />
          </View>
        </AnimatedView>

        {/* Formulário */}
        <AnimatedView entering={FadeInUp.delay(150)} style={styles.formSection}>
          {/* Internet Notice */}
          <View style={styles.notice}>
            <MaterialCommunityIcons name="wifi-alert" size={14} color={themeColors.outline} />
            <Text variant="bodySmall" style={styles.noticeText}>
              {t('login.internetAccess')}
            </Text>
          </View>

          {/* Email */}
          <Controller
            control={control}
            rules={{
              required: t('error_required'),
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t('login.invalidEmail', 'Invalid email format') },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label={t('email')}
                placeholder={t('emailPlaceholder')}
                value={value}
                onChangeText={(v) => { onChange(v); if (errors.email) clearErrors('email'); }}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                leftIcon="email"
                errorMessage={errors.email?.message}
                style={styles.input}
              />
            )}
            name="email"
          />

          {/* Password */}
          <Controller
            control={control}
            rules={{ required: t('error_required'), minLength: { value: 4, message: t('login.passwordTooShort', 'Too short') } }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label={t('password')}
                placeholder={t('passwordPlaceholder')}
                value={value}
                onChangeText={(v) => { onChange(v); if (errors.password) clearErrors('password'); }}
                onBlur={onBlur}
                secureTextEntry
                autoComplete="password"
                leftIcon="lock"
                errorMessage={errors.password?.message}
                style={styles.input}
              />
            )}
            name="password"
          />

          {/* Root Error */}
          {errors.root && (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons name="alert-circle" size={16} color={themeColors.error} />
              <Text variant="bodySmall" style={{ color: themeColors.error, flex: 1 }}>
                {errors.root?.message || t('login.error')}
              </Text>
            </View>
          )}

          {/* Botão */}
          <AppButton
            mode="primary"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            icon="login"
            style={styles.submitButton}
          >
            {t('login.connect')}
          </AppButton>
        </AnimatedView>

        {/* Footer */}
        <Text variant="bodySmall" style={styles.version}>
          Smart Cube v1.2.0
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF4FB',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  languageContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: spacing.xl,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  formSection: {
    width: '100%',
    maxWidth: 380,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
    padding: spacing.sm,
    backgroundColor: themeColors.surfaceVariant,
    borderRadius: borderRadius.md,
  },
  noticeText: {
    color: themeColors.onSurfaceVariant,
    flex: 1,
  },
  input: {
    marginBottom: spacing.md,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: themeColors.errorContainer,
    borderRadius: borderRadius.md,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  version: {
    marginTop: spacing.xl,
    color: themeColors.outline,
  },
});
