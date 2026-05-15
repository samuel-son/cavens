// ============================================================
// WEALTH SERVICE — Investment & Trading Logic
// ============================================================
import {
  CommodityPrice,
  SharePrice,
  GoldHolding,
  ShareHolding,
  PricePoint,
  PLATFORM_CONSTANTS,
} from '../portfolio/types';

/**
 * Apply spread to market price.
 */
export function applySpread(marketPrice: number, asset: 'gold' | 'share'): number {
  if (asset === 'gold') {
    return marketPrice + PLATFORM_CONSTANTS.GOLD_SPREAD_PER_GRAM;
  }
  // Shares: 1% spread
  return marketPrice * 1.01;
}

/**
 * Calculate fractional gold purchase.
 */
export function calculateGoldPurchase(
  amountToSpend: number,
  pricePerGram: number
): { grams: number; totalCost: number; displayPrice: number } {
  const displayPrice = applySpread(pricePerGram, 'gold');
  const grams = amountToSpend / displayPrice;
  return {
    grams: Math.round(grams * 10000) / 10000, // 4 decimal places
    totalCost: amountToSpend,
    displayPrice,
  };
}

/**
 * Calculate custodial fee.
 */
export function calculateCustodialFee(portfolioValue: number): number {
  return portfolioValue * PLATFORM_CONSTANTS.CUSTODIAL_FEE_ANNUAL;
}

/**
 * Generate mock price history.
 */
export function generatePriceHistory(
  basePrice: number,
  days: number = 30,
  volatility: number = 0.02
): PricePoint[] {
  const points: PricePoint[] = [];
  let price = basePrice;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const change = (Math.random() - 0.48) * volatility * price;
    price = Math.max(price * 0.8, price + change);

    points.push({
      timestamp: date,
      price: Math.round(price * 100) / 100,
    });
  }

  return points;
}

/**
 * Get mock commodity prices.
 */
export function getMockCommodityPrices(): CommodityPrice[] {
  const goldMarket = 75.00 + (Math.random() * 2 - 1);
  const silverMarket = 0.95 + (Math.random() * 0.1 - 0.05);

  return [
    {
      asset: 'gold',
      marketPrice: goldMarket,
      displayPrice: applySpread(goldMarket, 'gold'),
      spread: PLATFORM_CONSTANTS.GOLD_SPREAD_PER_GRAM,
      currency: 'USD',
      lastUpdated: new Date(),
      changePercent24h: (Math.random() * 4 - 2),
    },
    {
      asset: 'silver',
      marketPrice: silverMarket,
      displayPrice: applySpread(silverMarket, 'gold'),
      spread: 0.05,
      currency: 'USD',
      lastUpdated: new Date(),
      changePercent24h: (Math.random() * 6 - 3),
    },
  ];
}

/**
 * Get mock share prices.
 */
export function getMockSharePrices(): SharePrice[] {
  return [
    {
      symbol: 'MTN',
      companyName: 'MTN Ghana',
      price: 1.25 + (Math.random() * 0.1),
      displayPrice: applySpread(1.25, 'share'),
      spread: 0.01,
      changePercent: (Math.random() * 6 - 3),
      volume: Math.floor(Math.random() * 500000) + 100000,
      lastUpdated: new Date(),
    },
    {
      symbol: 'GCB',
      companyName: 'GCB Bank',
      price: 5.80 + (Math.random() * 0.3),
      displayPrice: applySpread(5.80, 'share'),
      spread: 0.06,
      changePercent: (Math.random() * 4 - 2),
      volume: Math.floor(Math.random() * 200000) + 50000,
      lastUpdated: new Date(),
    },
    {
      symbol: 'CAL',
      companyName: 'CalBank',
      price: 0.88 + (Math.random() * 0.05),
      displayPrice: applySpread(0.88, 'share'),
      spread: 0.01,
      changePercent: (Math.random() * 5 - 2.5),
      volume: Math.floor(Math.random() * 300000) + 80000,
      lastUpdated: new Date(),
    },
    {
      symbol: 'EGH',
      companyName: 'Ecobank Ghana',
      price: 7.50 + (Math.random() * 0.4),
      displayPrice: applySpread(7.50, 'share'),
      spread: 0.08,
      changePercent: (Math.random() * 3 - 1.5),
      volume: Math.floor(Math.random() * 150000) + 40000,
      lastUpdated: new Date(),
    },
    {
      symbol: 'TOTAL',
      companyName: 'TotalEnergies',
      price: 4.20 + (Math.random() * 0.2),
      displayPrice: applySpread(4.20, 'share'),
      spread: 0.04,
      changePercent: (Math.random() * 4 - 2),
      volume: Math.floor(Math.random() * 100000) + 30000,
      lastUpdated: new Date(),
    },
  ];
}
