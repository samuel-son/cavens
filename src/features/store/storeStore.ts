// ============================================================
// STORE — Zustand State Management
// ============================================================
import { create } from 'zustand';
import { Product, EscrowTransaction } from '../portfolio/types';
import { createEscrow, releaseEscrow } from './storeService';

// Mock products
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    sellerId: 'seller_1',
    title: 'iPhone 15 Pro Max',
    description: '256GB, Natural Titanium. Brand new, sealed.',
    price: 8500.00,
    images: ['https://picsum.photos/400/400?random=1'],
    category: 'electronics',
    isDistinctAsset: false,
    condition: 'new',
    status: 'available',
    createdAt: new Date(),
    sellerCommissionRate: 0.07,
  },
  {
    id: 'prod_2',
    sellerId: 'seller_2',
    title: 'MacBook Air M3',
    description: '15-inch, 16GB RAM, 512GB SSD. Midnight.',
    price: 12000.00,
    images: ['https://picsum.photos/400/400?random=2'],
    category: 'electronics',
    isDistinctAsset: false,
    condition: 'new',
    status: 'available',
    createdAt: new Date(),
    sellerCommissionRate: 0.07,
  },
  {
    id: 'prod_3',
    sellerId: 'seller_3',
    title: 'Nike Air Jordan 4 Retro',
    description: 'Size 42. Military Black colorway.',
    price: 1200.00,
    images: ['https://picsum.photos/400/400?random=3'],
    category: 'fashion',
    isDistinctAsset: false,
    condition: 'new',
    status: 'available',
    createdAt: new Date(),
    sellerCommissionRate: 0.07,
  },
  {
    id: 'prod_4',
    sellerId: 'seller_4',
    title: 'Samsung Galaxy S24 Ultra',
    description: '512GB, Titanium Gray. Unlocked.',
    price: 7200.00,
    images: ['https://picsum.photos/400/400?random=4'],
    category: 'electronics',
    isDistinctAsset: false,
    condition: 'new',
    status: 'available',
    createdAt: new Date(),
    sellerCommissionRate: 0.07,
  },
  {
    id: 'prod_5',
    sellerId: 'seller_5',
    title: 'PS5 Pro Bundle',
    description: 'PS5 Pro + 2 controllers + 3 games.',
    price: 4500.00,
    images: ['https://picsum.photos/400/400?random=5'],
    category: 'electronics',
    isDistinctAsset: false,
    condition: 'new',
    status: 'available',
    createdAt: new Date(),
    sellerCommissionRate: 0.07,
  },
  {
    id: 'prod_6',
    sellerId: 'seller_6',
    title: '3-Bedroom House — East Legon',
    description: 'Fully furnished, gated community, pool access.',
    price: 450000.00,
    images: ['https://picsum.photos/400/400?random=6'],
    category: 'real_estate',
    isDistinctAsset: true,
    condition: 'new',
    status: 'available',
    createdAt: new Date(),
    sellerCommissionRate: 0.015,
  },
  {
    id: 'prod_7',
    sellerId: 'seller_7',
    title: 'Plot of Land — Tema Community 25',
    description: '1 acre, documented, ready to build.',
    price: 120000.00,
    images: ['https://picsum.photos/400/400?random=7'],
    category: 'land',
    isDistinctAsset: true,
    condition: 'new',
    status: 'available',
    createdAt: new Date(),
    sellerCommissionRate: 0.015,
  },
  {
    id: 'prod_8',
    sellerId: 'seller_8',
    title: 'Louis Vuitton Keepall 55',
    description: 'Monogram canvas. Authentic, with receipt.',
    price: 3800.00,
    images: ['https://picsum.photos/400/400?random=8'],
    category: 'fashion',
    isDistinctAsset: false,
    condition: 'new',
    status: 'available',
    createdAt: new Date(),
    sellerCommissionRate: 0.07,
  },
];

interface StoreState {
  products: Product[];
  escrows: EscrowTransaction[];
  selectedProduct: Product | null;

  // Actions
  purchaseProduct: (productId: string, buyerId: string) => EscrowTransaction | null;
  confirmReceipt: (escrowId: string) => { sellerPayout: number; platformRevenue: number } | null;
  listProduct: (product: Omit<Product, 'id' | 'createdAt' | 'status'>) => void;
  setSelectedProduct: (product: Product | null) => void;
}

export const useStoreStore = create<StoreState>((set, get) => ({
  products: MOCK_PRODUCTS,
  escrows: [],
  selectedProduct: null,

  purchaseProduct: (productId, buyerId) => {
    const product = get().products.find((p) => p.id === productId);
    if (!product || product.status !== 'available') return null;

    const escrow = createEscrow(product, buyerId);

    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, status: 'in_escrow' as const } : p
      ),
      escrows: [...state.escrows, escrow],
    }));

    return escrow;
  },

  confirmReceipt: (escrowId) => {
    const escrow = get().escrows.find((e) => e.id === escrowId);
    if (!escrow || escrow.status !== 'held') return null;

    const result = releaseEscrow(escrow);

    set((state) => ({
      escrows: state.escrows.map((e) =>
        e.id === escrowId ? { ...e, status: 'released' as const, releasedAt: new Date() } : e
      ),
      products: state.products.map((p) =>
        p.id === escrow.productId ? { ...p, status: 'sold' as const } : p
      ),
    }));

    return result;
  },

  listProduct: (productData) => {
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}`,
      createdAt: new Date(),
      status: 'available',
    };

    set((state) => ({
      products: [newProduct, ...state.products],
    }));
  },

  setSelectedProduct: (product) => set({ selectedProduct: product }),
}));
