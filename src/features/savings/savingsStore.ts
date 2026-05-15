// ============================================================
// SAVINGS STORE — Zustand State Management
// ============================================================
import { create } from 'zustand';
import {
  FixedVault,
  FlexibleSavings,
  Transaction,
  SubscriptionTier,
  PLATFORM_CONSTANTS,
} from '../portfolio/types';
import {
  calculateWithdrawal,
  withdrawFromFixedVault,
  createFixedVault,
  calculateAccruedInterest,
  deductForUtility,
} from './savingsService';

interface SavingsState {
  flexible: FlexibleSavings;
  fixedVaults: FixedVault[];
  transactions: Transaction[];
  subscriptionTier: SubscriptionTier;

  // Actions
  depositToFlexible: (amount: number) => void;
  withdrawFromFlexible: (amount: number) => { success: boolean; message: string };
  createVault: (name: string, amount: number, months: number) => boolean;
  breakVault: (vaultId: string) => { success: boolean; message: string };
  withdrawMaturedVault: (vaultId: string) => { success: boolean; message: string };
  deductUtilityPayment: (amount: number) => { success: boolean; message: string };
  updateAccruedInterest: () => void;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  getTotalSavings: () => number;
}

export const useSavingsStore = create<SavingsState>((set, get) => ({
  flexible: {
    balance: 5250.00,
    interestRate: PLATFORM_CONSTANTS.FLEXIBLE_INTEREST_RATE,
    totalDeposited: 6000.00,
    totalWithdrawn: 750.00,
    lastInterestPaid: new Date(),
  },
  fixedVaults: [
    {
      id: 'vault_demo_1',
      name: 'Emergency Fund',
      principal: 10000.00,
      interestRate: PLATFORM_CONSTANTS.FIXED_INTEREST_RATE_12M,
      penaltyRate: PLATFORM_CONSTANTS.EARLY_BREAK_PENALTY,
      lockUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      status: 'active',
      accruedInterest: 65.75,
    },
    {
      id: 'vault_demo_2',
      name: 'Vacation Fund',
      principal: 3500.00,
      interestRate: PLATFORM_CONSTANTS.FIXED_INTEREST_RATE_6M,
      penaltyRate: PLATFORM_CONSTANTS.EARLY_BREAK_PENALTY,
      lockUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      status: 'active',
      accruedInterest: 28.50,
    },
  ],
  transactions: [],
  subscriptionTier: 'free',

  depositToFlexible: (amount) => {
    set((state) => ({
      flexible: {
        ...state.flexible,
        balance: state.flexible.balance + amount,
        totalDeposited: state.flexible.totalDeposited + amount,
      },
      transactions: [
        {
          id: `tx_${Date.now()}`,
          userId: 'user_1',
          type: 'deposit',
          amount,
          fee: 0,
          netAmount: amount,
          description: `Deposit to Flexible Savings`,
          status: 'completed',
          createdAt: new Date(),
        },
        ...state.transactions,
      ],
    }));
  },

  withdrawFromFlexible: (amount) => {
    const state = get();
    const result = calculateWithdrawal(amount, state.flexible.balance, state.subscriptionTier);

    if (!result.success) {
      return { success: false, message: result.error || result.message };
    }

    set((s) => ({
      flexible: {
        ...s.flexible,
        balance: s.flexible.balance - amount,
        totalWithdrawn: s.flexible.totalWithdrawn + result.netAmount,
      },
      transactions: [
        {
          id: `tx_${Date.now()}`,
          userId: 'user_1',
          type: 'withdrawal',
          amount,
          fee: result.fee,
          netAmount: result.netAmount,
          description: result.message,
          status: 'completed',
          createdAt: new Date(),
        },
        ...s.transactions,
      ],
    }));

    return { success: true, message: result.message };
  },

  createVault: (name, amount, months) => {
    const state = get();
    if (amount > state.flexible.balance) return false;

    const vault = createFixedVault(name, amount, months);

    set((s) => ({
      flexible: {
        ...s.flexible,
        balance: s.flexible.balance - amount,
      },
      fixedVaults: [...s.fixedVaults, vault],
      transactions: [
        {
          id: `tx_${Date.now()}`,
          userId: 'user_1',
          type: 'transfer',
          amount,
          fee: 0,
          netAmount: amount,
          description: `Locked ₵${amount.toFixed(2)} in "${name}" for ${months} months`,
          status: 'completed',
          createdAt: new Date(),
        },
        ...s.transactions,
      ],
    }));

    return true;
  },

  breakVault: (vaultId) => {
    const state = get();
    const vault = state.fixedVaults.find((v) => v.id === vaultId);
    if (!vault) return { success: false, message: 'Vault not found' };

    const result = withdrawFromFixedVault(vault, true);
    if (!result.success) {
      return { success: false, message: result.error || result.message };
    }

    set((s) => ({
      flexible: {
        ...s.flexible,
        balance: s.flexible.balance + result.netAmount,
      },
      fixedVaults: s.fixedVaults.map((v) =>
        v.id === vaultId ? { ...v, status: 'broken' as const } : v
      ),
      transactions: [
        {
          id: `tx_${Date.now()}`,
          userId: 'user_1',
          type: 'penalty',
          amount: vault.principal,
          fee: result.fee,
          netAmount: result.netAmount,
          description: result.message,
          status: 'completed',
          createdAt: new Date(),
        },
        ...s.transactions,
      ],
    }));

    return { success: true, message: result.message };
  },

  withdrawMaturedVault: (vaultId) => {
    const state = get();
    const vault = state.fixedVaults.find((v) => v.id === vaultId);
    if (!vault) return { success: false, message: 'Vault not found' };

    const result = withdrawFromFixedVault(vault, false);
    if (!result.success) {
      return { success: false, message: result.error || 'Funds Locked' };
    }

    set((s) => ({
      flexible: {
        ...s.flexible,
        balance: s.flexible.balance + result.netAmount,
      },
      fixedVaults: s.fixedVaults.map((v) =>
        v.id === vaultId ? { ...v, status: 'matured' as const } : v
      ),
      transactions: [
        {
          id: `tx_${Date.now()}`,
          userId: 'user_1',
          type: 'interest',
          amount: result.amount,
          fee: 0,
          netAmount: result.netAmount,
          description: result.message,
          status: 'completed',
          createdAt: new Date(),
        },
        ...s.transactions,
      ],
    }));

    return { success: true, message: result.message };
  },

  deductUtilityPayment: (amount) => {
    const state = get();
    const result = deductForUtility(state.flexible.balance, amount);

    if (!result.success) {
      return { success: false, message: result.error || result.message };
    }

    set((s) => ({
      flexible: {
        ...s.flexible,
        balance: s.flexible.balance - amount,
      },
    }));

    return { success: true, message: result.message };
  },

  updateAccruedInterest: () => {
    set((state) => ({
      fixedVaults: state.fixedVaults.map((vault) => {
        if (vault.status !== 'active') return vault;
        return {
          ...vault,
          accruedInterest: calculateAccruedInterest(vault),
        };
      }),
    }));
  },

  setSubscriptionTier: (tier) => set({ subscriptionTier: tier }),

  getTotalSavings: () => {
    const state = get();
    const fixedTotal = state.fixedVaults
      .filter((v) => v.status === 'active')
      .reduce((sum, v) => sum + v.principal + v.accruedInterest, 0);
    return state.flexible.balance + fixedTotal;
  },
}));
