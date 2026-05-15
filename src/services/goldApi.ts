// ============================================================
// GOLD API SERVICE — Live Price Fetching
// ============================================================
import { CommodityPrice } from '../features/portfolio/types';

const GOLD_API_BASE = 'https://www.goldapi.io/api';
const GOLD_API_KEY = 'goldapi-test-key'; // Replace in production

/**
 * Fetch live gold price from GoldAPI.
 * Falls back to mock data if API is unavailable.
 */
export async function fetchGoldPrice(): Promise<{
  pricePerGram: number;
  pricePerOz: number;
  change24h: number;
  currency: string;
}> {
  try {
    // In production:
    // const response = await axios.get(`${GOLD_API_BASE}/XAU/USD`, {
    //   headers: { 'x-access-token': GOLD_API_KEY }
    // });
    // const data = response.data;
    // return {
    //   pricePerGram: data.price_gram_24k,
    //   pricePerOz: data.price,
    //   change24h: data.ch,
    //   currency: 'USD',
    // };

    // Mock data
    const basePrice = 75.00;
    const fluctuation = (Math.random() - 0.48) * 2;

    return {
      pricePerGram: basePrice + fluctuation,
      pricePerOz: (basePrice + fluctuation) * 31.1035,
      change24h: fluctuation,
      currency: 'USD',
    };
  } catch (error) {
    // Fallback
    return {
      pricePerGram: 75.00,
      pricePerOz: 2332.76,
      change24h: 0,
      currency: 'USD',
    };
  }
}

/**
 * Fetch silver price (mock).
 */
export async function fetchSilverPrice(): Promise<{
  pricePerGram: number;
  change24h: number;
}> {
  return {
    pricePerGram: 0.95 + (Math.random() * 0.1 - 0.05),
    change24h: (Math.random() * 4 - 2),
  };
}
