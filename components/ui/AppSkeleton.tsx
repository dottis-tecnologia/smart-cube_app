/**
 * AppSkeleton Component
 * Loading skeleton com animação shimmer
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from 'react-native-paper';
import { spacing, borderRadius } from '../../theme';

type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

interface AppSkeletonProps {
  variant?: SkeletonVariant;
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export function AppSkeleton({
  variant = 'text',
  width,
  height,
  style,
}: AppSkeletonProps) {
  const theme = useTheme();
  const shimmerValue = useSharedValue(0);

  React.useEffect(() => {
    shimmerValue.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmerValue.value, [0, 0.5, 1], [0.3, 0.7, 0.3]),
  }));

  const screenWidth = Dimensions.get('window').width;
  
  const getDimensions = () => {
    const finalWidth = width ?? screenWidth - 32;
    
    switch (variant) {
      case 'text':
        return {
          width: finalWidth,
          height: height || 16,
          borderRadius: borderRadius.sm,
        };
      case 'circular':
        const size = height || 40;
        return {
          width: size,
          height: size,
          borderRadius: size / 2,
        };
      case 'rectangular':
        return {
          width: finalWidth,
          height: height || 100,
          borderRadius: borderRadius.none,
        };
      case 'rounded':
        return {
          width: finalWidth,
          height: height || 100,
          borderRadius: borderRadius.lg,
        };
      default:
        return {
          width: finalWidth,
          height: height || 16,
          borderRadius: borderRadius.sm,
        };
    }
  };

  const dimensions = getDimensions();

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width: dimensions.width,
          height: dimensions.height,
          borderRadius: dimensions.borderRadius,
          backgroundColor: theme.colors.surfaceVariant,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

// Skeleton para listas
interface SkeletonListProps {
  count?: number;
  itemHeight?: number;
  style?: ViewStyle;
}

export function SkeletonList({ count = 5, itemHeight = 80, style }: SkeletonListProps) {
  const screenWidth = Dimensions.get('window').width;
  
  return (
    <View style={style}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.listItem}>
          <AppSkeleton variant="circular" height={48} />
          <View style={styles.listContent}>
            <AppSkeleton variant="text" width={screenWidth * 0.6} height={16} />
            <AppSkeleton variant="text" width={screenWidth * 0.4} height={12} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    marginBottom: spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  listContent: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
});
