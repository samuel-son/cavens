import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BalanceCard } from '@/components/savings/BalanceCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Colors } from '@/constants/theme';
import { Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSavings } from '@/contexts/SavingsContext';

export default function SavingsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];
  const { wallet, settings } = useSavings();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: c.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      <Animated.Text
        entering={FadeInDown}
        style={[styles.title, { color: c.text }]}>
        Savings
      </Animated.Text>

      <BalanceCard
        total={wallet.total}
        flexible={wallet.flexible}
        locked={wallet.locked}
        currency={settings.currency}
      />

      <View style={styles.cards}>
        <View style={[styles.modeCard, { backgroundColor: c.surface }]}>
          <MaterialIcons name="lock" size={32} color={c.warning} />
          <Animated.Text style={[styles.cardTitle, { color: c.text }]}>
            Locked Savings
          </Animated.Text>
          <Animated.Text style={[styles.cardDesc, { color: c.textSecondary }]}>
            {settings.lockedEndDate
              ? `Withdraw on ${new Date(settings.lockedEndDate).toLocaleDateString()}`
              : 'Set date when completing savings'}
          </Animated.Text>
        </View>
        <View style={[styles.modeCard, { backgroundColor: c.surface }]}>
          <MaterialIcons name="lock-open" size={32} color={c.success} />
          <Animated.Text style={[styles.cardTitle, { color: c.text }]}>
            Flexible Savings
          </Animated.Text>
          <Animated.Text style={[styles.cardDesc, { color: c.textSecondary }]}>
            Withdraw anytime
          </Animated.Text>
        </View>
      </View>

      <PremiumButton
        title="Add Money"
        icon="account-balance"
        variant="primary"
        onPress={() => router.push('/add-money')}
        style={styles.addMoneyBtn}
      />
      <PremiumButton
        title="Settings"
        icon="settings"
        variant="outline"
        onPress={() => router.push('/settings')}
        style={styles.settingsBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: Spacing.xxl, paddingHorizontal: Spacing.md },
  title: {
    fontSize: 28,
    fontWeight: '800',
    paddingTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  cards: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  modeCard: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: 16,
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
  cardDesc: {
    fontSize: 12,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  addMoneyBtn: {
    marginTop: Spacing.xl,
  },
  settingsBtn: {
    marginTop: Spacing.md,
  },
});
