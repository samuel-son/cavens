import { AirtimeTopUp, ElectricityPayment, MobileProvider, ElectricityType } from '../portfolio/types';

export const DATA_BUNDLES: Record<MobileProvider, { name: string; amount: number; data: string }[]> = {
  MTN: [
    { name: '1GB - 1 Day', amount: 3.00, data: '1GB' },
    { name: '5GB - 7 Days', amount: 15.00, data: '5GB' },
    { name: '10GB - 30 Days', amount: 30.00, data: '10GB' },
    { name: '20GB - 30 Days', amount: 50.00, data: '20GB' },
  ],
  Telecel: [
    { name: '1GB - 1 Day', amount: 2.50, data: '1GB' },
    { name: '3GB - 7 Days', amount: 10.00, data: '3GB' },
    { name: '8GB - 30 Days', amount: 25.00, data: '8GB' },
  ],
  AT: [
    { name: '500MB - 1 Day', amount: 1.50, data: '500MB' },
    { name: '2GB - 7 Days', amount: 8.00, data: '2GB' },
    { name: '6GB - 30 Days', amount: 20.00, data: '6GB' },
  ],
};

export const AIRTIME_AMOUNTS = [1, 2, 5, 10, 20, 50, 100];

export async function processAirtimeTopUp(
  provider: MobileProvider, phoneNumber: string, amount: number,
  type: 'airtime' | 'data' = 'airtime', dataBundle?: string
): Promise<AirtimeTopUp> {
  await new Promise((r) => setTimeout(r, 1500));
  if (phoneNumber.length < 10) throw new Error('Invalid phone number');
  return {
    id: `airtime_${Date.now()}`, provider, phoneNumber, amount, type,
    dataBundle, status: 'completed', createdAt: new Date(),
  };
}

export async function validateMeter(
  meterNumber: string, _type: ElectricityType
): Promise<{ valid: boolean; customerName: string; address: string }> {
  await new Promise((r) => setTimeout(r, 1000));
  if (meterNumber.length < 8) return { valid: false, customerName: '', address: '' };
  return { valid: true, customerName: 'Samuel Cavens', address: '12 Independence Ave, Accra' };
}

export async function processElectricityPayment(
  meterNumber: string, type: ElectricityType, amount: number, customerName: string
): Promise<ElectricityPayment> {
  await new Promise((r) => setTimeout(r, 2000));
  const token = type === 'prepaid'
    ? `${Math.floor(1000+Math.random()*9000)}-${Math.floor(1000+Math.random()*9000)}-${Math.floor(1000+Math.random()*9000)}-${Math.floor(1000+Math.random()*9000)}`
    : undefined;
  return {
    id: `elec_${Date.now()}`, type, meterNumber, customerName,
    amount, token, status: 'completed', createdAt: new Date(),
  };
}
