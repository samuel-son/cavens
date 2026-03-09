import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BalanceCard } from '@/components/savings/BalanceCard';
import { PendingCard } from '@/components/savings/PendingCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Colors } from '@/constants/theme';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSavings } from '@/contexts/SavingsContext';

export default function DashboardScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];
  const { wallet, pendingSavings, settings, addPendingSavings } = useSavings();

  const simulateIncoming = () => {
    const received = 5000 + Math.floor(Math.random() * 20000);
    const pct = settings.defaultSavingsPercentage;
    const toSave = Math.round((received * pct) / 100);
    addPendingSavings({
      id: `pending-${Date.now()}`,
      amountReceived: received,
      savingsAmount: toSave,
      percentage: pct,
      sourceNumber: '+237 6XX XXX XXX',
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Animated.Text
        entering={FadeInDown}
        style={[styles.greeting, { color: c.text }]}>
        Your Savings
      </Animated.Text>

      <BalanceCard
        total={wallet.total}
        flexible={wallet.flexible}
        locked={wallet.locked}
        currency={settings.currency}
      />

      {pendingSavings.length > 0 ? (
        <View style={styles.section}>
          <Animated.Text
            entering={FadeInDown.delay(200)}
            style={[styles.sectionTitle, { color: c.text }]}>
            Pending
          </Animated.Text>
          {pendingSavings.slice(0, 5).map((item) => (
            <PendingCard
              key={item.id}
              item={item}
              currency={settings.currency}
              onComplete={() => router.push({ pathname: '/complete-saving', params: { pendingId: item.id } })}
            />
          ))}
        </View>
      ) : null}

      <View style={styles.simulate}>
        <PremiumButton
          title="Simulate Incoming"
          icon="add"
          variant="secondary"
          onPress={simulateIncoming}
        />
      </View>

      <View style={styles.actions}>
        <View style={styles.actionBtn}>
          <PremiumButton
            title="Savings"
            icon="account-balance-wallet"
            variant="primary"
            onPress={() => router.push('/savings')}
          />
        </View>
        <View style={styles.actionBtn}>
          <PremiumButton
            title="Withdraw"
            icon="payments"
            variant="outline"
            onPress={() => router.push('/withdraw')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: Spacing.xxl,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
  },
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: 0,
  },
  simulate: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.xl,
  },
  actionBtn: {
    flex: 1,
  },
});
