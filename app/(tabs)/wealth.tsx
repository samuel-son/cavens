import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Modal, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/theme/colors';
import { Spacing, BorderRadius } from '../../src/theme/spacing';
import { GlassCard } from '../../src/components/ui/GlassCard';
import { GradientButton } from '../../src/components/ui/GradientButton';
import { AnimatedCounter } from '../../src/components/ui/AnimatedCounter';
import { PremiumHeader } from '../../src/components/ui/PremiumHeader';
import { useWealthStore } from '../../src/features/wealth/wealthStore';
import { useSavingsStore } from '../../src/features/savings/savingsStore';

const { width } = Dimensions.get('window');

export default function WealthScreen() {
  const {
    goldHoldings, shareHoldings, commodityPrices, sharePrices,
    goldPriceHistory, refreshPrices, buyGold, buyShares, getTotalValue,
  } = useWealthStore();
  const { flexible, deductUtilityPayment } = useSavingsStore();

  const [tab, setTab] = useState<'gold' | 'shares'>('gold');
  const [showBuyGold, setShowBuyGold] = useState(false);
  const [showBuyShare, setShowBuyShare] = useState(false);
  const [buyAmount, setBuyAmount] = useState('');
  const [selectedShare, setSelectedShare] = useState('');
  const [shareQty, setShareQty] = useState('');

  // Auto-refresh prices every 5 seconds
  useEffect(() => {
    const interval = setInterval(refreshPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  const goldPrice = commodityPrices.find((c) => c.asset === 'gold');
  const totalGoldGrams = goldHoldings.reduce((s, h) => s + h.gramsOwned, 0);
  const totalGoldValue = goldHoldings.reduce((s, h) => s + h.gramsOwned * h.currentPrice, 0);
  const totalShareValue = shareHoldings.reduce((s, h) => s + h.sharesOwned * h.currentPrice, 0);
  const totalValue = getTotalValue();

  const handleBuyGold = () => {
    const amt = parseFloat(buyAmount);
    if (isNaN(amt) || amt <= 0) return;
    if (amt > flexible.balance) {
      Alert.alert('Insufficient Balance', 'Not enough in Flexible Savings');
      return;
    }
    const result = buyGold(amt);
    if (result.success) {
      deductUtilityPayment(amt);
      Alert.alert('Gold Purchased!', `You bought ${result.grams.toFixed(4)}g of Gold`);
      setShowBuyGold(false); setBuyAmount('');
    }
  };

  const handleBuyShares = () => {
    const qty = parseInt(shareQty);
    if (!selectedShare || isNaN(qty) || qty <= 0) return;
    const price = sharePrices.find((s) => s.symbol === selectedShare);
    if (!price) return;
    const cost = price.displayPrice * qty;
    if (cost > flexible.balance) {
      Alert.alert('Insufficient Balance', `Need ₵${cost.toFixed(2)}`);
      return;
    }
    const result = buyShares(selectedShare, qty);
    if (result.success) {
      deductUtilityPayment(result.totalCost);
      Alert.alert('Shares Purchased!', `${qty} ${selectedShare} shares bought for ₵${result.totalCost.toFixed(2)}`);
      setShowBuyShare(false); setShareQty(''); setSelectedShare('');
    }
  };

  // Mini chart renderer
  const renderMiniChart = () => {
    if (goldPriceHistory.length < 2) return null;
    const prices = goldPriceHistory.map((p) => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const chartW = width - Spacing.xl * 2 - 40;
    const chartH = 120;

    const points = prices.map((p, i) => {
      const x = (i / (prices.length - 1)) * chartW;
      const y = chartH - ((p - min) / range) * chartH;
      return `${x},${y}`;
    }).join(' ');

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chartYAxis}>
          <Text style={styles.chartLabel}>${max.toFixed(2)}</Text>
          <Text style={styles.chartLabel}>${min.toFixed(2)}</Text>
        </View>
        <View style={{ width: chartW, height: chartH }}>
          {/* Simple visual line using dots */}
          <View style={styles.chartLine}>
            {prices.map((p, i) => {
              const x = (i / (prices.length - 1)) * chartW;
              const y = chartH - ((p - min) / range) * (chartH - 8);
              return (
                <View
                  key={i}
                  style={[styles.chartDot, {
                    left: x - 2, top: y - 2,
                    backgroundColor: i === prices.length - 1 ? Colors.gold : Colors.goldDark,
                    width: i === prices.length - 1 ? 8 : 3,
                    height: i === prices.length - 1 ? 8 : 3,
                    borderRadius: i === prices.length - 1 ? 4 : 1.5,
                  }]}
                />
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <PremiumHeader title="Wealth Portal" subtitle="Investments & Trading" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Portfolio Value */}
        <GlassCard variant="gold" style={{ marginHorizontal: Spacing.xl }}>
          <Text style={styles.portLabel}>Portfolio Value</Text>
          <AnimatedCounter value={totalValue} prefix="₵" style={styles.portValue} />
          <View style={styles.portRow}>
            <View style={styles.portStat}>
              <Text style={{ fontSize: 16 }}>🥇</Text>
              <Text style={styles.portStatVal}>₵{totalGoldValue.toFixed(2)}</Text>
              <Text style={styles.portStatLabel}>Gold</Text>
            </View>
            <View style={styles.portStat}>
              <Text style={{ fontSize: 16 }}>📈</Text>
              <Text style={styles.portStatVal}>₵{totalShareValue.toFixed(2)}</Text>
              <Text style={styles.portStatLabel}>Shares</Text>
            </View>
          </View>
        </GlassCard>

        {/* Tab Switcher */}
        <View style={styles.tabSwitch}>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'gold' && styles.tabBtnActive]}
            onPress={() => setTab('gold')}
          >
            <Text style={[styles.tabBtnText, tab === 'gold' && styles.tabBtnTextActive]}>
              🥇 Gold & Commodities
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'shares' && styles.tabBtnActive]}
            onPress={() => setTab('shares')}
          >
            <Text style={[styles.tabBtnText, tab === 'shares' && styles.tabBtnTextActive]}>
              📈 Shares & Trading
            </Text>
          </TouchableOpacity>
        </View>

        {tab === 'gold' ? (
          <>
            {/* Gold Live Price */}
            <View style={styles.section}>
              <GlassCard>
                <View style={styles.goldHeader}>
                  <View>
                    <Text style={styles.goldTitle}>Gold (XAU)</Text>
                    <Text style={styles.goldPrice}>
                      ${goldPrice?.displayPrice.toFixed(2)}/g
                    </Text>
                  </View>
                  <View style={[
                    styles.changeBadge,
                    { backgroundColor: (goldPrice?.changePercent24h || 0) >= 0 ? Colors.successMuted : Colors.errorMuted }
                  ]}>
                    <Ionicons
                      name={(goldPrice?.changePercent24h || 0) >= 0 ? 'trending-up' : 'trending-down'}
                      size={14}
                      color={(goldPrice?.changePercent24h || 0) >= 0 ? Colors.success : Colors.error}
                    />
                    <Text style={{
                      fontSize: 13, fontWeight: '700',
                      color: (goldPrice?.changePercent24h || 0) >= 0 ? Colors.success : Colors.error,
                    }}>
                      {(goldPrice?.changePercent24h || 0).toFixed(2)}%
                    </Text>
                  </View>
                </View>

                {/* Price Chart */}
                {renderMiniChart()}

                <View style={styles.goldStats}>
                  <View style={styles.goldStatItem}>
                    <Text style={styles.goldStatLabel}>You Own</Text>
                    <Text style={styles.goldStatVal}>{totalGoldGrams.toFixed(4)}g</Text>
                  </View>
                  <View style={styles.goldStatItem}>
                    <Text style={styles.goldStatLabel}>Value</Text>
                    <Text style={styles.goldStatVal}>₵{totalGoldValue.toFixed(2)}</Text>
                  </View>
                  <View style={styles.goldStatItem}>
                    <Text style={styles.goldStatLabel}>Spread</Text>
                    <Text style={styles.goldStatVal}>$0.80/g</Text>
                  </View>
                </View>

                <GradientButton
                  title="Buy Gold"
                  variant="gold" size="lg"
                  onPress={() => setShowBuyGold(true)}
                  icon={<Ionicons name="add-circle" size={20} color={Colors.textInverse} />}
                  style={{ marginTop: Spacing.lg }}
                />
              </GlassCard>
            </View>

            {/* Fractional Info */}
            <View style={styles.section}>
              <GlassCard variant="gold">
                <View style={styles.fracRow}>
                  <Ionicons name="sparkles" size={24} color={Colors.gold} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.fracTitle}>Fractional Ownership</Text>
                    <Text style={styles.fracDesc}>
                      Buy as little as $10 worth of Gold. No minimum grams required.
                    </Text>
                  </View>
                </View>
              </GlassCard>
            </View>
          </>
        ) : (
          <>
            {/* Shares List */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Market Prices</Text>
              {sharePrices.map((share) => (
                <GlassCard key={share.symbol} style={{ marginTop: 10 }}>
                  <View style={styles.shareRow}>
                    <View style={styles.shareLeft}>
                      <View style={styles.shareIcon}>
                        <Text style={styles.shareSymbol}>{share.symbol.slice(0, 2)}</Text>
                      </View>
                      <View>
                        <Text style={styles.shareName}>{share.companyName}</Text>
                        <Text style={styles.shareSymbolText}>{share.symbol}</Text>
                      </View>
                    </View>
                    <View style={styles.shareRight}>
                      <Text style={styles.sharePrice}>₵{share.displayPrice.toFixed(2)}</Text>
                      <Text style={{
                        fontSize: 12, fontWeight: '600',
                        color: share.changePercent >= 0 ? Colors.success : Colors.error,
                      }}>
                        {share.changePercent >= 0 ? '+' : ''}{share.changePercent.toFixed(2)}%
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.buyShareBtn}
                      onPress={() => { setSelectedShare(share.symbol); setShowBuyShare(true); }}
                    >
                      <Text style={styles.buyShareBtnText}>Buy</Text>
                    </TouchableOpacity>
                  </View>
                </GlassCard>
              ))}
            </View>

            {/* Holdings */}
            {shareHoldings.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Your Holdings</Text>
                {shareHoldings.map((h) => {
                  const pnl = (h.currentPrice - h.averageBuyPrice) * h.sharesOwned;
                  return (
                    <GlassCard key={h.id} style={{ marginTop: 10 }}>
                      <View style={styles.holdingRow}>
                        <View>
                          <Text style={styles.holdingName}>{h.companyName}</Text>
                          <Text style={styles.holdingQty}>{h.sharesOwned} shares</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={styles.holdingValue}>
                            ₵{(h.sharesOwned * h.currentPrice).toFixed(2)}
                          </Text>
                          <Text style={{
                            fontSize: 13, fontWeight: '600',
                            color: pnl >= 0 ? Colors.success : Colors.error,
                          }}>
                            {pnl >= 0 ? '+' : ''}₵{pnl.toFixed(2)}
                          </Text>
                        </View>
                      </View>
                    </GlassCard>
                  );
                })}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Buy Gold Modal */}
      <Modal visible={showBuyGold} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Buy Gold</Text>
            <Text style={styles.modalSub}>
              Current price: ${goldPrice?.displayPrice.toFixed(2)}/g
            </Text>
            <Text style={styles.modalSub}>
              Available: ₵{flexible.balance.toFixed(2)}
            </Text>
            <TextInput
              style={styles.input} placeholder="Amount to spend (₵)"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="decimal-pad" value={buyAmount}
              onChangeText={setBuyAmount}
            />
            {buyAmount && goldPrice ? (
              <View style={styles.preview}>
                <Text style={styles.previewText}>
                  You'll receive: {(parseFloat(buyAmount || '0') / goldPrice.displayPrice).toFixed(4)}g
                </Text>
              </View>
            ) : null}
            <View style={styles.quickAmounts}>
              {[10, 50, 100, 500].map((a) => (
                <TouchableOpacity
                  key={a} style={styles.quickBtn}
                  onPress={() => setBuyAmount(a.toString())}
                >
                  <Text style={styles.quickBtnText}>₵{a}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <GradientButton title="Cancel" variant="outline" size="sm"
                onPress={() => setShowBuyGold(false)} style={{ flex: 1 }} />
              <GradientButton title="Buy Gold" variant="gold" size="sm"
                onPress={handleBuyGold} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Buy Shares Modal */}
      <Modal visible={showBuyShare} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Buy {selectedShare} Shares</Text>
            <TextInput
              style={styles.input} placeholder="Number of shares"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="number-pad" value={shareQty}
              onChangeText={setShareQty}
            />
            {shareQty && selectedShare ? (() => {
              const p = sharePrices.find((s) => s.symbol === selectedShare);
              return p ? (
                <View style={styles.preview}>
                  <Text style={styles.previewText}>
                    Total: ₵{(p.displayPrice * parseInt(shareQty || '0')).toFixed(2)}
                  </Text>
                </View>
              ) : null;
            })() : null}
            <View style={styles.modalActions}>
              <GradientButton title="Cancel" variant="outline" size="sm"
                onPress={() => setShowBuyShare(false)} style={{ flex: 1 }} />
              <GradientButton title="Buy Shares" variant="blue" size="sm"
                onPress={handleBuyShares} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  section: { paddingHorizontal: Spacing.xl, marginTop: Spacing.xl },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  portLabel: { fontSize: 13, color: Colors.textSecondary },
  portValue: { fontSize: 32, fontWeight: '800', color: Colors.textPrimary, marginTop: 4 },
  portRow: { flexDirection: 'row', marginTop: Spacing.lg, gap: Spacing.xl },
  portStat: { flex: 1, alignItems: 'center', gap: 4 },
  portStatVal: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  portStatLabel: { fontSize: 12, color: Colors.textTertiary },
  tabSwitch: {
    flexDirection: 'row', marginHorizontal: Spacing.xl,
    marginTop: Spacing.xl, backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg, padding: 4,
  },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: BorderRadius.md },
  tabBtnActive: { backgroundColor: Colors.backgroundTertiary },
  tabBtnText: { fontSize: 13, color: Colors.textTertiary, fontWeight: '500' },
  tabBtnTextActive: { color: Colors.textPrimary, fontWeight: '700' },
  goldHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  goldTitle: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  goldPrice: { fontSize: 28, fontWeight: '800', color: Colors.gold, marginTop: 4 },
  changeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: BorderRadius.full,
  },
  chartContainer: {
    flexDirection: 'row', marginTop: Spacing.lg, height: 130,
  },
  chartYAxis: {
    width: 50, justifyContent: 'space-between', paddingVertical: 4,
  },
  chartLabel: { fontSize: 10, color: Colors.textTertiary },
  chartLine: { position: 'relative', flex: 1 },
  chartDot: { position: 'absolute' },
  goldStats: { flexDirection: 'row', marginTop: Spacing.lg, gap: Spacing.md },
  goldStatItem: { flex: 1 },
  goldStatLabel: { fontSize: 11, color: Colors.textTertiary },
  goldStatVal: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginTop: 2 },
  fracRow: { flexDirection: 'row', alignItems: 'center' },
  fracTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  fracDesc: { fontSize: 13, color: Colors.textSecondary, marginTop: 4, lineHeight: 18 },
  shareRow: { flexDirection: 'row', alignItems: 'center' },
  shareLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  shareIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.backgroundTertiary,
    alignItems: 'center', justifyContent: 'center',
  },
  shareSymbol: { fontSize: 13, fontWeight: '800', color: Colors.gold },
  shareName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  shareSymbolText: { fontSize: 12, color: Colors.textTertiary },
  shareRight: { alignItems: 'flex-end', marginRight: 12 },
  sharePrice: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  buyShareBtn: {
    backgroundColor: Colors.goldMuted, paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: BorderRadius.lg, borderWidth: 1, borderColor: Colors.borderGold,
  },
  buyShareBtnText: { fontSize: 13, fontWeight: '700', color: Colors.gold },
  holdingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  holdingName: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  holdingQty: { fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
  holdingValue: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  modalOverlay: { flex: 1, backgroundColor: Colors.overlay, justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.backgroundSecondary,
    borderTopLeftRadius: BorderRadius['2xl'], borderTopRightRadius: BorderRadius['2xl'],
    padding: Spacing['2xl'],
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  modalSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  input: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.lg, marginTop: Spacing.lg,
    color: Colors.textPrimary, fontSize: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  preview: {
    marginTop: Spacing.md, backgroundColor: Colors.goldSubtle,
    padding: Spacing.md, borderRadius: BorderRadius.md,
  },
  previewText: { fontSize: 14, color: Colors.gold, fontWeight: '600' },
  quickAmounts: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md },
  quickBtn: {
    flex: 1, paddingVertical: 10, alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border,
  },
  quickBtnText: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  modalActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.xl },
});
