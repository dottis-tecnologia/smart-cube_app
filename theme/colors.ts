/**
 * Design Tokens - Cores
 * Material Design 3 com identidade visual Smart Cube
 */

// Cores primárias da marca
export const brandColors = {
  primary: '#006C9C',
  primaryContainer: '#C4E7FF',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#001E2F',
  
  secondary: '#4C616B',
  secondaryContainer: '#CFE6F1',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#081E27',
  
  tertiary: '#5C5B7E',
  tertiaryContainer: '#E2DFFF',
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#191837',
} as const;

// Cores semânticas
export const semanticColors = {
  success: '#2E7D32',
  successContainer: '#C8E6C9',
  onSuccess: '#FFFFFF',
  onSuccessContainer: '#1B5E20',
  
  warning: '#ED6C02',
  warningContainer: '#FFF3E0',
  onWarning: '#FFFFFF',
  onWarningContainer: '#E65100',
  
  error: '#D32F2F',
  errorContainer: '#FFCDD2',
  onError: '#FFFFFF',
  onErrorContainer: '#B71C1C',
  
  info: '#0288D1',
  infoContainer: '#E1F5FE',
  onInfo: '#FFFFFF',
  onInfoContainer: '#01579B',
} as const;

// Cores neutras
export const neutralColors = {
  surface: '#FFFFFF',
  surfaceVariant: '#E7E0EC',
  surfaceDim: '#DED8E1',
  surfaceBright: '#FEF7FF',
  
  onSurface: '#1C1B1F',
  onSurfaceVariant: '#49454F',
  
  outline: '#79747E',
  outlineVariant: '#CAC4D0',
  
  background: '#FFFBFE',
  onBackground: '#1C1B1F',
  
  scrim: '#000000',
  shadow: '#000000',
  
  inverseSurface: '#313033',
  inverseOnSurface: '#F4EFF4',
  inversePrimary: '#7BD0FF',
} as const;

// Cores de superfície adicionais
export const surfaceColors = {
  surface1: '#FFFBFE',
  surface2: '#F7F2FA',
  surface3: '#F2EFF4',
  surface4: '#EEEBF0',
  surface5: '#E9E6EB',
} as const;

// Paleta completa para o tema Material You
export const materialYouPalette = {
  ...brandColors,
  ...semanticColors,
  ...neutralColors,
  ...surfaceColors,
} as const;

// Cores específicas do app Smart Cube
export const appColors = {
  // Gradientes
  gradientPrimary: ['#006C9C', '#0091BD'] as const,
  gradientSecondary: ['#4C616B', '#6B8391'] as const,
  gradientSuccess: ['#2E7D32', '#4CAF50'] as const,
  gradientWarning: ['#ED6C02', '#FF9800'] as const,
  gradientError: ['#D32F2F', '#EF5350'] as const,
  
  // Cores de status de sync
  synced: '#2E7D32',
  pending: '#ED6C02',
  unsynced: '#D32F2F',
  
  // Cores de leitura
  readingCardSynced: '#E8F5E9',
  readingCardPending: '#FFF3E0',
  readingCardError: '#FFEBEE',
} as const;

// Exportação única
export const colors = {
  ...materialYouPalette,
  ...appColors,
} as const;

export type Colors = typeof colors;
