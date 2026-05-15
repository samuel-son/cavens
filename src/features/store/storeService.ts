// ============================================================
// STORE SERVICE — Marketplace & Escrow Logic
// ============================================================
import {
  Product,
  EscrowTransaction,
  PLATFORM_CONSTANTS,
} from '../portfolio/types';

/**
 * Calculate seller commission.
 */
export function calculateSellerCommission(
  salePrice: number,
  isDistinctAsset: boolean
): { commission: number; sellerReceives: number; rate: number } {
  const rate = isDistinctAsset
    ? PLATFORM_CONSTANTS.DISTINCT_ASSET_FEE
    : 0.07; // 7% average for normal items

  const commission = salePrice * rate;
  return {
    commission,
    sellerReceives: salePrice - commission,
    rate,
  };
}

/**
 * Create an escrow transaction.
 */
export function createEscrow(
  product: Product,
  buyerId: string
): EscrowTransaction {
  const commission = calculateSellerCommission(product.price, product.isDistinctAsset);
  return {
    id: `escrow_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    productId: product.id,
    buyerId,
    sellerId: product.sellerId,
    amount: product.price,
    platformFee: commission.commission,
    status: 'held',
    createdAt: new Date(),
  };
}

/**
 * Release escrow funds to seller.
 */
export function releaseEscrow(
  escrow: EscrowTransaction
): { sellerPayout: number; platformRevenue: number } {
  return {
    sellerPayout: escrow.amount - escrow.platformFee,
    platformRevenue: escrow.platformFee,
  };
}

/**
 * Check if products are affordable with current savings.
 */
export function filterAffordableProducts(
  products: Product[],
  savingsBalance: number
): { affordable: Product[]; unaffordable: Product[] } {
  const affordable = products.filter((p) => p.price <= savingsBalance);
  const unaffordable = products.filter((p) => p.price > savingsBalance);
  return { affordable, unaffordable };
}
