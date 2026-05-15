import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/theme/colors';
import { Spacing, BorderRadius } from '../../src/theme/spacing';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { GradientButton } from '../../src/components/ui/GradientButton';
import { AnimatedCounter } from '../../src/components/ui/AnimatedCounter';
import { PremiumHeader } from '../../src/components/ui/PremiumHeader';
import { useSavingsStore } from '../../src/features/savings/savingsStore';

export default function VaultScreen() {
  const {
    flexible, fixedVaults, subscriptionTier,
    depositToFlexible, withdrawFromFlexible, createVault, breakVault,
  } = useSavingsStore();

  const [showCreateVault, setShowCreateVault] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showDeposit, setShowDeposit] = useState(false);
  const [vaultName, setVaultName] = useState('');
  const [vaultAmount, setVaultAmount] = useState('');
  const [vaultDuration, setVaultDuration] = useState(6);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  const activeVaults = fixedVaults.filter((v) => v.status === 'active');
  const totalFixed = activeVaults.reduce((s, v) => s + v.principal + v.accruedInterest, 0);
  const totalSavings = flexible.balance + totalFixed;

  const handleCreateVault = () => {
    const amt = parseFloat(vaultAmount);
    if (!vaultName || isNaN(amt) || amt <= 0) {
      Alert.alert('Error', 'Please enter valid vault details');
      return;
    }
    const success = createVault(vaultName, amt, vaultDuration);
    if (success) {
      Alert.alert('Success', `Vault "${vaultName}" created with ₵${amt.toFixed(2)} locked for ${vaultDuration} months`);
      setShowCreateVault(false);
      setVaultName(''); setVaultAmount('');
    } else {
      Alert.alert('Error', 'Insufficient flexible savings balance');
    }
  };

  const handleWithdraw = () => {
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0) return;
    const result = withdrawFromFlexible(amt);
    Alert.alert(result.success ? 'Success' : 'Error', result.message);
    if (result.success) { setShowWithdraw(false); setWithdrawAmount(''); }
  };

  const handleDeposit = () => {
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) return;
    depositToFlexible(amt);
    Alert.alert('Success', `₵${amt.toFixed(2)} deposited to Flexible Savings`);
    setShowDeposit(false); setDepositAmount('');
  };

  const handleBreakVault = (vaultId: string, name: string) => {
    Alert.alert(
      'Break Vault',
      `Are you sure you want to break "${name}"? A 10% penalty will be applied.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Break Vault', style: 'destructive',
          onPress: () => {
            const result = breakVault(vaultId);
            Alert.alert(result.success ? 'Done' : 'Error', result.message);
          },
        },
      ]
    );
  };

  const getDaysRemaining = (lockUntil: Date) => {
    const diff = new Date(lockUntil).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <View style={styles.container}>
      <PremiumHeader title="The Vault" subtitle="Your Savings Engine" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Total Savings Card */}
        <LinearGradient
          colors={[...Colors.gradientGold]}
          style={styles.totalCard}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        >
          <Text style={styles.totalLabel}>Total Savings</Text>
          <AnimatedCounter value={totalSavings} style={styles.totalAmount} />
          <View style={styles.totalRow}>
            <View style={styles.totalStat}>
              <Text style={styles.totalStatLabel}>Flexible</Text>
              <Text style={styles.totalStatVal}>₵{flexible.balance.toFixed(2)}</Text>
            </View>
            <View style={styles.totalStatDivider} />
            <View style={styles.totalStat}>
              <Text style={styles.totalStatLabel}>Fixed</Text>
              <Text style={styles.totalStatVal}>₵{totalFixed.toFixed(2)}</Text>
            </View>
            <View style={styles.totalStatDivider} />
            <View style={styles.totalStat}>
              <Text style={styles.totalStatLabel}>Interest</Text>
              <Text style={styles.totalStatVal}>
                {subscriptionTier === 'gold' ? '5%' : '3%'} p.a.
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <GradientButton title="Deposit" variant="success" size="sm" onPress={() => setShowDeposit(true)} style={{ flex: 1 }} />
          <GradientButton title="Withdraw" variant="outline" size="sm" onPress={() => setShowWithdraw(true)} style={{ flex: 1 }} />
          <GradientButton title="Lock Vault" variant="gold" size="sm" onPress={() => setShowCreateVault(true)} style={{ flex: 1 }} />
        </View>

        {/* Flexible Savings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flexible Savings</Text>
          <GlassCard variant="gold" style={{ marginTop: 10 }}>
            <View style={styles.flexRow}>
              <View>
                <Text style={styles.flexLabel}>Available Balance</Text>
                <Text style={styles.flexAmount}>₵{flexible.balance.toFixed(2)}</Text>
              </View>
              <View style={styles.flexBadge}>
                <Ionicons name="flash" size={14} color={Colors.success} />
                <Text style={styles.flexBadgeText}>Instant Access</Text>
              </View>
            </View>
            <View style={styles.flexStats}>
              <View style={styles.flexStatItem}>
                <Text style={styles.flexStatLabel}>Total Deposited</Text>
                <Text style={styles.flexStatVal}>₵{flexible.totalDeposited.toFixed(2)}</Text>
              </View>
              <View style={styles.flexStatItem}>
                <Text style={styles.flexStatLabel}>Total Withdrawn</Text>
                <Text style={styles.flexStatVal}>₵{flexible.totalWithdrawn.toFixed(2)}</Text>
              </View>
              <View style={styles.flexStatItem}>
                <Text style={styles.flexStatLabel}>Exit Fee</Text>
                <Text style={[styles.flexStatVal, { color: subscriptionTier === 'gold' ? Colors.success : Colors.warning }]}>
                  {subscriptionTier === 'gold' ? '0%' : '2%'}
                </Text>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Fixed Vaults */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fixed Vaults ({activeVaults.length})</Text>
          {activeVaults.map((vault) => (
            <GlassCard key={vault.id} style={{ marginTop: 12 }}>
              <View style={styles.vaultHeader}>
                <View style={styles.vaultIconWrap}>
                  <Ionicons name="lock-closed" size={18} color={Colors.gold} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.vaultName}>{vault.name}</Text>
                  <Text style={styles.vaultDays}>
                    {getDaysRemaining(vault.lockUntil)} days remaining
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleBreakVault(vault.id, vault.name)}
                  style={styles.breakBtn}
                >
                  <Ionicons name="lock-open-outline" size={16} color={Colors.error} />
                </TouchableOpacity>
              </View>
              <View style={styles.vaultStats}>
                <View style={styles.vaultStatItem}>
                  <Text style={styles.vaultStatLabel}>Principal</Text>
                  <Text style={styles.vaultStatVal}>₵{vault.principal.toFixed(2)}</Text>
                </View>
                <View style={styles.vaultStatItem}>
                  <Text style={styles.vaultStatLabel}>Interest</Text>
                  <Text style={[styles.vaultStatVal, { color: Colors.success }]}>
                    +₵{vault.accruedInterest.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.vaultStatItem}>
                  <Text style={styles.vaultStatLabel}>Rate</Text>
                  <Text style={styles.vaultStatVal}>{(vault.interestRate * 100).toFixed(0)}% p.a.</Text>
                </View>
              </View>
              {/* Progress bar */}
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, {
                  width: `${Math.min(100, ((Date.now() - new Date(vault.createdAt).getTime()) /
                    (new Date(vault.lockUntil).getTime() - new Date(vault.createdAt).getTime())) * 100)}%`,
                }]} />
              </View>
            </GlassCard>
          ))}
        </View>

        {/* Withdraw Info */}
        <View style={styles.section}>
          <GlassCard>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle" size={20} color={Colors.info} />
              <Text style={styles.infoText}>
                Flexible withdrawals incur a 2% platform fee. Upgrade to Gold to waive all fees.
              </Text>
            </View>
          </GlassCard>
        </View>
      </ScrollView>

      {/* Deposit Modal */}
      <Modal visible={showDeposit} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Deposit to Flexible Savings</Text>
            <TextInput
              style={styles.input} placeholder="Amount (₵)" placeholderTextColor={Colors.textTertiary}
              keyboardType="decimal-pad" value={depositAmount}
              onChangeText={setDepositAmount}
            />
            <View style={styles.modalActions}>
              <GradientButton title="Cancel" variant="outline" size="sm" onPress={() => setShowDeposit(false)} style={{ flex: 1 }} />
              <GradientButton title="Deposit" variant="success" size="sm" onPress={handleDeposit} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal visible={showWithdraw} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Withdraw from Flexible Savings</Text>
            <Text style={styles.modalSubtitle}>Available: ₵{flexible.balance.toFixed(2)}</Text>
            {subscriptionTier !== 'gold' && (
              <View style={styles.feeWarning}>
                <Ionicons name="warning" size={16} color={Colors.warning} />
                <Text style={styles.feeWarningText}>2% platform fee will be deducted</Text>
              </View>
            )}
            <TextInput
              style={styles.input} placeholder="Amount (₵)" placeholderTextColor={Colors.textTertiary}
              keyboardType="decimal-pad" value={withdrawAmount}
              onChangeText={setWithdrawAmount}
            />
            {withdrawAmount ? (
              <View style={styles.feeCalc}>
                <Text style={styles.feeCalcText}>
                  Fee: ₵{(parseFloat(withdrawAmount || '0') * (subscriptionTier === 'gold' ? 0 : 0.02)).toFixed(2)}
                </Text>
                <Text style={styles.feeCalcText}>
                  You receive: ₵{(parseFloat(withdrawAmount || '0') * (subscriptionTier === 'gold' ? 1 : 0.98)).toFixed(2)}
                </Text>
              </View>
            ) : null}
            <View style={styles.modalActions}>
              <GradientButton title="Cancel" variant="outline" size="sm" onPress={() => setShowWithdraw(false)} style={{ flex: 1 }} />
              <GradientButton title="Withdraw" variant="gold" size="sm" onPress={handleWithdraw} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Vault Modal */}
      <Modal visible={showCreateVault} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Fixed Vault</Text>
            <Text style={styles.modalSubtitle}>Lock your savings for higher returns</Text>
            <TextInput
              style={styles.input} placeholder="Vault Name" placeholderTextColor={Colors.textTertiary}
              value={vaultName} onChangeText={setVaultName}
            />
            <TextInput
              style={styles.input} placeholder="Amount (₵)" placeholderTextColor={Colors.textTertiary}
              keyboardType="decimal-pad" value={vaultAmount}
              onChangeText={setVaultAmount}
            />
            <Text style={styles.durationLabel}>Lock Duration</Text>
            <View style={styles.durationRow}>
              {[3, 6, 9, 12].map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.durationBtn, vaultDuration === m && styles.durationBtnActive]}
                  onPress={() => setVaultDuration(m)}
                >
                  <Text style={[styles.durationBtnText, vaultDuration === m && styles.durationBtnTextActive]}>
                    {m}mo
                  </Text>
                  <Text style={[styles.durationRate, vaultDuration === m && { color: Colors.textInverse }]}>
                    {m >= 12 ? '8%' : '5%'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <GradientButton title="Cancel" variant="outline" size="sm" onPress={() => setShowCreateVault(false)} style={{ flex: 1 }} />
              <GradientButton title="Lock Funds" variant="gold" size="sm" onPress={handleCreateVault} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  totalCard: { marginHorizontal: Spacing.xl, borderRadius: BorderRadius.xl, padding: Spacing.xl },
  totalLabel: { fontSize: 13, color: 'rgba(0,0,0,0.6)', fontWeight: '600' },
  totalAmount: { fontSize: 36, fontWeight: '800', color: Colors.textInverse, marginTop: 4 },
  totalRow: { flexDirection: 'row', marginTop: Spacing.lg },
  totalStat: { flex: 1, alignItems: 'center' },
  totalStatLabel: { fontSize: 11, color: 'rgba(0,0,0,0.5)', fontWeight: '500' },
  totalStatVal: { fontSize: 14, fontWeight: '700', color: Colors.textInverse, marginTop: 2 },
  totalStatDivider: { width: 1, backgroundColor: 'rgba(0,0,0,0.15)' },
  actions: {
    flexDirection: 'row', gap: Spacing.sm,
    paddingHorizontal: Spacing.xl, marginTop: Spacing.xl,
  },
  section: { paddingHorizontal: Spacing.xl, marginTop: Spacing['2xl'] },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  flexRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  flexLabel: { fontSize: 12, color: Colors.textSecondary },
  flexAmount: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary, marginTop: 4 },
  flexBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.successMuted, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  flexBadgeText: { fontSize: 11, color: Colors.success, fontWeight: '600' },
  flexStats: { flexDirection: 'row', marginTop: Spacing.lg, gap: Spacing.md },
  flexStatItem: { flex: 1 },
  flexStatLabel: { fontSize: 11, color: Colors.textTertiary },
  flexStatVal: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginTop: 2 },
  vaultHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  vaultIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.goldMuted, alignItems: 'center', justifyContent: 'center',
  },
  vaultName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  vaultDays: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  breakBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.errorMuted, alignItems: 'center', justifyContent: 'center',
  },
  vaultStats: { flexDirection: 'row', marginTop: Spacing.lg, gap: Spacing.md },
  vaultStatItem: { flex: 1 },
  vaultStatLabel: { fontSize: 11, color: Colors.textTertiary },
  vaultStatVal: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary, marginTop: 2 },
  progressTrack: {
    height: 4, backgroundColor: Colors.border, borderRadius: 2,
    marginTop: Spacing.md, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Colors.gold, borderRadius: 2 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  modalOverlay: {
    flex: 1, backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.backgroundSecondary, borderTopLeftRadius: BorderRadius['2xl'],
    borderTopRightRadius: BorderRadius['2xl'], padding: Spacing['2xl'],
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  modalSubtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  input: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, marginTop: Spacing.lg,
    color: Colors.textPrimary, fontSize: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  modalActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl },
  feeWarning: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.warningMuted, padding: Spacing.md,
    borderRadius: BorderRadius.md, marginTop: Spacing.md,
  },
  feeWarningText: { fontSize: 13, color: Colors.warning, fontWeight: '500' },
  feeCalc: { marginTop: Spacing.md, gap: 4 },
  feeCalcText: { fontSize: 13, color: Colors.textSecondary },
  durationLabel: {
    fontSize: 14, fontWeight: '600', color: Colors.textPrimary,
    marginTop: Spacing.lg,
  },
  durationRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  durationBtn: {
    flex: 1, alignItems: 'center', paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  durationBtnActive: {
    backgroundColor: Colors.gold, borderColor: Colors.gold,
  },
  durationBtnText: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  durationBtnTextActive: { color: Colors.textInverse },
  durationRate: { fontSize: 11, color: Colors.textTertiary, marginTop: 2 },
});
