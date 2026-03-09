import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Spacing } from '@/constants/theme';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { SavingsTransaction } from '@/types';

interface TransactionItemProps {
  item: SavingsTransaction;
  currency?: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TransactionItem({ item, currency = 'XAF' }: TransactionItemProps) {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];
  const isDeposit = item.type === 'deposit';
  const Icon = isDeposit ? MaterialIcons : MaterialIcons;
  const iconName = isDeposit ? 'add-circle' : 'remove-circle';

  return (
    <Animated.View
      entering={FadeIn}
      style={[styles.row, { borderBottomColor: c.border }]}>
      <View style={[styles.iconWrap, { backgroundColor: (isDeposit ? c.success : c.warning) + '20' }]}>
        <Icon name={iconName} size={24} color={isDeposit ? c.success : c.warning} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.type, { color: c.text }]}>
          {isDeposit ? 'Deposit' : 'Withdrawal'}
        </Text>
        <Text style={[styles.date, { color: c.textSecondary }]}>
          {formatDate(item.timestamp)}
        </Text>
        {item.fee ? (
          <Text style={[styles.fee, { color: c.textSecondary }]}>
            5% fee: {item.fee.toLocaleString()} {currency}
          </Text>
        ) : null}
      </View>
      <View style={styles.amounts}>
        <Text
          style={[
            styles.amount,
            { color: isDeposit ? c.success : c.text },
          ]}>
          {isDeposit ? '+' : '-'}
          {item.amount.toLocaleString()} {currency}
        </Text>
        {item.netAmount ? (
          <Text style={[styles.net, { color: c.textSecondary }]}>
            Net: {item.netAmount.toLocaleString()}
          </Text>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  type: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },
  fee: {
    fontSize: 11,
    marginTop: 2,
  },
  amounts: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  net: {
    fontSize: 12,
    marginTop: 2,
  },
});
