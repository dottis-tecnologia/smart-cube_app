/**
 * Design Tokens - Cores
 * Material Design 3 com identidade visual Smart Cube
 */

// Cores primárias da marca
export const brandColors = {
  primary: '#3D7AB5',
  primaryContainer: '#E8F1FA',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#1A3A5C',
  
  secondary: '#6B8CA8',
  secondaryContainer: '#EAF2F8',
  onSecondary: '#FFFFFF',
  onSecondaryContainer: '#1E3A4F',
  
  tertiary: '#7C7FA3',
  tertiaryContainer: '#EEEEF8',
  onTertiary: '#FFFFFF',
  onTertiaryContainer: '#2A2B4A',
} as const;

// Cores semânticas
export const semanticColors = {
  success: '#3A7D44',
  successContainer: '#E8F5EA',
  onSuccess: '#FFFFFF',
  onSuccessContainer: '#1B4A22',
  
  warning: '#B06B00',
  warningContainer: '#FFF4E0',
  onWarning: '#FFFFFF',
  onWarningContainer: '#5C3700',
  
  error: '#C0392B',
  errorContainer: '#FDECEA',
  onError: '#FFFFFF',
  onErrorContainer: '#7B1A13',
  
  info: '#2980B9',
  infoContainer: '#E8F4FC',
  onInfo: '#FFFFFF',
  onInfoContainer: '#0D4F7C',
} as const;

// Cores neutras
export const neutralColors = {
  surface: '#FFFFFF',
  surfaceVariant: '#F0F4F8',
  surfaceDim: '#E2E8EF',
  surfaceBright: '#FAFCFE',
  
  onSurface: '#1E2A35',
  onSurfaceVariant: '#4A5C6B',
  
  outline: '#8FA5B5',
  outlineVariant: '#D0DDE6',
  
  background: '#F5F8FB',
  onBackground: '#1E2A35',
  
  scrim: '#000000',
  shadow: '#000000',
  
  inverseSurface: '#2A3A47',
  inverseOnSurface: '#EEF3F7',
  inversePrimary: '#90BBDE',
} as const;

// Cores de superfície adicionais
export const surfaceColors = {
  surface1: '#FAFCFE',
  surface2: '#F5F8FB',
  surface3: '#EFF4F8',
  surface4: '#E8EFF5',
  surface5: '#E2EAF0',
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
  gradientPrimary: ['#3D7AB5', '#5A9BD6'] as const,
  gradientSecondary: ['#6B8CA8', '#8AAFC8'] as const,
  gradientSuccess: ['#3A7D44', '#5A9E65'] as const,
  gradientWarning: ['#B06B00', '#D4860A'] as const,
  gradientError: ['#C0392B', '#D9534F'] as const,
  
  // Cores de status de sync
  synced: '#3A7D44',
  pending: '#B06B00',
  unsynced: '#C0392B',
  
  // Cores de leitura
  readingCardSynced: '#EDF7EE',
  readingCardPending: '#FFF5E0',
  readingCardError: '#FDECEA',
} as const;

// Exportação única
export const colors = {
  ...materialYouPalette,
  ...appColors,
} as const;

export type Colors = typeof colors;
