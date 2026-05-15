export const Colors = {
  // Primary backgrounds
  background: '#0A0A0F',
  backgroundSecondary: '#12121A',
  backgroundTertiary: '#1A1A25',
  surface: '#1E1E2A',
  surfaceElevated: '#252535',

  // Gold accent system
  gold: '#D4A853',
  goldLight: '#E8C97A',
  goldDark: '#B8892E',
  goldMuted: 'rgba(212, 168, 83, 0.15)',
  goldSubtle: 'rgba(212, 168, 83, 0.08)',

  // Semantic colors
  success: '#34D399',
  successMuted: 'rgba(52, 211, 153, 0.15)',
  error: '#F87171',
  errorMuted: 'rgba(248, 113, 113, 0.15)',
  warning: '#FBBF24',
  warningMuted: 'rgba(251, 191, 36, 0.15)',
  info: '#60A5FA',
  infoMuted: 'rgba(96, 165, 250, 0.15)',

  // Text hierarchy
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B8',
  textTertiary: '#6B6B80',
  textInverse: '#0A0A0F',

  // Borders & dividers
  border: 'rgba(255, 255, 255, 0.08)',
  borderLight: 'rgba(255, 255, 255, 0.12)',
  borderGold: 'rgba(212, 168, 83, 0.30)',

  // Gradients (as arrays)
  gradientGold: ['#D4A853', '#B8892E', '#9A6F1C'] as const,
  gradientDark: ['#1A1A25', '#12121A', '#0A0A0F'] as const,
  gradientCard: ['rgba(30, 30, 42, 0.8)', 'rgba(18, 18, 26, 0.9)'] as const,
  gradientSuccess: ['#34D399', '#059669'] as const,
  gradientPurple: ['#8B5CF6', '#6D28D9'] as const,
  gradientBlue: ['#3B82F6', '#1D4ED8'] as const,

  // Glass effect
  glass: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.10)',

  // Tab bar
  tabBarBg: 'rgba(10, 10, 15, 0.95)',
  tabBarActive: '#D4A853',
  tabBarInactive: '#6B6B80',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

export type ColorKeys = keyof typeof Colors;
