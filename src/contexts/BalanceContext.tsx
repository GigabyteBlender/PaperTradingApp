'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getUserBalance } from '@/lib/api/users';
import { useAuth } from './AuthContext';
import { createContextHook } from '@/hooks/useContextFactory';

interface BalanceContextType {
  balance: number | null;
  isLoading: boolean;
  error: string | null;
  updateBalance: (newBalance: number) => void;
  refreshBalance: () => Promise<void>;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  /**
   * Fetch balance from API.
   * Migrated from localStorage to backend API for persistent storage.
   */
  const fetchBalance = async () => {
    if (!isAuthenticated) {
      setBalance(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getUserBalance();
      setBalance(data.balance);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch balance';
      setError(errorMessage);
      console.error('Error fetching balance:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch balance when user authentication state changes
  useEffect(() => {
    fetchBalance();
  }, [isAuthenticated, user?.id]);

  /**
   * Update balance in local state.
   * Note: Balance updates are now handled by transaction API endpoints.
   * This method updates local state to reflect changes without refetching.
   */
  const updateBalance = (newBalance: number) => {
    setBalance(newBalance);
  };

  /**
   * Refresh balance from API.
   * Migrated from localStorage to fetch current balance from backend.
   */
  const refreshBalance = async () => {
    await fetchBalance();
  };

  return (
    <BalanceContext.Provider value={{ balance, isLoading, error, updateBalance, refreshBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}

/**
 * Hook to access balance context.
 * Must be used within BalanceProvider.
 */
export const useBalance = createContextHook(BalanceContext, 'Balance');