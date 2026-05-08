/**
 * Login Screen - Redesign Fase 4
 * Tela de login moderna com Material Design 3
 */

import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, useTheme, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { TRPCClientError } from '@trpc/client';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

import { RootStackParamList } from '../Root';
import useAuth from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import ChangeLanguageButtons from '../../components/ChangeLanguageButtons';
import useStatusBar from '../../hooks/useStatusBar';

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
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    setError,
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
          setError('email', { type: 'notFound', message: t('error_notFound', 'Não encontrado') });
        } else if (message === 'Incorrect password') {
          setError('password', { type: 'incorrect', message: t('error_incorrect', 'Senha incorreta') });
        } else if (message === 'Network request failed') {
          setError('root', { type: 'couldNotConnect', message: t('error_couldNotConnect', 'Sem conexão') });
        }

        __DEV__ && console.log(e);
        return;
      }
      throw e;
    }
  };

  const getErrorMessage = (errorType?: string) => {
    switch (errorType) {
      case 'notFound':
        return t('error_notFound', 'Email não encontrado');
      case 'incorrect':
        return t('error_incorrect', 'Senha incorreta');
      case 'couldNotConnect':
        return t('error_couldNotConnect', 'Sem conexão com servidor');
      case 'required':
        return t('error_required', 'Campo obrigatório');
      default:
        return t('error', 'Erro desconhecido');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Language Selector */}
        <View style={styles.languageContainer}>
          <ChangeLanguageButtons />
        </View>

        {/* Logo/Icon Section */}
        <AnimatedView entering={FadeInDown} style={styles.header}>
          <Surface style={styles.logoSurface} elevation={2}>
            <MaterialCommunityIcons 
              name="lightning-bolt-circle" 
              size={80} 
              color={theme.colors.primary} 
            />
          </Surface>
          <Text variant="headlineLarge" style={styles.title}>
            {t('login.login')}
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            {t('login.enterCredentials')}
          </Text>
        </AnimatedView>

        {/* Form Card */}
        <AnimatedView entering={FadeInUp.delay(200)} style={styles.formContainer}>
          <AppCard style={styles.formCard}>
            {/* Internet Notice */}
            <View style={styles.notice}>
              <MaterialCommunityIcons 
                name="wifi-alert" 
                size={20} 
                color={theme.colors.outline} 
              />
              <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
                {t('login.internetAccess')}
              </Text>
            </View>

            {/* Email Field */}
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label={t('email')}
                  placeholder={t('emailPlaceholder')}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon="email"
                  errorMessage={errors.email ? getErrorMessage(errors.email.type) : undefined}
                  style={styles.input}
                />
              )}
              name="email"
            />

            {/* Password Field */}
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  label={t('password')}
                  placeholder={t('passwordPlaceholder')}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  leftIcon="lock"
                  errorMessage={errors.password ? getErrorMessage(errors.password.type) : undefined}
                  style={styles.input}
                />
              )}
              name="password"
            />

            {/* Root Error */}
            {errors.root && (
              <View style={styles.errorContainer}>
                <MaterialCommunityIcons 
                  name="alert-circle" 
                  size={20} 
                  color={theme.colors.error} 
                />
                <Text variant="bodySmall" style={{ color: theme.colors.error }}>
                  {errors.root?.message || t('login.error')}
                </Text>
              </View>
            )}

            {/* Submit Button */}
            <AppButton
              mode="primary"
              onPress={handleSubmit(onSubmit)}
              loading={isSubmitting}
              icon="login"
              style={styles.submitButton}
            >
              {t('login.connect')}
            </AppButton>
          </AppCard>
        </AnimatedView>

        {/* Footer */}
        <AnimatedView entering={FadeInUp.delay(400)} style={styles.footer}>
          <Text variant="bodySmall" style={{ color: themeColors.outline }}>
            Smart Cube v1.2.0
          </Text>
        </AnimatedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  languageContainer: {
    alignItems: 'flex-end',
    marginBottom: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoSurface: {
    width: 120,
    height: 120,
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: themeColors.surface,
  },
  title: {
    fontWeight: '700',
    color: themeColors.onBackground,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: themeColors.onSurfaceVariant,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  formCard: {
    padding: spacing.md,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: themeColors.surfaceVariant,
    borderRadius: borderRadius.md,
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
  footer: {
    marginTop: 'auto',
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
});
