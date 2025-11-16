'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { createContextHook } from '@/hooks/useContext';

interface BalanceContextType {
  balance: number | null;
  isLoading: boolean;
  updateBalance: (newBalance: number) => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number | null>(null);
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();

  /**
   * Sync balance from user data when authentication state changes.
   */
  useEffect(() => {
    if (isAuthenticated && user) {
      setBalance(user.balance);
    } else {
      setBalance(null);
    }
  }, [isAuthenticated, user]);

  /**
   * Update balance in local state.
   * Used after transactions to immediately reflect balance changes.
   */
  const updateBalance = (newBalance: number) => {
    setBalance(newBalance);
  };

  return (
    <BalanceContext.Provider value={{ balance, isLoading: authLoading, updateBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}

/**
 * Hook to access balance context.
 * Must be used within BalanceProvider.
 */
export const useBalance = createContextHook(BalanceContext, 'Balance');