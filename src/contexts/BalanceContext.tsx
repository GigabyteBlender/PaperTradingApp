'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getBalance, saveBalance, getUser, saveUser } from '@/utils/localStorage';
import { mockUser } from '@/data/mockData';

interface BalanceContextType {
  balance: number | null;
  isLoading: boolean;
  updateBalance: (newBalance: number) => void;
  refreshBalance: () => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export function BalanceProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadBalance = () => {
    // Initialize user data if it doesn't exist
    let user = getUser();
    if (!user) {
      saveUser(mockUser);
      user = mockUser;
    }
    
    const savedBalance = getBalance();
    setBalance(savedBalance);
    setIsLoading(false);
  };

  const updateBalance = (newBalance: number) => {
    saveBalance(newBalance);
    setBalance(newBalance);
  };

  const refreshBalance = () => {
    // Ensure user data exists
    let user = getUser();
    if (!user) {
      saveUser(mockUser);
    }
    
    const savedBalance = getBalance();
    setBalance(savedBalance);
  };

  useEffect(() => {
    loadBalance();
  }, []);

  return (
    <BalanceContext.Provider value={{ balance, isLoading, updateBalance, refreshBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
}