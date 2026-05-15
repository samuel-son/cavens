import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../src/theme/colors';
import { Spacing, BorderRadius } from '../../src/theme/spacing';
import { GradientButton } from '../../src/components/ui/GradientButton';
import { PremiumHeader } from '../../src/components/ui/PremiumHeader';
import { useStoreStore } from '../../src/features/store/storeStore';
import { useSavingsStore } from '../../src/features/savings/savingsStore';
import { useWealthStore } from '../../src/features/wealth/wealthStore';
import { canAffordPurchase } from '../../src/features/savings/savingsService';
import { Product } from '../../src/features/portfolio/types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - Spacing.xl * 2 - Spacing.md) / 2;

// Specialized component for affordable products
function AffordableProductCard({ product, onBuy }: { product: Product; onBuy: () => void }) {
  return (
    <View style={[styles.productCard, styles.affordableCard]}>
      <LinearGradient
        colors={['rgba(52,211,153,0.12)', 'rgba(52,211,153,0.03)']}
        style={styles.affordableBadgeGlow}
      >
        <View style={styles.productImageBox}>
          <LinearGradient
            colors={['rgba(52,211,153,0.15)', 'rgba(52,211,153,0.05)']}
            style={styles.productImagePlaceholder}
          >
            <Ionicons
              name={product.category === 'electronics' ? 'phone-portrait' :
                product.category === 'fashion' ? 'shirt' : 'cube'}
              size={32} color={Colors.success}
            />
          </LinearGradient>
          <View style={styles.canAffordBadge}>
            <Ionicons name="checkmark-circle" size={12} color="#fff" />
            <Text style={styles.canAffordText}>Can Afford</Text>
          </View>
        </View>
        <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
        <Text style={styles.productPrice}>₵{product.price.toFixed(2)}</Text>
        <GradientButton
          title="Direct Purchase"
          variant="success" size="sm"
          onPress={onBuy}
          style={{ marginTop: 8 }}
        />
      </LinearGradient>
    </View>
  );
}

// Standard product card
function StandardProductCard({ product }: { product: Product }) {
  return (
    <View style={styles.productCard}>
      <View style={styles.productImageBox}>
        <View style={styles.productImagePlaceholder}>
          <Ionicons
            name={product.category === 'electronics' ? 'phone-portrait' :
              product.category === 'fashion' ? 'shirt' :
              product.category === 'real_estate' ? 'home' :
              product.category === 'land' ? 'map' : 'cube'}
            size={32} color={Colors.textTertiary}
          />
        </View>
        {product.isDistinctAsset && (
          <View style={styles.distinctBadge}>
            <Ionicons name="diamond" size={10} color={Colors.gold} />
            <Text style={styles.distinctText}>Premium</Text>
          </View>
        )}
      </View>
      <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
      <Text style={styles.productPrice}>₵{product.price.toFixed(2)}</Text>
      <View style={styles.productCondition}>
        <Text style={styles.conditionText}>{product.condition}</Text>
      </View>
    </View>
  );
}

export default function StoreScreen() {
  const { products, purchaseProduct } = useStoreStore();
  const { flexible } = useSavingsStore();
  const { getTotalValue } = useWealthStore();

  const combinedBalance = flexible.balance + getTotalValue();

  const handleDirectPurchase = useCallback((product: Product) => {
    const check = canAffordPurchase(product.price, flexible.balance, getTotalValue());
    if (!check.canAfford) {
      Alert.alert('Insufficient Balance', `You need ₵${check.shortfall.toFixed(2)} more`);
      return;
    }
    Alert.alert(
      'Confirm Purchase',
      `Buy "${product.title}" for ₵${product.price.toFixed(2)}?\n\nFunds will be held in escrow until you confirm receipt.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purchase', onPress: () => {
            const escrow = purchaseProduct(product.id, 'user_1');
            if (escrow) {
              Alert.alert('Success', 'Purchase confirmed! Funds held in escrow.');
            }
          },
        },
      ]
    );
  }, [flexible.balance]);

  const renderItem = useCallback(({ item }: { item: Product }) => {
    const isAffordable = item.price <= combinedBalance && item.status === 'available';

    if (isAffordable) {
      return <AffordableProductCard product={item} onBuy={() => handleDirectPurchase(item)} />;
    }
    return <StandardProductCard product={item} />;
  }, [combinedBalance]);

  return (
    <View style={styles.container}>
      <PremiumHeader
        title="The Store"
        subtitle={`Balance: ₵${combinedBalance.toFixed(2)}`}
        rightElement={
          <TouchableOpacity style={styles.sellBtn}>
            <Ionicons name="add-circle" size={18} color={Colors.gold} />
            <Text style={styles.sellBtnText}>Sell</Text>
          </TouchableOpacity>
        }
      />

      {/* Category pills */}
      <View style={styles.categories}>
        {['All', 'Electronics', 'Fashion', 'Real Estate', 'Land'].map((cat, i) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryPill, i === 0 && styles.categoryPillActive]}
          >
            <Text style={[styles.categoryText, i === 0 && styles.categoryTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlashList
        data={products.filter((p) => p.status !== 'sold')}
        renderItem={renderItem}
        estimatedItemSize={250}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: Spacing.xl, paddingBottom: 120 }}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  sellBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.goldSubtle, paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.borderGold,
  },
  sellBtnText: { color: Colors.gold, fontSize: 13, fontWeight: '600' },
  categories: {
    flexDirection: 'row', paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg, gap: Spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: BorderRadius.full, backgroundColor: Colors.surface,
    borderWidth: 1, borderColor: Colors.border,
  },
  categoryPillActive: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  categoryText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  categoryTextActive: { color: Colors.textInverse, fontWeight: '700' },
  productCard: {
    width: CARD_WIDTH, backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
    marginRight: Spacing.md,
  },
  affordableCard: {
    borderColor: 'rgba(52,211,153,0.3)', padding: 0, overflow: 'hidden',
  },
  affordableBadgeGlow: {
    padding: Spacing.md, borderRadius: BorderRadius.xl,
  },
  productImageBox: {
    width: '100%', aspectRatio: 1,
    borderRadius: BorderRadius.lg, overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  productImagePlaceholder: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: BorderRadius.lg,
  },
  canAffordBadge: {
    position: 'absolute', top: 8, right: 8,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.success, paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  canAffordText: { fontSize: 9, color: '#fff', fontWeight: '700' },
  distinctBadge: {
    position: 'absolute', top: 8, right: 8,
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: Colors.goldMuted, paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.borderGold,
  },
  distinctText: { fontSize: 9, color: Colors.gold, fontWeight: '700' },
  productTitle: {
    fontSize: 13, fontWeight: '600', color: Colors.textPrimary,
    marginBottom: 4,
  },
  productPrice: { fontSize: 17, fontWeight: '800', color: Colors.gold },
  productCondition: {
    marginTop: 6, backgroundColor: Colors.backgroundTertiary,
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  conditionText: { fontSize: 10, color: Colors.textSecondary, fontWeight: '500', textTransform: 'capitalize' },
});
