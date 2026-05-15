// ============================================================
// SUBSCRIPTION SERVICE — Pro / Gold Member Logic
// ============================================================
import { Subscription, SubscriptionBenefit, PLATFORM_CONSTANTS } from '../features/portfolio/types';

export const GOLD_BENEFITS: SubscriptionBenefit[] = [
  {
    name: 'Zero Withdrawal Fees',
    description: 'No 2% exit fee on flexible savings withdrawals',
    value: 'Save 2% per withdrawal',
  },
  {
    name: 'Higher Interest Rate',
    description: 'Earn 5% p.a. instead of 3% on flexible savings',
    value: '5% p.a.',
  },
  {
    name: 'Priority Support',
    description: '24/7 dedicated customer support',
    value: 'Always available',
  },
  {
    name: 'Exclusive Deals',
    description: 'Access to premium marketplace deals before anyone else',
    value: 'Early access',
  },
  {
    name: 'Lower Trading Spread',
    description: 'Reduced spread on gold and share purchases',
    value: 'Save more',
  },
];

/**
 * Create a Gold subscription.
 */
export function createGoldSubscription(userId: string): Subscription {
  const now = new Date();
  const endDate = new Date(now);
  endDate.setMonth(endDate.getMonth() + 1);

  return {
    userId,
    tier: 'gold',
    price: PLATFORM_CONSTANTS.GOLD_MEMBER_PRICE,
    startDate: now,
    endDate,
    isActive: true,
    benefits: GOLD_BENEFITS,
  };
}

/**
 * Check if subscription is active.
 */
export function isSubscriptionActive(subscription: Subscription): boolean {
  return subscription.isActive && new Date() < new Date(subscription.endDate);
}
