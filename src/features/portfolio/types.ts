// ============================================================
// CAVENS APP — Global Portfolio & Core Types
// ============================================================

// ---- User & Auth ----
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  pin: string; // hashed 4-digit PIN
  avatar?: string;
  kycVerified: boolean;
  subscription: SubscriptionTier;
  createdAt: Date;
}

export type SubscriptionTier = 'free' | 'gold';

// ---- Global Portfolio ----
export interface GlobalPortfolio {
  userId: string;
  savings: SavingsPortfolio;
  investments: InvestmentPortfolio;
  wallet: WalletBalance;
  totalNetWorth: number; // computed: savings + investments + wallet
}

export interface SavingsPortfolio {
  flexibleBalance: number;
  fixedVaults: FixedVault[];
  totalSavings: number; // flexible + sum of fixed principals
  interestEarned: number;
}

export interface InvestmentPortfolio {
  goldHoldings: GoldHolding[];
  shareHoldings: ShareHolding[];
  totalInvestmentValue: number;
}

export interface WalletBalance {
  available: number;
  pending: number; // funds in escrow
  currency: Currency;
}

// ---- Savings Types ----
export interface FixedVault {
  id: string;
  name: string;
  principal: number;
  interestRate: number; // annual rate, e.g. 0.05 for 5%
  penaltyRate: number; // early break penalty, e.g. 0.10 for 10%
  lockUntil: Date;
  createdAt: Date;
  status: 'active' | 'matured' | 'broken';
  accruedInterest: number;
}

export interface FlexibleSavings {
  balance: number;
  interestRate: number; // e.g. 0.03 for 3%
  totalDeposited: number;
  totalWithdrawn: number;
  lastInterestPaid: Date;
}

// ---- Investment Types ----
export interface GoldHolding {
  id: string;
  gramsOwned: number;
  averageBuyPrice: number; // price per gram when purchased
  currentPrice: number;
  purchaseDate: Date;
}

export interface ShareHolding {
  id: string;
  symbol: string;
  companyName: string;
  sharesOwned: number;
  averageBuyPrice: number;
  currentPrice: number;
  purchaseDate: Date;
}

export interface CommodityPrice {
  asset: 'gold' | 'silver' | 'oil';
  marketPrice: number;
  displayPrice: number; // market + spread
  spread: number;
  currency: Currency;
  lastUpdated: Date;
  changePercent24h: number;
}

export interface SharePrice {
  symbol: string;
  companyName: string;
  price: number;
  displayPrice: number;
  spread: number;
  changePercent: number;
  volume: number;
  lastUpdated: Date;
}

// ---- Marketplace Types ----
export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: ProductCategory;
  isDistinctAsset: boolean; // true for houses, land, etc.
  condition: 'new' | 'used' | 'refurbished';
  status: 'available' | 'sold' | 'in_escrow';
  createdAt: Date;
  sellerCommissionRate: number; // 0.05 to 0.10
}

export type ProductCategory =
  | 'electronics'
  | 'fashion'
  | 'home'
  | 'vehicles'
  | 'real_estate'
  | 'land'
  | 'collectibles'
  | 'other';

export interface EscrowTransaction {
  id: string;
  productId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  platformFee: number;
  status: 'held' | 'released' | 'refunded' | 'disputed';
  createdAt: Date;
  releasedAt?: Date;
}

export interface SellerListing {
  id: string;
  sellerId: string;
  product: Product;
  totalSales: number;
  totalEarnings: number;
  rating: number;
}

// ---- Utility/Bills Types ----
export type MobileProvider = 'MTN' | 'Telecel' | 'AT';
export type ElectricityType = 'prepaid' | 'postpaid';

export interface AirtimeTopUp {
  id: string;
  provider: MobileProvider;
  phoneNumber: string;
  amount: number;
  type: 'airtime' | 'data';
  dataBundle?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface ElectricityPayment {
  id: string;
  type: ElectricityType;
  meterNumber: string;
  customerName: string;
  amount: number;
  token?: string; // prepaid token
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

// ---- Transaction Types ----
export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'transfer'
  | 'purchase'
  | 'sale'
  | 'investment_buy'
  | 'investment_sell'
  | 'airtime'
  | 'electricity'
  | 'subscription'
  | 'interest'
  | 'penalty'
  | 'fee';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  fee: number;
  netAmount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  metadata?: Record<string, unknown>;
}

// ---- Payment Integration Types ----
export type PaymentMethod = 'mobile_money' | 'bank_card' | 'bank_transfer';

export interface PaymentRequest {
  amount: number;
  currency: Currency;
  method: PaymentMethod;
  provider?: MobileProvider;
  reference: string;
  callbackUrl?: string;
}

export interface PaymentResponse {
  success: boolean;
  reference: string;
  transactionId?: string;
  message: string;
}

// ---- Subscription ----
export interface Subscription {
  userId: string;
  tier: SubscriptionTier;
  price: number; // monthly price
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  benefits: SubscriptionBenefit[];
}

export interface SubscriptionBenefit {
  name: string;
  description: string;
  value: string;
}

// ---- Enums & Constants ----
export type Currency = 'GHS' | 'NGN' | 'USD';

export const PLATFORM_CONSTANTS = {
  WITHDRAWAL_FEE_RATE: 0.02,      // 2% exit fee
  EARLY_BREAK_PENALTY: 0.10,      // 10% penalty
  GOLD_SPREAD_PER_GRAM: 0.80,     // $0.80 spread
  SELLER_COMMISSION_MIN: 0.05,    // 5% min
  SELLER_COMMISSION_MAX: 0.10,    // 10% max
  DISTINCT_ASSET_FEE: 0.015,      // 1.5% closing fee
  CUSTODIAL_FEE_ANNUAL: 0.001,    // 0.1% per year
  GOLD_MEMBER_PRICE: 1.99,        // $1.99/month
  FLEXIBLE_INTEREST_RATE: 0.03,   // 3% for free users
  FLEXIBLE_INTEREST_RATE_PRO: 0.05, // 5% for pro users
  FIXED_INTEREST_RATE_6M: 0.05,   // 5% for 6-month lock
  FIXED_INTEREST_RATE_12M: 0.08,  // 8% for 12-month lock
  DEFAULT_CURRENCY: 'GHS' as Currency,
};

// ---- Withdrawal Result ----
export interface WithdrawalResult {
  success: boolean;
  amount: number;
  fee: number;
  netAmount: number;
  message: string;
  error?: string;
}

// ---- Price History for Charts ----
export interface PricePoint {
  timestamp: Date;
  price: number;
}
