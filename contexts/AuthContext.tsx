import * as SecureStore from 'expo-secure-store';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const PIN_KEY = 'cavens_pin';

interface AuthContextType {
  isAuthenticated: boolean;
  hasPin: boolean;
  isInitializing: boolean;
  setPin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  clearPin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [hasPin, setHasPin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync(PIN_KEY)
      .then((pin) => setHasPin(!!pin))
      .finally(() => setIsInitializing(false));
  }, []);

  const setPin = useCallback(async (pin: string) => {
    if (pin.length !== 4) return;
    await SecureStore.setItemAsync(PIN_KEY, pin);
    setHasPin(true);
    setIsAuthenticated(true);
  }, []);

  const verifyPin = useCallback(async (pin: string): Promise<boolean> => {
    const stored = await SecureStore.getItemAsync(PIN_KEY);
    const valid = stored === pin;
    if (valid) setIsAuthenticated(true);
    return valid;
  }, []);

  const clearPin = useCallback(async () => {
    await SecureStore.deleteItemAsync(PIN_KEY);
    setHasPin(false);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        hasPin,
        isInitializing,
        setPin,
        verifyPin,
        clearPin,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
