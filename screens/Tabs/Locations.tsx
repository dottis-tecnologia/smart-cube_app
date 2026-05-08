/**
 * Locations Screen - Redesign Fase 5
 * Tela de locais com Material Design 3
 */

import React from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { Text, useTheme, ActivityIndicator, Searchbar } from 'react-native-paper';
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
  useStatusBar({ style: 'dark' });
  const theme = useTheme();
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
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.secondary }]}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          {t('location.location').toUpperCase()}
        </Text>
        
        <Searchbar
          placeholder={t('location.typeLocation')}
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
        />
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
              {t('location.locations', 'Locais')}
            </Text>
            <Text variant="bodySmall" style={styles.resultCount}>
              {flatData.length} {t('location.found', 'encontrados')}
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
                  ? t('location.noResults', 'Nenhum local encontrado')
                  : t('location.typeToSearch', 'Digite para buscar locais')
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
  const theme = useTheme();

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
          {/* Location Row */}
          <View style={styles.locationRow}>
            <View style={styles.locationIcon}>
              <MaterialCommunityIcons name="map-marker" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.locationInfo}>
              <Text variant="bodySmall" style={styles.locationLabel}>
                {t('location.location', 'Localização')}
              </Text>
              <Text variant="titleMedium" style={styles.locationName} numberOfLines={1}>
                {location}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: theme.colors.surfaceVariant }]} />

          {/* Meters Count Row */}
          <View style={styles.metersRow}>
            <MaterialCommunityIcons name="lightning-bolt" size={20} color={theme.colors.secondary} />
            <Text variant="bodyMedium" style={styles.metersLabel}>
              {t('location.meters', 'Medidores')}
            </Text>
            <AppBadge 
              content={meterCount.toString()} 
              variant="primary"
              size="medium"
            />
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerTitle: {
    color: themeColors.onSecondary,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  searchBar: {
    backgroundColor: themeColors.surface,
    borderRadius: borderRadius.lg,
    elevation: 2,
  },
  searchInput: {
    fontSize: 16,
  },
  listContent: {
    padding: spacing.md,
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
    borderRadius: borderRadius.md,
    backgroundColor: themeColors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    color: themeColors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  locationName: {
    fontWeight: '600',
    color: themeColors.onSurface,
  },
  divider: {
    height: 1,
    marginHorizontal: spacing.lg,
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
