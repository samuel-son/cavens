import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Modal, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../src/theme/colors';
import { Spacing, BorderRadius } from '../../src/theme/spacing';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { GradientButton } from '../../src/components/ui/GradientButton';
import { PremiumHeader } from '../../src/components/ui/PremiumHeader';
import { PinInput } from '../../src/components/ui/PinInput';
import { useSavingsStore } from '../../src/features/savings/savingsStore';
import {
  DATA_BUNDLES, AIRTIME_AMOUNTS,
  processAirtimeTopUp, validateMeter, processElectricityPayment,
} from '../../src/features/utilities/utilitiesService';
import { MobileProvider, ElectricityType } from '../../src/features/portfolio/types';

type UtilityTab = 'airtime' | 'data' | 'electricity';

const PROVIDERS: { name: MobileProvider; color: string; icon: string }[] = [
  { name: 'MTN', color: '#FFCB05', icon: '📱' },
  { name: 'Telecel', color: '#E60012', icon: '📱' },
  { name: 'AT', color: '#0066B3', icon: '📱' },
];

export default function UtilitiesScreen() {
  const { flexible, deductUtilityPayment } = useSavingsStore();

  const [tab, setTab] = useState<UtilityTab>('airtime');
  const [provider, setProvider] = useState<MobileProvider | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [selectedBundle, setSelectedBundle] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);

  // Electricity state
  const [elecType, setElecType] = useState<ElectricityType>('prepaid');
  const [meterNumber, setMeterNumber] = useState('');
  const [meterValidated, setMeterValidated] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [elecAmount, setElecAmount] = useState('');
  const [validating, setValidating] = useState(false);

  const resetAirtime = () => {
    setProvider(null); setPhoneNumber('');
    setSelectedAmount(0); setSelectedBundle('');
    setShowPin(false);
  };

  const handlePinConfirm = async (pin: string) => {
    if (pin.length !== 4) return;
    setShowPin(false);
    setLoading(true);

    try {
      const amount = tab === 'data'
        ? DATA_BUNDLES[provider!].find(b => b.name === selectedBundle)?.amount || 0
        : selectedAmount;

      const result = deductUtilityPayment(amount);
      if (!result.success) {
        Alert.alert('Error', result.message);
        setLoading(false);
        return;
      }

      if (tab === 'airtime' || tab === 'data') {
        await processAirtimeTopUp(provider!, phoneNumber, amount, tab, selectedBundle);
        Alert.alert('Success! ✅', `${tab === 'airtime' ? 'Airtime' : 'Data'} of ₵${amount.toFixed(2)} sent to ${phoneNumber}`);
      }
      resetAirtime();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const handleValidateMeter = async () => {
    if (meterNumber.length < 8) {
      Alert.alert('Error', 'Enter a valid meter number (min 8 digits)');
      return;
    }
    setValidating(true);
    try {
      const result = await validateMeter(meterNumber, elecType);
      if (result.valid) {
        setMeterValidated(true);
        setCustomerName(result.customerName);
      } else {
        Alert.alert('Invalid Meter', 'Meter number could not be verified');
      }
    } catch {
      Alert.alert('Error', 'Validation failed');
    } finally {
      setValidating(false);
    }
  };

  const handleElecPayment = async () => {
    const amt = parseFloat(elecAmount);
    if (isNaN(amt) || amt <= 0) return;

    const result = deductUtilityPayment(amt);
    if (!result.success) {
      Alert.alert('Error', result.message);
      return;
    }

    setLoading(true);
    try {
      const payment = await processElectricityPayment(meterNumber, elecType, amt, customerName);
      if (payment.token) {
        Alert.alert('Payment Successful! ⚡', `Token: ${payment.token}\n\nAmount: ₵${amt.toFixed(2)}`);
      } else {
        Alert.alert('Payment Successful! ⚡', `₵${amt.toFixed(2)} paid for ${customerName}`);
      }
      setMeterNumber(''); setMeterValidated(false);
      setCustomerName(''); setElecAmount('');
    } catch {
      Alert.alert('Error', 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const canProceedAirtime = provider && phoneNumber.length >= 10 && (
    tab === 'airtime' ? selectedAmount > 0 : selectedBundle !== ''
  );

  return (
    <View style={styles.container}>
      <PremiumHeader
        title="Utilities"
        subtitle={`Flexible Balance: ₵${flexible.balance.toFixed(2)}`}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Tab Switcher */}
        <View style={styles.tabSwitch}>
          {(['airtime', 'data', 'electricity'] as UtilityTab[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
              onPress={() => setTab(t)}
            >
              <Ionicons
                name={t === 'airtime' ? 'call' : t === 'data' ? 'wifi' : 'flash'}
                size={16}
                color={tab === t ? Colors.textInverse : Colors.textTertiary}
              />
              <Text style={[styles.tabBtnText, tab === t && styles.tabBtnTextActive]}>
                {t === 'airtime' ? 'Airtime' : t === 'data' ? 'Data' : 'Electricity'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {(tab === 'airtime' || tab === 'data') ? (
          <>
            {/* Provider Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Provider</Text>
              <View style={styles.providerGrid}>
                {PROVIDERS.map((p) => (
                  <TouchableOpacity
                    key={p.name}
                    style={[styles.providerCard, provider === p.name && styles.providerCardActive]}
                    onPress={() => setProvider(p.name)}
                  >
                    <View style={[styles.providerIcon, { backgroundColor: p.color + '20' }]}>
                      <Text style={{ fontSize: 24 }}>{p.icon}</Text>
                    </View>
                    <Text style={[styles.providerName, provider === p.name && { color: Colors.gold }]}>
                      {p.name}
                    </Text>
                    {provider === p.name && (
                      <View style={styles.providerCheck}>
                        <Ionicons name="checkmark-circle" size={18} color={Colors.gold} />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Phone Number */}
            {provider && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0XX XXX XXXX"
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  maxLength={10}
                />
              </View>
            )}

            {/* Amount Selection - Airtime */}
            {provider && phoneNumber.length >= 10 && tab === 'airtime' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select Amount</Text>
                <View style={styles.amountGrid}>
                  {AIRTIME_AMOUNTS.map((amt) => (
                    <TouchableOpacity
                      key={amt}
                      style={[styles.amountBtn, selectedAmount === amt && styles.amountBtnActive]}
                      onPress={() => setSelectedAmount(amt)}
                    >
                      <Text style={[styles.amountBtnText, selectedAmount === amt && styles.amountBtnTextActive]}>
                        ₵{amt}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Bundle Selection - Data */}
            {provider && phoneNumber.length >= 10 && tab === 'data' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Select Data Bundle</Text>
                {DATA_BUNDLES[provider].map((bundle) => (
                  <TouchableOpacity
                    key={bundle.name}
                    style={[styles.bundleCard, selectedBundle === bundle.name && styles.bundleCardActive]}
                    onPress={() => setSelectedBundle(bundle.name)}
                  >
                    <View>
                      <Text style={styles.bundleName}>{bundle.name}</Text>
                      <Text style={styles.bundleData}>{bundle.data}</Text>
                    </View>
                    <Text style={styles.bundlePrice}>₵{bundle.amount.toFixed(2)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Confirm Button */}
            {canProceedAirtime && (
              <View style={styles.section}>
                <GradientButton
                  title="Confirm with PIN"
                  variant="gold" size="lg"
                  onPress={() => setShowPin(true)}
                  loading={loading}
                  icon={<Ionicons name="lock-closed" size={18} color={Colors.textInverse} />}
                />
              </View>
            )}
          </>
        ) : (
          <>
            {/* Electricity */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Type</Text>
              <View style={styles.elecTypeRow}>
                {(['prepaid', 'postpaid'] as ElectricityType[]).map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.elecTypeBtn, elecType === t && styles.elecTypeBtnActive]}
                    onPress={() => { setElecType(t); setMeterValidated(false); }}
                  >
                    <Ionicons
                      name={t === 'prepaid' ? 'card' : 'document-text'}
                      size={18}
                      color={elecType === t ? Colors.textInverse : Colors.textSecondary}
                    />
                    <Text style={[styles.elecTypeText, elecType === t && styles.elecTypeTextActive]}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Meter Number */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Meter Number</Text>
              <View style={styles.meterRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Enter meter number"
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="number-pad"
                  value={meterNumber}
                  onChangeText={(t) => { setMeterNumber(t); setMeterValidated(false); }}
                />
                <GradientButton
                  title={validating ? '' : 'Verify'}
                  variant="gold" size="md"
                  onPress={handleValidateMeter}
                  loading={validating}
                  style={{ marginLeft: 10, marginTop: 12 }}
                />
              </View>

              {meterValidated && (
                <GlassCard variant="gold" style={{ marginTop: 12 }}>
                  <View style={styles.validatedRow}>
                    <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.validatedName}>{customerName}</Text>
                      <Text style={styles.validatedMeter}>Meter: {meterNumber}</Text>
                    </View>
                  </View>
                </GlassCard>
              )}
            </View>

            {/* Amount & Pay */}
            {meterValidated && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Amount</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Amount (₵)"
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="decimal-pad"
                  value={elecAmount}
                  onChangeText={setElecAmount}
                />
                <View style={styles.quickAmounts}>
                  {[20, 50, 100, 200, 500].map((a) => (
                    <TouchableOpacity
                      key={a} style={styles.quickBtn}
                      onPress={() => setElecAmount(a.toString())}
                    >
                      <Text style={styles.quickBtnText}>₵{a}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <GradientButton
                  title="Pay Now"
                  variant="gold" size="lg"
                  onPress={handleElecPayment}
                  loading={loading}
                  style={{ marginTop: Spacing.xl }}
                  icon={<Ionicons name="flash" size={18} color={Colors.textInverse} />}
                />
              </View>
            )}
          </>
        )}

        {/* Info Card */}
        <View style={styles.section}>
          <GlassCard>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle" size={20} color={Colors.info} />
              <Text style={styles.infoText}>
                All utility payments are deducted directly from your Flexible Savings balance.
              </Text>
            </View>
          </GlassCard>
        </View>
      </ScrollView>

      {/* PIN Modal */}
      <Modal visible={showPin} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <PinInput
              title="Enter PIN to confirm"
              onComplete={handlePinConfirm}
            />
            <TouchableOpacity
              style={styles.cancelPin}
              onPress={() => setShowPin(false)}
            >
              <Text style={styles.cancelPinText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={Colors.gold} />
            <Text style={styles.loadingText}>Processing...</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  section: { paddingHorizontal: Spacing.xl, marginTop: Spacing.xl },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  tabSwitch: {
    flexDirection: 'row', marginHorizontal: Spacing.xl,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: 4,
  },
  tabBtn: {
    flex: 1, paddingVertical: 10, alignItems: 'center',
    borderRadius: BorderRadius.md, flexDirection: 'row',
    justifyContent: 'center', gap: 6,
  },
  tabBtnActive: { backgroundColor: Colors.gold },
  tabBtnText: { fontSize: 13, color: Colors.textTertiary, fontWeight: '500' },
  tabBtnTextActive: { color: Colors.textInverse, fontWeight: '700' },
  providerGrid: { flexDirection: 'row', gap: Spacing.md, marginTop: 8 },
  providerCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: BorderRadius.xl,
    padding: Spacing.lg, alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: Colors.border,
  },
  providerCardActive: { borderColor: Colors.gold, backgroundColor: Colors.goldSubtle },
  providerIcon: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  providerName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  providerCheck: { position: 'absolute', top: 8, right: 8 },
  input: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, marginTop: Spacing.md,
    color: Colors.textPrimary, fontSize: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  amountGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginTop: 8,
  },
  amountBtn: {
    paddingHorizontal: 20, paddingVertical: 12,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border,
  },
  amountBtnActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  amountBtnText: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  amountBtnTextActive: { color: Colors.textInverse },
  bundleCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, marginTop: 8,
    borderWidth: 1, borderColor: Colors.border,
  },
  bundleCardActive: { borderColor: Colors.gold, backgroundColor: Colors.goldSubtle },
  bundleName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  bundleData: { fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
  bundlePrice: { fontSize: 16, fontWeight: '800', color: Colors.gold },
  elecTypeRow: { flexDirection: 'row', gap: Spacing.md, marginTop: 8 },
  elecTypeBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.border,
  },
  elecTypeBtnActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  elecTypeText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  elecTypeTextActive: { color: Colors.textInverse },
  meterRow: { flexDirection: 'row', alignItems: 'flex-start' },
  validatedRow: { flexDirection: 'row', alignItems: 'center' },
  validatedName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  validatedMeter: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  quickAmounts: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  quickBtn: {
    flex: 1, paddingVertical: 10, alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border,
  },
  quickBtnText: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.backgroundSecondary,
    borderTopLeftRadius: BorderRadius['2xl'], borderTopRightRadius: BorderRadius['2xl'],
    padding: Spacing.xl, paddingBottom: Spacing['3xl'],
  },
  cancelPin: { alignItems: 'center', paddingVertical: Spacing.md },
  cancelPinText: { fontSize: 15, color: Colors.textSecondary, fontWeight: '600' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: Colors.overlay,
    alignItems: 'center', justifyContent: 'center',
  },
  loadingBox: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.xl,
    padding: Spacing['2xl'], alignItems: 'center', gap: Spacing.md,
  },
  loadingText: { fontSize: 15, color: Colors.textPrimary, fontWeight: '600' },
});
