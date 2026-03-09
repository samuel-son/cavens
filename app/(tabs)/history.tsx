import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { TransactionItem } from '@/components/savings/TransactionItem';
import { Colors } from '@/constants/theme';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSavings } from '@/contexts/SavingsContext';

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];
  const { transactions, settings } = useSavings();

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <Animated.Text
        entering={FadeInDown}
        style={[styles.title, { color: c.text }]}>
        History
      </Animated.Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem item={item} currency={settings.currency} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Animated.Text
            entering={FadeInDown}
            style={[styles.empty, { color: c.textSecondary }]}>
            No transactions yet
          </Animated.Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  list: {
    paddingBottom: Spacing.xxl,
  },
  empty: {
    textAlign: 'center',
    marginTop: Spacing.xxl,
    fontSize: 16,
  },
});
