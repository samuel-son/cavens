import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BorderRadius, Spacing } from '@/constants/theme';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface BalanceCardProps {
  total: number;
  flexible: number;
  locked: number;
  currency?: string;
}

function formatAmount(amount: number, currency = 'XAF'): string {
  return `${amount.toLocaleString()} ${currency}`;
}

export function BalanceCard({
  total,
  flexible,
  locked,
  currency = 'XAF',
}: BalanceCardProps) {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];

  return (
    <Animated.View
      entering={FadeInDown.delay(100)}
      style={[styles.card, { backgroundColor: c.surface }]}>
      <View style={styles.main}>
        <Animated.Text
          entering={FadeInDown.delay(150)}
          style={[styles.label, { color: c.textSecondary }]}>
          Total Balance
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(200)}
          style={[styles.amount, { color: c.text }]}>
          {formatAmount(total, currency)}
        </Animated.Text>
      </View>
      <View style={[styles.divider, { backgroundColor: c.border }]} />
      <View style={styles.row}>
        <View style={styles.half}>
          <Animated.Text
            entering={FadeInDown.delay(250)}
            style={[styles.sublabel, { color: c.textSecondary }]}>
            Flexible
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(280)}
            style={[styles.subamount, { color: c.primary }]}>
            {formatAmount(flexible, currency)}
          </Animated.Text>
        </View>
        <View style={[styles.dividerVertical, { backgroundColor: c.border }]} />
        <View style={styles.half}>
          <Animated.Text
            entering={FadeInDown.delay(250)}
            style={[styles.sublabel, { color: c.textSecondary }]}>
            Locked
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(280)}
            style={[styles.subamount, { color: c.text }]}>
            {formatAmount(locked, currency)}
          </Animated.Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.md,
  },
  main: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  amount: {
    fontSize: 32,
    fontWeight: '800',
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  dividerVertical: {
    width: 1,
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  half: {
    flex: 1,
    alignItems: 'center',
  },
  sublabel: {
    fontSize: 12,
    marginBottom: Spacing.xs,
  },
  subamount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
