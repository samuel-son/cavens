import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme/colors';
import { BorderRadius, Spacing } from '../../theme/spacing';
import { TextStyles } from '../../theme/typography';

interface GradientButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'gold' | 'success' | 'purple' | 'blue' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

const GRADIENT_MAP = {
  gold: Colors.gradientGold,
  success: Colors.gradientSuccess,
  purple: Colors.gradientPurple,
  blue: Colors.gradientBlue,
};

export function GradientButton({
  title, onPress, variant = 'gold', size = 'md',
  disabled = false, loading = false, style, icon,
}: GradientButtonProps) {
  const height = size === 'sm' ? 40 : size === 'lg' ? 56 : 48;
  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 17 : 15;

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress} disabled={disabled || loading}
        style={[styles.outline, { height, opacity: disabled ? 0.5 : 1 }, style]}
        activeOpacity={0.7}
      >
        {icon}
        {loading ? (
          <ActivityIndicator color={Colors.gold} size="small" />
        ) : (
          <Text style={[styles.outlineText, { fontSize }]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  const colors = GRADIENT_MAP[variant] || GRADIENT_MAP.gold;

  return (
    <TouchableOpacity
      onPress={onPress} disabled={disabled || loading}
      activeOpacity={0.8}
      style={[{ opacity: disabled ? 0.5 : 1, borderRadius: BorderRadius.lg, overflow: 'hidden' }, style]}
    >
      <LinearGradient
        colors={[...colors]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={[styles.gradient, { height }]}
      >
        {icon}
        {loading ? (
          <ActivityIndicator color={Colors.textPrimary} size="small" />
        ) : (
          <Text style={[styles.text, { fontSize }]}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  text: {
    ...TextStyles.button,
    color: Colors.textInverse,
  },
  outline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    gap: Spacing.sm,
  },
  outlineText: {
    ...TextStyles.button,
    color: Colors.gold,
  },
});
