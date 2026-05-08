/**
 * Search Screen - Redesign Fase 5
 * Tela de busca de medidores com Material Design 3
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
  useStatusBar({ style: 'dark' });
  const theme = useTheme();
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
      {/* Header com gradiente */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text variant="headlineSmall" style={styles.headerTitle}>
          {t('search.search').toUpperCase()}
        </Text>
        
        <Searchbar
          placeholder={t('search.typeId')}
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={handleSearch}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
        />
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
            {t('search.meters', 'Medidores')}
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
                {t('search.noResults', 'Nenhum medidor encontrado')}
              </Text>
            </View>
          ) : filter.length < 3 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="magnify" size={48} color={themeColors.outline} />
              <Text variant="bodyMedium" style={{ color: themeColors.outline }}>
                {t('search.minChars', 'Digite pelo menos 3 caracteres')}
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
          {/* Meter ID Row */}
          <View style={styles.row}>
            <MaterialCommunityIcons name="identifier" size={20} color={theme.colors.primary} />
            <Text variant="bodySmall" style={styles.label}>
              {t('search.meter', 'Medidor')}
            </Text>
            <Text variant="titleSmall" style={[styles.value, { color: theme.colors.primary }]}>
              {name}
            </Text>
          </View>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: theme.colors.surfaceVariant }]} />

          {/* Location Row */}
          <View style={styles.row}>
            <MaterialCommunityIcons name="map-marker" size={20} color={theme.colors.secondary} />
            <Text variant="bodySmall" style={styles.label}>
              {t('search.location', 'Localização')}
            </Text>
            <Text variant="bodyMedium" style={styles.value} numberOfLines={1}>
              {location}
            </Text>
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
    color: themeColors.onPrimary,
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
    gap: spacing.sm,
  },
  label: {
    flex: 1,
    color: themeColors.onSurfaceVariant,
  },
  value: {
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    marginHorizontal: spacing.lg,
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
