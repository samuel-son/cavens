/**
 * Cavens Savings App - Type definitions
 * Currency-agnostic, global-ready
 */

export type SavingsMode = 'locked' | 'flexible';

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface MomoNumber {
  id: string;
  number: string;
  provider: 'momo' | 'telecel';
  label?: string;
  savingsPercentage: number;
  isActive: boolean;
  createdAt: string;
}

export interface PendingSavings {
  id: string;
  amountReceived: number;
  savingsAmount: number;
  percentage: number;
  sourceNumber: string;
  timestamp: string;
  message?: string;
}

export interface SavingsTransaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  fee?: number;
  netAmount?: number;
  mode: SavingsMode;
  status: TransactionStatus;
  timestamp: string;
  sourceNumber?: string;
  reference?: string;
}

export interface UserSettings {
  defaultSavingsPercentage: number;
  autoSaveEnabled: boolean;
  savingsMode: SavingsMode;
  lockedDurationMonths?: number;
  lockedEndDate?: string;
  currency: string;
  locale: string;
}

export interface WalletBalance {
  total: number;
  locked: number;
  flexible: number;
  pending: number;
}
