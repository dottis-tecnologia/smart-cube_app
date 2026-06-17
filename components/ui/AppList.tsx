/**
 * AppList Component
 * Lista moderna com scroll performance
 */

import React from 'react';
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  View,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from 'react-native-paper';
import { spacing } from '../../theme';
import { AppEmptyState } from './AppEmptyState';
import { SkeletonList } from './AppSkeleton';

type ListVariant = 'cards' | 'compact' | 'minimal';

interface AppListProps<T> {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  variant?: ListVariant;
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
  hasMore?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  headerComponent?: React.ReactElement | null;
  footerComponent?: React.ReactElement | null;
  contentContainerStyle?: any;
}

export function AppList<T>({
  data,
  renderItem,
  keyExtractor,
  variant = 'cards',
  loading = false,
  refreshing = false,
  onRefresh,
  onEndReached,
  hasMore = false,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  headerComponent,
  footerComponent,
  contentContainerStyle,
}: AppListProps<T>) {
  const theme = useTheme();

  const getItemLayout = (_: any, index: number) => ({
    length: variant === 'cards' ? 100 : 72,
    offset: (variant === 'cards' ? 100 : 72) * index,
    index,
  });

  const renderFooter = () => {
    if (!hasMore) return footerComponent || null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  };

  if (loading) {
    return <SkeletonList count={5} />;
  }

  if (data.length === 0 && emptyTitle) {
    return (
      <View style={styles.emptyContainer}>
        {headerComponent}
        <AppEmptyState
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={emptyActionLabel}
          onAction={onEmptyAction}
        />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        ) : undefined
      }
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      ListHeaderComponent={headerComponent}
      ListFooterComponent={renderFooter}
      contentContainerStyle={[
        styles.contentContainer,
        contentContainerStyle,
      ]}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: spacing.sm,
  },
  footer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
  },
});
