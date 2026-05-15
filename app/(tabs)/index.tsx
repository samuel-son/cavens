import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/theme/colors';
import { Spacing, BorderRadius, Shadows } from '../../src/theme/spacing';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { AnimatedCounter } from '../../src/components/ui/AnimatedCounter';
import { useSavingsStore } from '../../src/features/savings/savingsStore';
import { useWealthStore } from '../../src/features/wealth/wealthStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { flexible, fixedVaults, subscriptionTier } = useSavingsStore();
  const { goldHoldings, shareHoldings, getTotalValue } = useWealthStore();

  const totalSavings = flexible.balance + fixedVaults
    .filter((v) => v.status === 'active')
    .reduce((s, v) => s + v.principal, 0);
  const investmentValue = getTotalValue();
  const netWorth = totalSavings + investmentValue;

  const quickActions = [
    { icon: 'arrow-down-circle' as const, label: 'Deposit', color: Colors.success, bg: Colors.successMuted },
    { icon: 'arrow-up-circle' as const, label: 'Withdraw', color: Colors.warning, bg: Colors.warningMuted },
    { icon: 'swap-horizontal' as const, label: 'Transfer', color: Colors.info, bg: Colors.infoMuted },
    { icon: 'card' as const, label: 'Pay Bills', color: Colors.gold, bg: Colors.goldMuted },
  ];

  const recentActivity = [
    { type: 'deposit', desc: 'Deposit from MTN MoMo', amount: '+₵500.00', time: '2h ago', color: Colors.success },
    { type: 'purchase', desc: 'Gold Purchase (0.5g)', amount: '-₵37.90', time: '5h ago', color: Colors.error },
    { type: 'interest', desc: 'Savings Interest', amount: '+₵12.35', time: '1d ago', color: Colors.success },
    { type: 'airtime', desc: 'MTN Airtime Top-up', amount: '-₵10.00', time: '2d ago', color: Colors.error },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning 👋</Text>
            <Text style={styles.userName}>Samuel</Text>
          </View>
          <View style={styles.headerRight}>
            {subscriptionTier === 'gold' && (
              <View style={styles.proBadge}>
                <Ionicons name="diamond" size={12} color={Colors.gold} />
                <Text style={styles.proBadgeText}>PRO</Text>
              </View>
            )}
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Net Worth Card */}
        <LinearGradient
          colors={['rgba(212,168,83,0.15)', 'rgba(212,168,83,0.05)', Colors.surface]}
          style={styles.worthCard}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        >
          <View style={styles.worthCardBorder}>
            <Text style={styles.worthLabel}>Total Net Worth</Text>
            <AnimatedCounter value={netWorth} style={styles.worthAmount} />
            <View style={styles.worthRow}>
              <View style={styles.worthStat}>
                <Ionicons name="shield-checkmark" size={14} color={Colors.success} />
                <Text style={styles.worthStatLabel}>Savings</Text>
                <Text style={styles.worthStatValue}>₵{totalSavings.toFixed(2)}</Text>
              </View>
              <View style={styles.worthDivider} />
              <View style={styles.worthStat}>
                <Ionicons name="trending-up" size={14} color={Colors.gold} />
                <Text style={styles.worthStatLabel}>Investments</Text>
                <Text style={styles.worthStatValue}>₵{investmentValue.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {quickActions.map((action, i) => (
            <TouchableOpacity key={i} style={styles.quickActionItem} activeOpacity={0.7}>
              <View style={[styles.quickActionIcon, { backgroundColor: action.bg }]}>
                <Ionicons name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Savings Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Savings Overview</Text>
          <GlassCard variant="gold" style={{ marginTop: 10 }}>
            <View style={styles.savingsRow}>
              <View>
                <Text style={styles.savingsLabel}>Flexible Savings</Text>
                <Text style={styles.savingsAmount}>₵{flexible.balance.toFixed(2)}</Text>
                <Text style={styles.savingsRate}>
                  {subscriptionTier === 'gold' ? '5%' : '3%'} p.a.
                </Text>
              </View>
              <View style={styles.savingsRight}>
                <Text style={styles.savingsLabel}>Fixed Vaults</Text>
                <Text style={styles.savingsAmount}>{fixedVaults.filter(v => v.status === 'active').length}</Text>
                <Text style={styles.savingsRate}>Active</Text>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Investment Snapshot */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment Snapshot</Text>
          <View style={styles.investGrid}>
            <GlassCard style={styles.investCard}>
              <View style={[styles.investIcon, { backgroundColor: Colors.warningMuted }]}>
                <Text style={{ fontSize: 20 }}>🥇</Text>
              </View>
              <Text style={styles.investLabel}>Gold</Text>
              <Text style={styles.investValue}>
                {goldHoldings.reduce((s, h) => s + h.gramsOwned, 0).toFixed(2)}g
              </Text>
              <Text style={styles.investSubValue}>
                ₵{goldHoldings.reduce((s, h) => s + h.gramsOwned * h.currentPrice, 0).toFixed(2)}
              </Text>
            </GlassCard>
            <GlassCard style={styles.investCard}>
              <View style={[styles.investIcon, { backgroundColor: Colors.infoMuted }]}>
                <Text style={{ fontSize: 20 }}>📈</Text>
              </View>
              <Text style={styles.investLabel}>Shares</Text>
              <Text style={styles.investValue}>{shareHoldings.length} stocks</Text>
              <Text style={styles.investSubValue}>
                ₵{shareHoldings.reduce((s, h) => s + h.sharesOwned * h.currentPrice, 0).toFixed(2)}
              </Text>
            </GlassCard>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <GlassCard style={{ marginTop: 10, padding: 0 }}>
            {recentActivity.map((item, i) => (
              <View
                key={i}
                style={[styles.activityItem, i < recentActivity.length - 1 && styles.activityBorder]}
              >
                <View style={styles.activityLeft}>
                  <Text style={styles.activityDesc}>{item.desc}</Text>
                  <Text style={styles.activityTime}>{item.time}</Text>
                </View>
                <Text style={[styles.activityAmount, { color: item.color }]}>{item.amount}</Text>
              </View>
            ))}
          </GlassCard>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.xl, paddingTop: Spacing.lg, paddingBottom: Spacing.md,
  },
  greeting: { fontSize: 14, color: Colors.textSecondary },
  userName: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  proBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.goldSubtle, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.borderGold,
  },
  proBadgeText: { color: Colors.gold, fontSize: 11, fontWeight: '700' },
  notifBtn: { position: 'relative' },
  notifDot: {
    position: 'absolute', top: 0, right: 0, width: 8, height: 8,
    borderRadius: 4, backgroundColor: Colors.error,
  },
  worthCard: {
    marginHorizontal: Spacing.xl, borderRadius: BorderRadius.xl,
    marginTop: Spacing.md,
  },
  worthCardBorder: {
    borderWidth: 1, borderColor: Colors.borderGold, borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
  },
  worthLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  worthAmount: { fontSize: 40, fontWeight: '800', color: Colors.textPrimary, marginTop: 4 },
  worthRow: { flexDirection: 'row', marginTop: Spacing.lg },
  worthStat: { flex: 1, flexDirection: 'column', alignItems: 'center', gap: 4 },
  worthStatLabel: { fontSize: 12, color: Colors.textTertiary },
  worthStatValue: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  worthDivider: { width: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.md },
  quickActions: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl, marginTop: Spacing['2xl'],
  },
  quickActionItem: { alignItems: 'center', gap: 6 },
  quickActionIcon: {
    width: 52, height: 52, borderRadius: 26,
    alignItems: 'center', justifyContent: 'center',
  },
  quickActionLabel: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500' },
  section: { paddingHorizontal: Spacing.xl, marginTop: Spacing['2xl'] },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  savingsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  savingsRight: { alignItems: 'flex-end' },
  savingsLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  savingsAmount: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginTop: 4 },
  savingsRate: { fontSize: 12, color: Colors.success, marginTop: 2, fontWeight: '600' },
  investGrid: { flexDirection: 'row', gap: Spacing.md, marginTop: 10 },
  investCard: { flex: 1, alignItems: 'center', padding: Spacing.lg },
  investIcon: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  investLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  investValue: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginTop: 4 },
  investSubValue: { fontSize: 13, color: Colors.gold, marginTop: 2, fontWeight: '600' },
  activityItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: Spacing.lg,
  },
  activityBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  activityLeft: { flex: 1 },
  activityDesc: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  activityTime: { fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
  activityAmount: { fontSize: 15, fontWeight: '700' },
});
