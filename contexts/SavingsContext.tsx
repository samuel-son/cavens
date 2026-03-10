import React, { createContext, useCallback, useContext, useState } from 'react';
import type {
  MomoNumber,
  PendingSavings,
  SavingsTransaction,
  UserSettings,
  WalletBalance,
} from '@/types';

const COMMISSION_RATE = 0.05;

type AccountType = 'locked' | 'flexible';

interface SavingsContextType {
  wallet: WalletBalance;
  pendingSavings: PendingSavings[];
  transactions: SavingsTransaction[];
  momoNumbers: MomoNumber[];
  settings: UserSettings;
  addPendingSavings: (item: PendingSavings) => void;
  completePendingSavings: (id: string, mode: AccountType, lockedEndDate?: string) => void;
  addDeposit: (amount: number, mode: AccountType, sourceLabel: string, lockedEndDate?: string) => void;
  addTransaction: (tx: SavingsTransaction) => void;
  withdraw: (amount: number, from: AccountType) => { net: number; fee: number; ok: boolean };
  updateSettings: (s: Partial<UserSettings>) => void;
  addMomoNumber: (momo: MomoNumber) => void;
  updateMomoNumber: (id: string, updates: Partial<MomoNumber>) => void;
  isLockedDue: () => boolean;
}

const defaultSettings: UserSettings = {
  defaultSavingsPercentage: 10,
  autoSaveEnabled: true,
  savingsMode: 'flexible',
  currency: 'XAF',
  locale: 'en',
};

const defaultContext: SavingsContextType = {
  wallet: { total: 0, locked: 0, flexible: 0, pending: 0 },
  pendingSavings: [],
  transactions: [],
  momoNumbers: [],
  settings: defaultSettings,
  addPendingSavings: () => {},
  completePendingSavings: () => {},
  addDeposit: () => {},
  addTransaction: () => {},
  withdraw: () => ({ net: 0, fee: 0, ok: false }),
  isLockedDue: () => false,
  updateSettings: () => {},
  addMomoNumber: () => {},
  updateMomoNumber: () => {},
};

const SavingsContext = createContext<SavingsContextType>(defaultContext);

export function SavingsProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<WalletBalance>({
    total: 0,
    locked: 0,
    flexible: 0,
    pending: 0,
  });
  const [pendingSavings, setPendingSavings] = useState<PendingSavings[]>([]);
  const [transactions, setTransactions] = useState<SavingsTransaction[]>([]);
  const [momoNumbers, setMomoNumbers] = useState<MomoNumber[]>([]);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  const addPendingSavings = useCallback((item: PendingSavings) => {
    setPendingSavings((prev) => [item, ...prev]);
  }, []);

  const completePendingSavings = useCallback((id: string, mode: AccountType, lockedEndDate?: string) => {
    setPendingSavings((prev) => {
      const item = prev.find((p) => p.id === id);
      if (!item) return prev;
      const amount = item.savingsAmount;
      setWallet((w) => ({
        ...w,
        [mode]: w[mode] + amount,
        total: w.total + amount,
      }));
      setTransactions((t) => [
        ...t,
        {
          id: `tx-${Date.now()}`,
          type: 'deposit',
          amount,
          mode,
          status: 'completed',
          timestamp: new Date().toISOString(),
          sourceNumber: item.sourceNumber,
        },
      ]);
      if (mode === 'locked' && lockedEndDate) {
        setSettings((s) => ({ ...s, lockedEndDate }));
      }
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const addDeposit = useCallback((amount: number, mode: AccountType, sourceLabel: string, lockedEndDate?: string) => {
    if (amount <= 0) return;
    setWallet((w) => ({
      ...w,
      [mode]: w[mode] + amount,
      total: w.total + amount,
    }));
    setTransactions((t) => [
      ...t,
      {
        id: `tx-${Date.now()}`,
        type: 'deposit',
        amount,
        mode,
        status: 'completed' as const,
        timestamp: new Date().toISOString(),
        sourceNumber: sourceLabel,
      },
    ]);
    if (mode === 'locked' && lockedEndDate) {
      setSettings((s) => ({ ...s, lockedEndDate }));
    }
  }, []);

  const addTransaction = useCallback((tx: SavingsTransaction) => {
    setTransactions((prev) => [tx, ...prev]);
  }, []);

  const isLockedDue = useCallback(() => {
    const d = settings.lockedEndDate;
    if (!d) return false;
    const due = new Date(d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return today >= due;
  }, [settings.lockedEndDate]);

  const withdraw = useCallback(
    (amount: number, from: AccountType): { net: number; fee: number; ok: boolean } => {
      const fee = Math.round(amount * COMMISSION_RATE);
      const net = amount - fee;
      const available = from === 'flexible' ? wallet.flexible : wallet.locked;
      if (available < amount) return { net: 0, fee: 0, ok: false };
      if (from === 'locked') {
        const due = isLockedDue();
        if (!due) return { net: 0, fee: 0, ok: false };
      }
      setWallet((w) => ({
        ...w,
        [from]: w[from] - amount,
        total: w.total - amount,
      }));
      addTransaction({
        id: `tx-${Date.now()}`,
        type: 'withdrawal',
        amount,
        fee,
        netAmount: net,
        mode: from,
        status: 'completed',
        timestamp: new Date().toISOString(),
      });
      return { net, fee, ok: true };
    },
    [wallet.flexible, wallet.locked, isLockedDue, addTransaction]
  );

  const updateSettings = useCallback((s: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...s }));
  }, []);

  const addMomoNumber = useCallback((momo: MomoNumber) => {
    setMomoNumbers((prev) => [...prev, momo]);
  }, []);

  const updateMomoNumber = useCallback((id: string, updates: Partial<MomoNumber>) => {
    setMomoNumbers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  }, []);

  return (
    <SavingsContext.Provider
      value={{
        wallet,
        pendingSavings,
        transactions,
        momoNumbers,
        settings,
        addPendingSavings,
        completePendingSavings,
        addDeposit,
        addTransaction,
        withdraw,
        isLockedDue,
        updateSettings,
        addMomoNumber,
        updateMomoNumber,
      }}>
      {children}
    </SavingsContext.Provider>
  );
}

export function useSavings() {
  return useContext(SavingsContext);
}
