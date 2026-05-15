import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'gold' | 'elevated';
}

export function GlassCard({ children, style, variant = 'default' }: GlassCardProps) {
  const borderColor =
    variant === 'gold' ? Colors.borderGold :
    variant === 'elevated' ? Colors.borderLight :
    Colors.glassBorder;

  const bg =
    variant === 'gold' ? Colors.goldSubtle :
    variant === 'elevated' ? Colors.surfaceElevated :
    Colors.glass;

  return (
    <View style={[styles.card, { backgroundColor: bg, borderColor }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: 20,
    overflow: 'hidden',
  },
});
