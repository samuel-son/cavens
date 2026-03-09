import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Colors } from '@/constants/theme';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * The prompt shown when money is received - asks user to approve deduction
 * "Saving request ready: X will be deducted from your received money.
 *  Enter your PIN to continue."
 */
interface SavingsPromptProps {
  amountToSave: number;
  amountReceived: number;
  currency?: string;
  onApprove: () => void;
  onDismiss: () => void;
}

export function SavingsPrompt({
  amountToSave,
  amountReceived,
  currency = 'XAF',
  onApprove,
  onDismiss,
}: SavingsPromptProps) {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];

  return (
    <Animated.View
      entering={FadeIn}
      style={[styles.overlay, { backgroundColor: c.surface }]}>
      <View style={[styles.iconWrap, { backgroundColor: c.primary + '20' }]}>
        <MaterialIcons name="savings" size={48} color={c.primary} />
      </View>
      <Animated.Text style={[styles.title, { color: c.text }]}>
        Saving Request Ready
      </Animated.Text>
      <Animated.Text style={[styles.amount, { color: c.primary }]}>
        {amountToSave.toLocaleString()} {currency}
      </Animated.Text>
      <Animated.Text style={[styles.sub, { color: c.textSecondary }]}>
        will be deducted from {amountReceived.toLocaleString()} {currency} received
      </Animated.Text>
      <Animated.Text style={[styles.pinHint, { color: c.textSecondary }]}>
        Enter your PIN to continue
      </Animated.Text>
      <View style={styles.actions}>
        <PremiumButton
          title="Approve"
          icon="check-circle"
          variant="primary"
          onPress={onApprove}
        />
        <PremiumButton
          title="Later"
          variant="outline"
          onPress={onDismiss}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    padding: Spacing.xl,
    borderRadius: 24,
    margin: Spacing.lg,
    alignItems: 'center',
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  amount: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: Spacing.sm,
  },
  sub: {
    fontSize: 14,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  pinHint: {
    fontSize: 13,
    marginTop: Spacing.md,
  },
  actions: {
    marginTop: Spacing.xl,
    width: '100%',
    gap: Spacing.sm,
  },
});
