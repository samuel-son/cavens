import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BalanceCard } from '@/components/savings/BalanceCard';
import { PendingCard } from '@/components/savings/PendingCard';
import { PinPad } from '@/components/ui/PinPad';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { useSavings } from '@/contexts/SavingsContext';

export default function DashboardScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const c = Colors[colorScheme ?? 'light'];
  const { balanceRevealed, verifyPin, setBalanceRevealed } = useAuth();
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [pinError, setPinError] = useState('');
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleRevealPinComplete = useCallback(
    async (pin: string) => {
      const valid = await verifyPin(pin);
      if (valid) {
        setShowPinEntry(false);
        setPinError('');
        setBalanceRevealed(true);
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        hideTimerRef.current = setTimeout(() => {
          setBalanceRevealed(false);
          hideTimerRef.current = null;
        }, 10000);
      } else {
        setPinError('Wrong PIN');
      }
    },
    [verifyPin, setBalanceRevealed]
  );

  useEffect(() => () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  }, []);
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
      <View style={styles.header}>
        <Animated.Text
          entering={FadeInDown}
          style={[styles.brand, { color: c.primary }]}>
          Cavens
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(80)}
          style={[styles.slogan, { color: c.textSecondary }]}>
          Covenant saving, met with purpose
        </Animated.Text>
      </View>

      <BalanceCard
        total={wallet.total}
        flexible={wallet.flexible}
        locked={wallet.locked}
        currency={settings.currency}
        masked={!balanceRevealed}
        onRevealPress={() => {
          setPinError('');
          setShowPinEntry(true);
        }}
      />

      {showPinEntry && (
        <View style={[styles.pinEntryInline, { backgroundColor: c.surface }]}>
          <View style={styles.pinEntryHeader}>
            <TouchableOpacity
              onPress={() => {
                setShowPinEntry(false);
                setPinError('');
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <MaterialIcons name="close" size={24} color={c.textSecondary} />
            </TouchableOpacity>
          </View>
          <PinPad
            key={pinError}
            title="Enter PIN"
            subtitle={pinError || 'Enter PIN to view your balance'}
            onComplete={handleRevealPinComplete}
          />
        </View>
      )}

      <View style={styles.features}>
        <Animated.Text
          entering={FadeInDown.delay(150)}
          style={[styles.featuresTitle, { color: c.text }]}>
          Services
        </Animated.Text>
        <View style={styles.featureCards}>
          <Animated.View entering={FadeInDown.delay(200)} style={styles.featureRow}>
            <TouchableOpacity
              style={[styles.featureCard, { backgroundColor: c.surface, borderLeftColor: c.primary }]}
              onPress={() => router.push('/investment')}
              activeOpacity={0.85}>
              <View style={[styles.featureIconWrap, { backgroundColor: c.primary + '18' }]}>
                <MaterialIcons name="trending-up" size={32} color={c.primary} />
              </View>
              <Animated.Text style={[styles.featureTitle, { color: c.text }]}>
                Investment
              </Animated.Text>
              <Animated.Text style={[styles.featureDesc, { color: c.textSecondary }]}>
                Grow your savings with investments
              </Animated.Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.featureCard, { backgroundColor: c.surface, borderLeftColor: c.success }]}
              onPress={() => router.push('/store')}
              activeOpacity={0.85}>
              <View style={[styles.featureIconWrap, { backgroundColor: c.success + '18' }]}>
                <MaterialIcons name="storefront" size={32} color={c.success} />
              </View>
              <Animated.Text style={[styles.featureTitle, { color: c.text }]}>
                Store
              </Animated.Text>
              <Animated.Text style={[styles.featureDesc, { color: c.textSecondary }]}>
                Buy properties & items from users
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

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
          title="Add Money"
          icon="account-balance"
          variant="primary"
          onPress={() => router.push('/add-money')}
        />
        <PremiumButton
          title="Simulate Incoming"
          icon="add"
          variant="secondary"
          onPress={simulateIncoming}
          style={styles.simulateBtn}
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
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  slogan: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: Spacing.xs,
    opacity: 0.9,
  },
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: 0,
  },
  simulate: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  simulateBtn: {
    marginTop: 0,
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
  features: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  featureCards: {
    gap: Spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  featureCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: 'transparent',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: Spacing.xs,
  },
  featureDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  pinEntryInline: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: 16,
    padding: Spacing.md,
    overflow: 'hidden',
  },
  pinEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
