/**
 * Search Screen - Redesign Fase 5
 * Tela de busca de medidores com Material Design 3
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
import { colors as themeColors, spacing, borderRadius } from '../../theme';

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type SearchProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Search'>,
  NativeStackScreenProps<RootStackParamList>
>;

const perPage = 8;

interface MeterData {
  id: string;
  name: string;
  location: string;
}

export default function Search({ navigation, route }: SearchProps) {
  useStatusBar({ style: 'light' });
  const { t } = useTranslation();
  
  const filter = route.params?.filter || '';
  const [searchQuery, setSearchQuery] = React.useState(filter);

  const { data, fetchNextPage, isFinished, isRefreshing, refresh } =
    useInfiniteQuery(
      (pageParam: string) =>
        dbQuery<MeterData>(
          `SELECT *
          FROM meters 
          WHERE UPPER(name) LIKE UPPER(?) AND name > ?
          ORDER BY name LIMIT ?`,
          [`%${filter}%`, pageParam, perPage]
        ),
      (lastPage) => {
        if (lastPage == null) return '';
        if (lastPage.rows.length < perPage) return null;
        return lastPage.rows[lastPage.rows.length - 1].name;
      },
      [filter],
      { isDisabled: filter.length < 3 }
    );

  const flatData = data.reduce<MeterData[]>(
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
            <MaterialCommunityIcons name="lightning-bolt-outline" size={28} color="rgba(255,255,255,0.9)" />
          </View>
          <View>
            <Text style={styles.headerSubtitle}>{t('search.meters', 'Medidores')}</Text>
            <Text style={styles.headerTitle}>{t('search.search', 'Busca')}</Text>
          </View>
        </View>
        <View style={styles.searchWrap}>
          <MaterialCommunityIcons name="magnify" size={20} color={themeColors.onSurfaceVariant} style={styles.searchIcon} />
          <TextInput
            placeholder={t('search.typeId', 'Buscar por nome...')}
            placeholderTextColor={themeColors.outline}
            onChangeText={setSearchQuery}
            value={searchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <MaterialCommunityIcons
              name="close-circle"
              size={18}
              color={themeColors.outline}
              onPress={() => { setSearchQuery(''); navigation.setParams({ filter: '' }); }}
            />
          )}
        </View>
        {searchQuery.length > 0 && searchQuery.length < 3 && (
          <Text style={styles.searchHint}>
            {t('search.minChars', 'Mínimo 3 caracteres')}
          </Text>
        )}
      </View>

      {/* Lista de resultados */}
      <FlatList
        data={flatData}
        contentContainerStyle={styles.listContent}
        onEndReached={() => !isFinished && fetchNextPage()}
        refreshing={isRefreshing}
        onRefresh={refresh}
        keyExtractor={({ id }) => id}
        ListHeaderComponent={
          <Text variant="titleMedium" style={styles.sectionTitle}>
            {t('search.meters')}
          </Text>
        }
        ListFooterComponent={
          !isFinished ? (
            <View style={styles.footerLoading}>
              <ActivityIndicator />
            </View>
          ) : null
        }
        ListEmptyComponent={
          filter.length >= 3 && flatData.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="magnify-close" size={48} color={themeColors.outline} />
              <Text variant="bodyMedium" style={{ color: themeColors.outline }}>
                {t('search.noResults', 'No meters found')}
              </Text>
            </View>
          ) : filter.length < 3 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="magnify" size={48} color={themeColors.outline} />
              <Text variant="bodyMedium" style={{ color: themeColors.outline }}>
                {t('search.minChars')}
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item, index }) => (
          <ListItem
            location={item.location}
            name={item.name}
            index={index}
            onPress={() => navigation.navigate('Meter', { id: item.id })}
          />
        )}
      />
    </View>
  );
}

interface ListItemProps {
  location: string;
  name: string;
  index: number;
  onPress: () => void;
}

const ListItem = memo(({ location, name, index, onPress }: ListItemProps) => {
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
          <View style={styles.row}>
            <View style={styles.meterIconWrap}>
              <MaterialCommunityIcons name="lightning-bolt" size={20} color={themeColors.primary} />
            </View>
            <View style={styles.meterInfo}>
              <Text variant="bodySmall" style={styles.label}>
                {t('search.meter', 'Medidor')}
              </Text>
              <Text variant="titleSmall" style={styles.meterName}>
                {name}
              </Text>
            </View>
            <View style={styles.locationTag}>
              <MaterialCommunityIcons name="map-marker" size={12} color={themeColors.secondary} />
              <Text style={styles.locationText} numberOfLines={1}>
                {location}
              </Text>
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
  searchHint: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
    marginTop: spacing.sm,
    marginLeft: spacing.xs,
  },
  listContent: {
    padding: spacing.md,
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: spacing.sm,
    color: themeColors.onBackground,
  },
  itemContainer: {
    marginBottom: spacing.sm,
  },
  cardContent: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  meterIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: themeColors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  meterInfo: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: themeColors.onSurfaceVariant,
    marginBottom: 2,
  },
  meterName: {
    fontWeight: '700',
    color: themeColors.primary,
    fontSize: 14,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: themeColors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    maxWidth: 110,
  },
  locationText: {
    fontSize: 11,
    color: themeColors.secondary,
    fontWeight: '500',
    flexShrink: 1,
  },
  divider: {
    height: 1,
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
