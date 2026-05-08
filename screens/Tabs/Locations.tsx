/**
 * Locations Screen - Redesign Fase 5
 * Tela de locais com Material Design 3
 */

import React from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import { memo } from 'react';

import { TabParamList } from './Tabs';
import { RootStackParamList } from '../Root';
import { dbQuery } from '../../util/db';
import useInfiniteQuery from '../../hooks/useInfiniteQuery';
import { useTranslation } from 'react-i18next';
import useStatusBar from '../../hooks/useStatusBar';

import { AppCard, AppCardContent } from '../../components/ui/AppCard';
import { AppBadge } from '../../components/ui/AppBadge';
import { colors as themeColors, spacing, borderRadius } from '../../theme';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type LocationsProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Locations'>,
  NativeStackScreenProps<RootStackParamList>
>;

const perPage = 8;

interface LocationData {
  location: string;
  meterCount: number;
}

export default function Locations({ navigation, route }: LocationsProps) {
  useStatusBar({ style: 'light' });
  const { t } = useTranslation();
  
  const filter = route.params?.filter || '';
  const [searchQuery, setSearchQuery] = React.useState(filter);

  const { data, fetchNextPage, isFinished, isRefreshing, refresh } =
    useInfiniteQuery(
      (pageParam: string) =>
        dbQuery<LocationData>(
          `SELECT count(id) as meterCount, location 
          FROM meters 
          WHERE UPPER(location) LIKE UPPER(?) 
          GROUP BY location 
          HAVING location > ? 
          ORDER BY location LIMIT ?`,
          [`%${filter}%`, pageParam, perPage]
        ),
      (lastPage) => {
        if (lastPage == null) return '';
        if (lastPage.rows.length < perPage) return null;
        return lastPage.rows[lastPage.rows.length - 1].location;
      },
      [filter]
    );

  const flatData = data.reduce<LocationData[]>(
    (prev, curr) => [...prev, ...curr.rows],
    []
  );

  const handleSearch = () => {
    navigation.setParams({ filter: searchQuery });
  };

  return (
    <View style={styles.container}>
      {/* Header moderno */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerIconWrap}>
            <MaterialCommunityIcons name="map-marker-multiple" size={28} color="rgba(255,255,255,0.9)" />
          </View>
          <View>
            <Text style={styles.headerSubtitle}>{t('location.locations', 'Locais')}</Text>
            <Text style={styles.headerTitle}>{t('location.location', 'Localizações')}</Text>
          </View>
        </View>
        <View style={styles.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={20} color={themeColors.onSurfaceVariant} style={styles.searchIcon} />
          <TextInput
            placeholder={t('location.typeLocation', 'Buscar local...')}
            placeholderTextColor={themeColors.outline}
            onChangeText={setSearchQuery}
            value={searchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Lista de locais */}
      <FlatList
        data={flatData}
        contentContainerStyle={styles.listContent}
        onEndReached={() => !isFinished && fetchNextPage()}
        refreshing={isRefreshing}
        onRefresh={refresh}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              {t('location.locations')}
            </Text>
            <Text variant="bodySmall" style={styles.resultCount}>
              {t('location.foundCount', { count: flatData.length })}
            </Text>
          </View>
        }
        ListFooterComponent={
          !isFinished ? (
            <View style={styles.footerLoading}>
              <ActivityIndicator />
            </View>
          ) : null
        }
        ListEmptyComponent={
          flatData.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="map-marker-off" size={48} color={themeColors.outline} />
              <Text variant="bodyMedium" style={{ color: themeColors.outline }}>
                {filter 
                  ? t('location.noResults', 'No locations found')
                  : t('location.typeToSearch')
                }
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item, index }) => (
          <ListItem
            location={item.location}
            meterCount={item.meterCount}
            index={index}
            onPress={() =>
              navigation.navigate('ListMeters', { location: item.location })
            }
          />
        )}
      />
    </View>
  );
}

interface ListItemProps {
  location: string;
  meterCount: number;
  index: number;
  onPress: () => void;
}

const ListItem = memo(({ location, meterCount, index, onPress }: ListItemProps) => {
  const { t } = useTranslation();

  return (
    <AnimatedPressable
      onPress={onPress}
      entering={FadeInLeft.delay(index * 50)}
      style={({ pressed }: { pressed: boolean }) => [
        styles.itemContainer,
        { transform: [{ scale: pressed ? 0.98 : 1 }] }
      ]}
    >
      <AppCard>
        <AppCardContent style={styles.cardContent}>
          <View style={styles.locationRow}>
            <View style={styles.locationIcon}>
              <MaterialCommunityIcons name="map-marker" size={22} color={themeColors.primary} />
            </View>
            <View style={styles.locationInfo}>
              <Text variant="bodySmall" style={styles.locationLabel}>
                {t('location.location', 'Local')}
              </Text>
              <Text variant="titleMedium" style={styles.locationName} numberOfLines={1}>
                {location}
              </Text>
            </View>
            <View style={styles.meterBadge}>
              <MaterialCommunityIcons name="lightning-bolt" size={14} color={themeColors.primary} />
              <Text style={styles.meterBadgeText}>{meterCount}</Text>
            </View>
          </View>
        </AppCardContent>
      </AppCard>
    </AnimatedPressable>
  );
});

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
  headerSubtitle: {
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
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    height: 48,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: themeColors.onSurface,
  },
  listContent: {
    padding: spacing.md,
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontWeight: '600',
    color: themeColors.onBackground,
  },
  resultCount: {
    color: themeColors.onSurfaceVariant,
  },
  itemContainer: {
    marginBottom: spacing.sm,
  },
  cardContent: {
    gap: spacing.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: themeColors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    color: themeColors.onSurfaceVariant,
    marginBottom: 2,
    fontSize: 11,
  },
  locationName: {
    fontWeight: '600',
    color: themeColors.onSurface,
  },
  meterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: themeColors.primaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  meterBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: themeColors.primary,
  },
  divider: {
    height: 1,
  },
  metersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metersLabel: {
    flex: 1,
    color: themeColors.onSurfaceVariant,
  },
  footerLoading: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl * 2,
    gap: spacing.md,
  },
});
