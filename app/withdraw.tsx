import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Colors } from '@/constants/theme';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSavings } from '@/contexts/SavingsContext';
import { formatCurrency } from '@/lib/format';
import type { SavingsMode } from '@/types';

export default function WithdrawScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];
  const { wallet, withdraw, settings, isLockedDue } = useSavings();
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState<SavingsMode>('flexible');

  const flexibleAvailable = wallet.flexible;
  const lockedAvailable = wallet.locked;
  const lockedDue = isLockedDue();
  const available = source === 'flexible' ? flexibleAvailable : lockedAvailable;
  const canWithdrawLocked = lockedDue && lockedAvailable > 0;

  const amountNum = parseInt(amount.replace(/\D/g, ''), 10) || 0;
  const fee = Math.ceil(amountNum * 0.05);
  const net = amountNum - fee;
  const canWithdraw =
    amountNum > 0 &&
    amountNum <= available &&
    (source === 'flexible' || lockedDue);

  const handleWithdraw = () => {
    if (!canWithdraw) return;
    router.push({
      pathname: '/pin-verify',
      params: { action: 'withdraw', amount: amountNum.toString(), mode: source },
    });
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <Animated.Text
          entering={FadeInDown}
          style={[styles.title, { color: c.text }]}>
          Withdraw
        </Animated.Text>

        <View style={styles.sourceRow}>
          <TouchableOpacity
            style={[
              styles.sourceBtn,
              { backgroundColor: c.surface, borderColor: source === 'flexible' ? c.primary : c.border },
            ]}
            onPress={() => setSource('flexible')}>
            <MaterialIcons name="lock-open" size={24} color={source === 'flexible' ? c.primary : c.textSecondary} />
            <Animated.Text style={[styles.sourceLabel, { color: c.text }]}>Flexible</Animated.Text>
            <Animated.Text style={[styles.sourceAmount, { color: c.primary }]}>
              {formatCurrency(flexibleAvailable, settings.currency)}
            </Animated.Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sourceBtn,
              {
                backgroundColor: c.surface,
                borderColor: source === 'locked' ? c.primary : c.border,
                opacity: canWithdrawLocked ? 1 : 0.6,
              },
            ]}
            onPress={() => canWithdrawLocked && setSource('locked')}
            disabled={!canWithdrawLocked}>
            <MaterialIcons name="lock" size={24} color={source === 'locked' ? c.primary : c.textSecondary} />
            <Animated.Text style={[styles.sourceLabel, { color: c.text }]}>Locked</Animated.Text>
            <Animated.Text style={[styles.sourceAmount, { color: c.primary }]}>
              {formatCurrency(lockedAvailable, settings.currency)}
            </Animated.Text>
            {!lockedDue && settings.lockedEndDate ? (
              <Animated.Text style={[styles.lockedUntil, { color: c.warning }]}>
                Until {formatDate(settings.lockedEndDate)}
              </Animated.Text>
            ) : null}
          </TouchableOpacity>
        </View>

        <Animated.Text
          entering={FadeInDown.delay(100)}
          style={[styles.subtitle, { color: c.textSecondary }]}>
          From {source}: {formatCurrency(available, settings.currency)}
        </Animated.Text>

        <View style={[styles.inputWrap, { backgroundColor: c.surface }]}>
          <TextInput
            style={[styles.input, { color: c.text }]}
            placeholder="0"
            placeholderTextColor={c.textSecondary}
            keyboardType="number-pad"
            value={amount}
            onChangeText={(t) => setAmount(t.replace(/\D/g, ''))}
          />
          <Animated.Text style={[styles.currency, { color: c.textSecondary }]}>
            {settings.currency}
          </Animated.Text>
        </View>

        {amountNum > 0 ? (
          <Animated.View
            entering={FadeInDown}
            style={[styles.breakdown, { backgroundColor: c.surface }]}>
            <Animated.Text style={[styles.breakdownRow, { color: c.textSecondary }]}>
              5% commission: {formatCurrency(fee, settings.currency)}
            </Animated.Text>
            <Animated.Text style={[styles.breakdownRow, { color: c.text }]}>
              You receive: {formatCurrency(net, settings.currency)}
            </Animated.Text>
          </Animated.View>
        ) : null}

        <PremiumButton
          title="Continue"
          icon="arrow-forward"
          variant="primary"
          disabled={!canWithdraw}
          onPress={handleWithdraw}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  sourceRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  sourceBtn: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
  },
  sourceLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: Spacing.xs,
  },
  sourceAmount: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  lockedUntil: {
    fontSize: 10,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    marginTop: Spacing.md,
  },
  inputWrap: {
    marginTop: Spacing.xl,
    borderRadius: 16,
    padding: Spacing.lg,
  },
  input: {
    fontSize: 36,
    fontWeight: '700',
  },
  currency: {
    fontSize: 16,
    marginTop: Spacing.xs,
  },
  breakdown: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 12,
  },
  breakdownRow: {
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
});
