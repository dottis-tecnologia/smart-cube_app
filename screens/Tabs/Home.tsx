/**
 * Home Screen - Redesign Fase 3
 * Dashboard moderno com Material Design 3
 */

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Badge, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDistanceToNow, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInUp, FadeInLeft } from 'react-native-reanimated';

import { TabParamList } from './Tabs';
import { RootStackParamList } from '../Root';
import useQuery from '../../hooks/useQuery';
import { dbQuery } from '../../util/db';
import useAuth from '../../hooks/useAuth';
import useStatusBar from '../../hooks/useStatusBar';
import { useTranslation } from 'react-i18next';
import { nativeApplicationVersion } from 'expo-application';

import { AppCard, AppCardContent } from '../../components/ui/AppCard';
import { AppReadingCard, ReadingData } from '../../components/ui/AppReadingCard';
import { AppIconButton } from '../../components/ui/AppIconButton';
import { spacing, borderRadius, colors as themeColors } from '../../theme';
import ParallaxScroll from '../../components/ParallaxScroll';
import Logo from '../../assets/logo.svg';
import ChangeLanguageButtons from '../../components/ChangeLanguageButtons';

const AnimatedView = Animated.createAnimatedComponent(View);

const { width: screenWidth } = Dimensions.get('window');

export type HomeProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const getRecentReadings = (userId: string) =>
  dbQuery<ReadingData>(
    `SELECT readings.*, meters.name as meterName, meters.unit, meters.location, 
            readings.technicianName, readings.synchedAt as syncedAt
     FROM readings JOIN meters ON readings.meterId = meters.id 
     WHERE readings.technicianId = ? AND readings.createdAt > ? 
     ORDER BY createdAt DESC LIMIT 12;`,
    [userId, subDays(new Date(), 7).toISOString()]
  );

export default function Home({ navigation }: HomeProps) {
  useStatusBar({ style: 'dark' });
  const auth = useAuth();
  const { t, i18n } = useTranslation();
  
  const locale = i18n.language === 'pt' ? ptBR : undefined;

  const { data: readings } = useQuery(
    () => auth.userData && getRecentReadings(auth.userData.id),
    [auth.userData]
  );
  
  const { data: readingCount } = useQuery(
    () => dbQuery<{ count: number }>(
      "SELECT COUNT(*) as count FROM readings WHERE date(createdAt) = date('now');"
    ),
    []
  );

  const todayCount = readingCount?.rows[0]?.count || 0;

  // Header personalizado com gradiente
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerGradient}>
        {/* Staging Badge */}
        {process.env.EXPO_PUBLIC_STAGING && (
          <View style={styles.stagingBadge}>
            <Badge style={{ backgroundColor: themeColors.warning }}>STAGING</Badge>
          </View>
        )}

        {/* Logo */}
        <AnimatedView entering={FadeInUp} style={styles.logoContainer}>
          <Logo width={200} height={80} />
        </AnimatedView>

        {/* Idioma */}
        <AnimatedView entering={FadeInUp} style={styles.languageRow}>
          <ChangeLanguageButtons />
        </AnimatedView>

        {/* User Info */}
        <AnimatedView entering={FadeInUp} style={styles.userSection}>
          <View style={styles.userInfo}>
            <Avatar.Text 
              size={48} 
              label={auth.userData?.name?.charAt(0) || '?'} 
              style={{ backgroundColor: '#5A9BD6' }}
              labelStyle={{ color: '#fff', fontWeight: '700' }}
            />
            <View style={styles.userText}>
              <Text variant="bodySmall" style={{ color: themeColors.onSurfaceVariant }}>
                {t('welcome')}
              </Text>
              <Text variant="titleLarge" style={styles.userName}>
                {auth.userData?.name}
              </Text>
            </View>
          </View>
          
          <AppIconButton
            icon="logout"
            onPress={() => auth.signOut()}
            variant="secondary"
            size="medium"
          />
        </AnimatedView>

        {/* Stats Card */}
        <AnimatedView entering={FadeInUp.delay(200)} style={styles.statsContainer}>
          <AppCard style={styles.statsCard}>
            <AppCardContent style={{ ...styles.statsContent, flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="lightning-bolt" size={24} color={themeColors.primary} />
                <View>
                  <Text variant="headlineMedium" style={{ color: themeColors.primary, fontWeight: '700' }}>
                    {todayCount}
                  </Text>
                  <Text variant="bodySmall" style={{ color: themeColors.onSurfaceVariant }}>
                    {t('home.readingsToday')}
                  </Text>
                </View>
              </View>
              
              <View style={styles.statDivider} />
              
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="calendar-week" size={24} color={themeColors.secondary} />
                <View>
                  <Text variant="headlineMedium" style={{ color: themeColors.secondary, fontWeight: '700' }}>
                    {readings?.rows.length || 0}
                  </Text>
                  <Text variant="bodySmall" style={{ color: themeColors.onSurfaceVariant }}>
                    {t('home.readingsWeek')}
                  </Text>
                </View>
              </View>
            </AppCardContent>
          </AppCard>
        </AnimatedView>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ParallaxScroll
        header={renderHeader()}
        style={styles.parallax}
      >
        <View style={styles.content}>
          {/* Section Title */}
          <AnimatedView entering={FadeInLeft.delay(300)} style={styles.sectionHeader}>
            <MaterialCommunityIcons name="history" size={20} color={themeColors.primary} />
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {t('home.latestReadings')}
            </Text>
          </AnimatedView>

          {/* Readings List */}
          <View style={styles.readingsList}>
            {readings?.rows.map((reading, index) => (
              <AnimatedView 
                key={reading.id} 
                entering={FadeInUp.delay(400 + index * 50)}
              >
                <AppReadingCard
                  reading={reading}
                  onPress={() => navigation.navigate('Reading', { id: reading.id })}
                />
              </AnimatedView>
            ))}
            
            {(!readings?.rows.length) && (
              <AnimatedView entering={FadeInUp.delay(400)} style={styles.emptyState}>
                <MaterialCommunityIcons 
                  name="inbox-outline" 
                  size={64} 
                  color={themeColors.outline} 
                />
                <Text variant="titleMedium" style={{ color: themeColors.onSurfaceVariant, marginTop: spacing.md }}>
                  {t('home.noReadings')}
                </Text>
                <Text variant="bodyMedium" style={{ color: themeColors.outline, textAlign: 'center' }}>
                  {t('home.scanToStart')}
                </Text>
              </AnimatedView>
            )}
          </View>

          {/* Version */}
          {nativeApplicationVersion && (
            <Text variant="bodySmall" style={styles.version}>
              v{nativeApplicationVersion}
            </Text>
          )}
        </View>
      </ParallaxScroll>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
  },
  parallax: {
    flex: 1,
  },
  headerContainer: {
    height: 360,
  },
  headerGradient: {
    flex: 1,
    backgroundColor: themeColors.primaryContainer,
    paddingTop: 52,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  stagingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  userSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  userText: {
    justifyContent: 'center',
  },
  userName: {
    color: themeColors.onPrimaryContainer,
    fontWeight: '600',
  },
  statsContainer: {
    marginTop: 'auto',
  },
  statsCard: {
    marginHorizontal: 0,
    elevation: 4,
  },
  statsContent: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: themeColors.outlineVariant,
    marginHorizontal: spacing.md,
  },
  content: {
    backgroundColor: themeColors.background,
    minHeight: screenWidth,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.md,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontWeight: '600',
    color: themeColors.onBackground,
  },
  readingsList: {
    gap: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  languageRow: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  version: {
    textAlign: 'center',
    color: themeColors.outline,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
});
