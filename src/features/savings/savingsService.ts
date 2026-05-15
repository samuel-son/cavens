// ============================================================
// SAVINGS SERVICE — Financial Engine Logic
// ============================================================
import {
  FixedVault,
  FlexibleSavings,
  WithdrawalResult,
  PLATFORM_CONSTANTS,
  SubscriptionTier,
} from '../portfolio/types';

/**
 * Calculate withdrawal from Flexible Savings.
 * Applies 2% platform fee (waived for Gold members).
 */
export function calculateWithdrawal(
  amount: number,
  currentBalance: number,
  subscriptionTier: SubscriptionTier = 'free'
): WithdrawalResult {
  // Validate amount
  if (amount <= 0) {
    return {
      success: false,
      amount: 0,
      fee: 0,
      netAmount: 0,
      message: 'Invalid withdrawal amount',
      error: 'Amount must be greater than zero',
    };
  }

  if (amount > currentBalance) {
    return {
      success: false,
      amount,
      fee: 0,
      netAmount: 0,
      message: 'Insufficient balance',
      error: `Requested ₵${amount.toFixed(2)} but only ₵${currentBalance.toFixed(2)} available`,
    };
  }

  // Gold members get 0% fee
  const feeRate = subscriptionTier === 'gold' ? 0 : PLATFORM_CONSTANTS.WITHDRAWAL_FEE_RATE;
  const fee = amount * feeRate;
  const netAmount = amount - fee;

  return {
    success: true,
    amount,
    fee,
    netAmount,
    message: feeRate > 0
      ? `₵${fee.toFixed(2)} platform fee applied (${(feeRate * 100).toFixed(0)}%)`
      : 'No fees applied (Gold Member)',
  };
}

/**
 * Attempt to withdraw from a Fixed Vault.
 * Strictly disabled if current date < lock_until.
 */
export function withdrawFromFixedVault(
  vault: FixedVault,
  forceBreak: boolean = false
): WithdrawalResult {
  const now = new Date();
  const lockDate = new Date(vault.lockUntil);

  // Check if vault has matured
  if (now < lockDate) {
    if (!forceBreak) {
      return {
        success: false,
        amount: vault.principal,
        fee: 0,
        netAmount: 0,
        message: 'Funds Locked',
        error: `Vault is locked until ${lockDate.toLocaleDateString()}. Cannot withdraw before maturity date.`,
      };
    }

    // Emergency early break — 10% penalty
    const penalty = vault.principal * PLATFORM_CONSTANTS.EARLY_BREAK_PENALTY;
    const netAmount = vault.principal - penalty;

    return {
      success: true,
      amount: vault.principal,
      fee: penalty,
      netAmount,
      message: `Early break penalty: ₵${penalty.toFixed(2)} (${(PLATFORM_CONSTANTS.EARLY_BREAK_PENALTY * 100).toFixed(0)}% of principal)`,
    };
  }

  // Vault matured — return principal + accrued interest
  const totalAmount = vault.principal + vault.accruedInterest;
  return {
    success: true,
    amount: totalAmount,
    fee: 0,
    netAmount: totalAmount,
    message: `Vault matured! Principal: ₵${vault.principal.toFixed(2)} + Interest: ₵${vault.accruedInterest.toFixed(2)}`,
  };
}

/**
 * Calculate interest accrued on a fixed vault.
 */
export function calculateAccruedInterest(vault: FixedVault): number {
  const now = new Date();
  const created = new Date(vault.createdAt);
  const daysElapsed = Math.floor(
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
  );
  const dailyRate = vault.interestRate / 365;
  return vault.principal * dailyRate * daysElapsed;
}

/**
 * Calculate daily interest on flexible savings.
 */
export function calculateFlexibleInterest(
  savings: FlexibleSavings,
  subscriptionTier: SubscriptionTier = 'free'
): number {
  const rate = subscriptionTier === 'gold'
    ? PLATFORM_CONSTANTS.FLEXIBLE_INTEREST_RATE_PRO
    : PLATFORM_CONSTANTS.FLEXIBLE_INTEREST_RATE;
  const dailyRate = rate / 365;
  return savings.balance * dailyRate;
}

/**
 * Create a new Fixed Vault.
 */
export function createFixedVault(
  name: string,
  amount: number,
  durationMonths: number
): FixedVault {
  const now = new Date();
  const lockUntil = new Date(now);
  lockUntil.setMonth(lockUntil.getMonth() + durationMonths);

  const interestRate = durationMonths >= 12
    ? PLATFORM_CONSTANTS.FIXED_INTEREST_RATE_12M
    : PLATFORM_CONSTANTS.FIXED_INTEREST_RATE_6M;

  return {
    id: `vault_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    name,
    principal: amount,
    interestRate,
    penaltyRate: PLATFORM_CONSTANTS.EARLY_BREAK_PENALTY,
    lockUntil,
    createdAt: now,
    status: 'active',
    accruedInterest: 0,
  };
}

/**
 * Validate if user can afford a purchase from combined savings + investments.
 */
export function canAffordPurchase(
  price: number,
  flexibleBalance: number,
  investmentValue: number
): { canAfford: boolean; combinedBalance: number; shortfall: number } {
  const combinedBalance = flexibleBalance + investmentValue;
  return {
    canAfford: combinedBalance >= price,
    combinedBalance,
    shortfall: combinedBalance >= price ? 0 : price - combinedBalance,
  };
}

/**
 * Deduct from flexible savings for utility payments.
 */
export function deductForUtility(
  currentBalance: number,
  amount: number
): WithdrawalResult {
  if (amount > currentBalance) {
    return {
      success: false,
      amount,
      fee: 0,
      netAmount: 0,
      message: 'Insufficient flexible savings balance',
      error: `Need ₵${amount.toFixed(2)} but only ₵${currentBalance.toFixed(2)} available`,
    };
  }

  return {
    success: true,
    amount,
    fee: 0,
    netAmount: amount,
    message: `₵${amount.toFixed(2)} deducted from Flexible Savings`,
  };
}
