// ============================================================
// WEALTH STORE — Zustand State Management
// ============================================================
import { create } from 'zustand';
import {
  GoldHolding,
  ShareHolding,
  CommodityPrice,
  SharePrice,
  PricePoint,
} from '../portfolio/types';
import {
  getMockCommodityPrices,
  getMockSharePrices,
  generatePriceHistory,
  calculateGoldPurchase,
  applySpread,
} from './wealthService';

interface WealthState {
  goldHoldings: GoldHolding[];
  shareHoldings: ShareHolding[];
  commodityPrices: CommodityPrice[];
  sharePrices: SharePrice[];
  goldPriceHistory: PricePoint[];
  totalInvestmentValue: number;

  // Actions
  refreshPrices: () => void;
  buyGold: (amountToSpend: number) => { success: boolean; grams: number };
  sellGold: (holdingId: string, grams: number) => { success: boolean; proceeds: number };
  buyShares: (symbol: string, quantity: number) => { success: boolean; totalCost: number };
  sellShares: (holdingId: string, quantity: number) => { success: boolean; proceeds: number };
  getTotalValue: () => number;
}

export const useWealthStore = create<WealthState>((set, get) => ({
  goldHoldings: [
    {
      id: 'gold_1',
      gramsOwned: 2.5,
      averageBuyPrice: 74.50,
      currentPrice: 75.80,
      purchaseDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    },
  ],
  shareHoldings: [
    {
      id: 'share_1',
      symbol: 'MTN',
      companyName: 'MTN Ghana',
      sharesOwned: 500,
      averageBuyPrice: 1.20,
      currentPrice: 1.26,
      purchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'share_2',
      symbol: 'GCB',
      companyName: 'GCB Bank',
      sharesOwned: 100,
      averageBuyPrice: 5.50,
      currentPrice: 5.86,
      purchaseDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    },
  ],
  commodityPrices: getMockCommodityPrices(),
  sharePrices: getMockSharePrices(),
  goldPriceHistory: generatePriceHistory(75.00, 30, 0.015),
  totalInvestmentValue: 0,

  refreshPrices: () => {
    const newCommodityPrices = getMockCommodityPrices();
    const newSharePrices = getMockSharePrices();

    set((state) => {
      const goldPrice = newCommodityPrices.find((c) => c.asset === 'gold');

      return {
        commodityPrices: newCommodityPrices,
        sharePrices: newSharePrices,
        goldHoldings: state.goldHoldings.map((h) => ({
          ...h,
          currentPrice: goldPrice?.displayPrice || h.currentPrice,
        })),
        shareHoldings: state.shareHoldings.map((h) => {
          const sharePrice = newSharePrices.find((s) => s.symbol === h.symbol);
          return {
            ...h,
            currentPrice: sharePrice?.displayPrice || h.currentPrice,
          };
        }),
        goldPriceHistory: [
          ...state.goldPriceHistory.slice(1),
          {
            timestamp: new Date(),
            price: goldPrice?.displayPrice || 75.80,
          },
        ],
      };
    });
  },

  buyGold: (amountToSpend) => {
    const goldPrice = get().commodityPrices.find((c) => c.asset === 'gold');
    if (!goldPrice) return { success: false, grams: 0 };

    const purchase = calculateGoldPurchase(amountToSpend, goldPrice.marketPrice);

    set((state) => ({
      goldHoldings: [
        ...state.goldHoldings,
        {
          id: `gold_${Date.now()}`,
          gramsOwned: purchase.grams,
          averageBuyPrice: purchase.displayPrice,
          currentPrice: purchase.displayPrice,
          purchaseDate: new Date(),
        },
      ],
    }));

    return { success: true, grams: purchase.grams };
  },

  sellGold: (holdingId, grams) => {
    const holding = get().goldHoldings.find((h) => h.id === holdingId);
    if (!holding || grams > holding.gramsOwned) return { success: false, proceeds: 0 };

    const proceeds = grams * holding.currentPrice;

    set((state) => ({
      goldHoldings: state.goldHoldings
        .map((h) =>
          h.id === holdingId
            ? { ...h, gramsOwned: h.gramsOwned - grams }
            : h
        )
        .filter((h) => h.gramsOwned > 0),
    }));

    return { success: true, proceeds };
  },

  buyShares: (symbol, quantity) => {
    const sharePrice = get().sharePrices.find((s) => s.symbol === symbol);
    if (!sharePrice) return { success: false, totalCost: 0 };

    const totalCost = sharePrice.displayPrice * quantity;

    set((state) => {
      const existing = state.shareHoldings.find((h) => h.symbol === symbol);
      if (existing) {
        const totalShares = existing.sharesOwned + quantity;
        const avgPrice =
          (existing.averageBuyPrice * existing.sharesOwned +
            sharePrice.displayPrice * quantity) /
          totalShares;

        return {
          shareHoldings: state.shareHoldings.map((h) =>
            h.symbol === symbol
              ? { ...h, sharesOwned: totalShares, averageBuyPrice: avgPrice }
              : h
          ),
        };
      }

      return {
        shareHoldings: [
          ...state.shareHoldings,
          {
            id: `share_${Date.now()}`,
            symbol,
            companyName: sharePrice.companyName,
            sharesOwned: quantity,
            averageBuyPrice: sharePrice.displayPrice,
            currentPrice: sharePrice.displayPrice,
            purchaseDate: new Date(),
          },
        ],
      };
    });

    return { success: true, totalCost };
  },

  sellShares: (holdingId, quantity) => {
    const holding = get().shareHoldings.find((h) => h.id === holdingId);
    if (!holding || quantity > holding.sharesOwned) return { success: false, proceeds: 0 };

    const proceeds = quantity * holding.currentPrice;

    set((state) => ({
      shareHoldings: state.shareHoldings
        .map((h) =>
          h.id === holdingId
            ? { ...h, sharesOwned: h.sharesOwned - quantity }
            : h
        )
        .filter((h) => h.sharesOwned > 0),
    }));

    return { success: true, proceeds };
  },

  getTotalValue: () => {
    const state = get();
    const goldValue = state.goldHoldings.reduce(
      (sum, h) => sum + h.gramsOwned * h.currentPrice,
      0
    );
    const shareValue = state.shareHoldings.reduce(
      (sum, h) => sum + h.sharesOwned * h.currentPrice,
      0
    );
    return goldValue + shareValue;
  },
}));
