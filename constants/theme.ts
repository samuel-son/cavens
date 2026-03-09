/**
 * Premium bank-grade theme for Cavens Savings App
 * Minimal, modern, currency-agnostic design
 */

import { Platform } from 'react-native';

// Premium palette - trusted, calm, professional
const primaryLight = '#0D47A1';
const primaryDark = '#42A5F5';
const successLight = '#1B5E20';
const successDark = '#66BB6A';
const warningLight = '#E65100';
const warningDark = '#FFA726';

export const Colors = {
  light: {
    text: '#1A1A2E',
    textSecondary: '#4A4A68',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    tint: primaryLight,
    primary: primaryLight,
    success: successLight,
    warning: warningLight,
    error: '#B71C1C',
    icon: '#64748B',
    tabIconDefault: '#94A3B8',
    tabIconSelected: primaryLight,
    border: '#E2E8F0',
    pinDot: primaryLight,
    cardShadow: 'rgba(13, 71, 161, 0.08)',
  },
  dark: {
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    background: '#0F172A',
    surface: '#1E293B',
    surfaceElevated: '#334155',
    tint: primaryDark,
    primary: primaryDark,
    success: successDark,
    warning: warningDark,
    error: '#EF5350',
    icon: '#94A3B8',
    tabIconDefault: '#64748B',
    tabIconSelected: primaryDark,
    border: '#334155',
    pinDot: primaryDark,
    cardShadow: 'rgba(0, 0, 0, 0.3)',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
