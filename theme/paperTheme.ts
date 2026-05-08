/**
 * React Native Paper Theme
 * Material Design 3 (Material You) Theme Configuration
 */

import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';
import { colors } from './colors';

// Tema Light Material You
export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  
  colors: {
    ...MD3LightTheme.colors,
    
    // Primary
    primary: colors.primary,
    onPrimary: colors.onPrimary,
    primaryContainer: colors.primaryContainer,
    onPrimaryContainer: colors.onPrimaryContainer,
    
    // Secondary
    secondary: colors.secondary,
    onSecondary: colors.onSecondary,
    secondaryContainer: colors.secondaryContainer,
    onSecondaryContainer: colors.onSecondaryContainer,
    
    // Tertiary
    tertiary: colors.tertiary,
    onTertiary: colors.onTertiary,
    tertiaryContainer: colors.tertiaryContainer,
    onTertiaryContainer: colors.onTertiaryContainer,
    
    // Error
    error: colors.error,
    onError: colors.onError,
    errorContainer: colors.errorContainer,
    onErrorContainer: colors.onErrorContainer,
    
    // Surface
    surface: colors.surface,
    onSurface: colors.onSurface,
    surfaceVariant: colors.surfaceVariant,
    onSurfaceVariant: colors.onSurfaceVariant,
    surfaceDisabled: `${colors.onSurface}1F`, // 12% opacity
    onSurfaceDisabled: `${colors.onSurface}61`, // 38% opacity
    
    // Background
    background: colors.background,
    onBackground: colors.onBackground,
    
    // Outline
    outline: colors.outline,
    outlineVariant: colors.outlineVariant,
    
    // Inverse
    inverseSurface: colors.inverseSurface,
    inverseOnSurface: colors.inverseOnSurface,
    inversePrimary: colors.inversePrimary,
    
    // Scrim/Shadow
    scrim: colors.scrim,
    shadow: colors.shadow,
    
    // Elevation surface tints
    elevation: {
      level0: colors.surface,
      level1: colors.surface1,
      level2: colors.surface2,
      level3: colors.surface3,
      level4: colors.surface4,
      level5: colors.surface5,
    },
  },
  
  fonts: {
    ...MD3LightTheme.fonts,
  },
  
  roundness: 12,
  animation: {
    scale: 1.0,
    defaultAnimationDuration: 200,
  },
};

// Tema Dark Material You
export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  
  colors: {
    ...MD3DarkTheme.colors,
    
    // Primary - ajustado para modo escuro
    primary: colors.inversePrimary,
    onPrimary: colors.onPrimaryContainer,
    primaryContainer: colors.onPrimaryContainer,
    onPrimaryContainer: colors.primaryContainer,
    
    // Secondary - ajustado para modo escuro
    secondary: '#97B0BC',
    onSecondary: colors.onSecondaryContainer,
    secondaryContainer: colors.onSecondaryContainer,
    onSecondaryContainer: colors.secondaryContainer,
    
    // Tertiary
    tertiary: '#C6C2F0',
    onTertiary: colors.onTertiaryContainer,
    tertiaryContainer: colors.onTertiaryContainer,
    onTertiaryContainer: colors.tertiaryContainer,
    
    // Error
    error: '#FFB4AB',
    onError: '#690005',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    
    // Surface
    surface: '#141218',
    onSurface: '#E6E0E9',
    surfaceVariant: '#49454F',
    onSurfaceVariant: '#CAC4D0',
    surfaceDisabled: `${'#E6E0E9'}1F`,
    onSurfaceDisabled: `${'#E6E0E9'}61`,
    
    // Background
    background: '#141218',
    onBackground: '#E6E0E9',
    
    // Outline
    outline: '#938F99',
    outlineVariant: '#49454F',
    
    // Inverse
    inverseSurface: '#E6E0E9',
    inverseOnSurface: '#322F33',
    inversePrimary: colors.primary,
    
    // Elevation
    elevation: {
      level0: '#141218',
      level1: '#1C1B1F',
      level2: '#232227',
      level3: '#2B2930',
      level4: '#323138',
      level5: '#3A3841',
    },
  },
  
  fonts: {
    ...MD3DarkTheme.fonts,
  },
  
  roundness: 12,
  animation: {
    scale: 1.0,
    defaultAnimationDuration: 200,
  },
};

// Theme type export
export type AppTheme = typeof lightTheme;
