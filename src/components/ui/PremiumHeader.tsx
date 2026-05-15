import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../theme/colors';
import { Spacing } from '../../theme/spacing';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PremiumHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

export function PremiumHeader({ title, subtitle, rightElement }: PremiumHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['rgba(212,168,83,0.08)', 'rgba(212,168,83,0.02)', 'transparent']}
      style={[styles.container, { paddingTop: insets.top + Spacing.md }]}
    >
      <View style={styles.inner}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {rightElement}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: { flex: 1 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
