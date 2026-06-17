/**
 * Design Tokens - Espaçamento
 * 8px grid system com multiplicadores
 */

// Base spacing unit (8px)
export const baseUnit = 8;

// Spacing scale
export const spacing = {
  none: 0,
  xs: baseUnit * 0.5,  // 4px
  sm: baseUnit,        // 8px
  md: baseUnit * 1.5,  // 12px
  lg: baseUnit * 2,    // 16px
  xl: baseUnit * 3,    // 24px
  '2xl': baseUnit * 4, // 32px
  '3xl': baseUnit * 6, // 48px
  '4xl': baseUnit * 8, // 64px
  '5xl': baseUnit * 12, // 96px
  '6xl': baseUnit * 16, // 128px
} as const;

// Border radius
export const borderRadius = {
  none: 0,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
} as const;

// Elevação (sombras)
export const elevation = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  level1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  
  level2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  
  level3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  
  level4: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  
  level5: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 16,
  },
} as const;

// Layout constants
export const layout = {
  // Max widths
  maxWidth: 600,
  
  // Safe areas
  safeAreaTop: 44,
  safeAreaBottom: 34,
  
  // Header heights
  headerHeight: 56,
  headerHeightLarge: 64,
  
  // Bottom tab height
  bottomTabHeight: 80,
  
  // Input heights
  inputHeight: 48,
  inputHeightLarge: 56,
  
  // Button heights
  buttonHeight: 48,
  buttonHeightSmall: 36,
  buttonHeightLarge: 56,
  
  // Icon sizes
  iconSize: {
    xs: 12,
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
    '2xl': 64,
  },
  
  // Avatar sizes
  avatarSize: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
    '2xl': 120,
  },
} as const;

// Z-index
export const zIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
} as const;

// Exportação combinada
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Elevation = typeof elevation;
