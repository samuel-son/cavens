import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { BorderRadius, Spacing } from '@/constants/theme';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { PendingSavings } from '@/types';
import { PremiumButton } from '@/components/ui/PremiumButton';

interface PendingCardProps {
  item: PendingSavings;
  onComplete: () => void;
  currency?: string;
}

export function PendingCard({ item, onComplete, currency = 'XAF' }: PendingCardProps) {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];

  return (
    <Animated.View
      entering={FadeInRight}
      style={[styles.card, { backgroundColor: c.surface }]}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: c.primary + '20' }]}>
          <MaterialIcons name="pending-actions" size={24} color={c.primary} />
        </View>
        <View style={styles.info}>
          <Animated.Text style={[styles.amount, { color: c.text }]}>
            {item.savingsAmount.toLocaleString()} {currency}
          </Animated.Text>
          <Animated.Text style={[styles.detail, { color: c.textSecondary }]}>
            {item.percentage}% of {item.amountReceived.toLocaleString()} received
          </Animated.Text>
        </View>
      </View>
      <PremiumButton
        title="Complete"
        onPress={onComplete}
        variant="primary"
        icon="check-circle"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
  },
  detail: {
    fontSize: 13,
    marginTop: Spacing.xs,
  },
});
