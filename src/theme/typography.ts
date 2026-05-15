import { Platform } from 'react-native';

export const Fonts = {
  // Font families
  regular: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'Inter, system-ui, sans-serif',
  }) as string,
  medium: Platform.select({
    ios: 'System',
    android: 'sans-serif-medium',
    default: 'Inter, system-ui, sans-serif',
  }) as string,
  bold: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'Outfit, system-ui, sans-serif',
  }) as string,
};

export const FontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const LineHeights = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
};

// Pre-built text styles
export const TextStyles = {
  h1: {
    fontSize: FontSizes['4xl'],
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes['4xl'] * LineHeights.tight,
    fontFamily: Fonts.bold,
  },
  h2: {
    fontSize: FontSizes['3xl'],
    fontWeight: FontWeights.bold,
    lineHeight: FontSizes['3xl'] * LineHeights.tight,
    fontFamily: Fonts.bold,
  },
  h3: {
    fontSize: FontSizes['2xl'],
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes['2xl'] * LineHeights.tight,
    fontFamily: Fonts.bold,
  },
  h4: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.xl * LineHeights.normal,
    fontFamily: Fonts.medium,
  },
  body: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.md * LineHeights.relaxed,
    fontFamily: Fonts.regular,
  },
  bodySmall: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.regular,
    lineHeight: FontSizes.sm * LineHeights.relaxed,
    fontFamily: Fonts.regular,
  },
  caption: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.xs * LineHeights.normal,
    fontFamily: Fonts.regular,
  },
  button: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    lineHeight: FontSizes.md * LineHeights.normal,
    fontFamily: Fonts.medium,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    lineHeight: FontSizes.sm * LineHeights.normal,
    fontFamily: Fonts.medium,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
};
