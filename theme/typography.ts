/**
 * Design Tokens - Tipografia
 * Material Design 3 Typography Scale
 */

import { TextStyle } from 'react-native';

// Tipo customizado com fontFamily obrigatória
export type MD3TextStyle = TextStyle & {
  fontFamily: string;
};

// Font families
export const fontFamilies = {
  regular: 'Roboto-Regular',
  medium: 'Roboto-Medium',
  bold: 'Roboto-Bold',
  light: 'Roboto-Light',
  thin: 'Roboto-Thin',
  black: 'Roboto-Black',
  italic: 'Roboto-Italic',
} as const;

// Font weights
export const fontWeights = {
  thin: '100' as const,
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  black: '900' as const,
};

// Font sizes - Material Design 3 scale
export const fontSizes = {
  displayLarge: 57,
  displayMedium: 45,
  displaySmall: 36,
  
  headlineLarge: 32,
  headlineMedium: 28,
  headlineSmall: 24,
  
  titleLarge: 22,
  titleMedium: 16,
  titleSmall: 14,
  
  bodyLarge: 16,
  bodyMedium: 14,
  bodySmall: 12,
  
  labelLarge: 14,
  labelMedium: 12,
  labelSmall: 11,
} as const;

// Line heights (tracking)
export const lineHeights = {
  displayLarge: 64,
  displayMedium: 52,
  displaySmall: 44,
  
  headlineLarge: 40,
  headlineMedium: 36,
  headlineSmall: 32,
  
  titleLarge: 28,
  titleMedium: 24,
  titleSmall: 20,
  
  bodyLarge: 24,
  bodyMedium: 20,
  bodySmall: 16,
  
  labelLarge: 20,
  labelMedium: 16,
  labelSmall: 16,
} as const;

// Letter spacing
export const letterSpacing = {
  displayLarge: -0.25,
  displayMedium: 0,
  displaySmall: 0,
  
  headlineLarge: 0,
  headlineMedium: 0,
  headlineSmall: 0,
  
  titleLarge: 0,
  titleMedium: 0.15,
  titleSmall: 0.1,
  
  bodyLarge: 0.5,
  bodyMedium: 0.25,
  bodySmall: 0.4,
  
  labelLarge: 0.1,
  labelMedium: 0.5,
  labelSmall: 0.5,
} as const;

// Typography styles completos
export const typography = {
  displayLarge: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.displayLarge,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.displayLarge,
    letterSpacing: letterSpacing.displayLarge,
  } as MD3TextStyle,
  
  displayMedium: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.displayMedium,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.displayMedium,
    letterSpacing: letterSpacing.displayMedium,
  } as MD3TextStyle,
  
  displaySmall: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.displaySmall,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.displaySmall,
    letterSpacing: letterSpacing.displaySmall,
  } as MD3TextStyle,
  
  headlineLarge: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.headlineLarge,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.headlineLarge,
    letterSpacing: letterSpacing.headlineLarge,
  } as MD3TextStyle,
  
  headlineMedium: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.headlineMedium,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.headlineMedium,
    letterSpacing: letterSpacing.headlineMedium,
  } as MD3TextStyle,
  
  headlineSmall: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.headlineSmall,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.headlineSmall,
    letterSpacing: letterSpacing.headlineSmall,
  } as MD3TextStyle,
  
  titleLarge: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.titleLarge,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.titleLarge,
    letterSpacing: letterSpacing.titleLarge,
  } as MD3TextStyle,
  
  titleMedium: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.titleMedium,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.titleMedium,
    letterSpacing: letterSpacing.titleMedium,
  } as MD3TextStyle,
  
  titleSmall: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.titleSmall,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.titleSmall,
    letterSpacing: letterSpacing.titleSmall,
  } as MD3TextStyle,
  
  bodyLarge: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.bodyLarge,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.bodyLarge,
    letterSpacing: letterSpacing.bodyLarge,
  } as MD3TextStyle,
  
  bodyMedium: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.bodyMedium,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.bodyMedium,
    letterSpacing: letterSpacing.bodyMedium,
  } as MD3TextStyle,
  
  bodySmall: {
    fontFamily: fontFamilies.regular,
    fontSize: fontSizes.bodySmall,
    fontWeight: fontWeights.regular,
    lineHeight: lineHeights.bodySmall,
    letterSpacing: letterSpacing.bodySmall,
  } as MD3TextStyle,
  
  labelLarge: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.labelLarge,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.labelLarge,
    letterSpacing: letterSpacing.labelLarge,
  } as MD3TextStyle,
  
  labelMedium: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.labelMedium,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.labelMedium,
    letterSpacing: letterSpacing.labelMedium,
  } as MD3TextStyle,
  
  labelSmall: {
    fontFamily: fontFamilies.medium,
    fontSize: fontSizes.labelSmall,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.labelSmall,
    letterSpacing: letterSpacing.labelSmall,
  } as MD3TextStyle,
} as const;

// Variações úteis
export const typographyEmphasis = {
  headlineMediumBold: {
    ...typography.headlineMedium,
    fontFamily: fontFamilies.bold,
    fontWeight: fontWeights.bold,
  } as MD3TextStyle,
  
  titleLargeBold: {
    ...typography.titleLarge,
    fontFamily: fontFamilies.bold,
    fontWeight: fontWeights.bold,
  } as MD3TextStyle,
  
  bodyLargeMedium: {
    ...typography.bodyLarge,
    fontFamily: fontFamilies.medium,
    fontWeight: fontWeights.medium,
  } as MD3TextStyle,
  
  bodySmallBold: {
    ...typography.bodySmall,
    fontFamily: fontFamilies.bold,
    fontWeight: fontWeights.bold,
  } as MD3TextStyle,
} as const;

export type Typography = typeof typography;
export type TypographyVariant = keyof typeof typography;
