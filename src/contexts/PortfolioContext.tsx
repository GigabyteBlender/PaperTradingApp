'use client';

import { createContext, useState, useEffect, ReactNode } from 'react';
import * as portfolioAPI from '@/lib/api/portfolio';
import { useAuth } from './AuthContext';
import type { PortfolioResponse, HoldingResponse } from '@/lib/types';
import { createContextHook } from '@/hooks/useContext';

interface PortfolioContextType {
  portfolio: PortfolioResponse | null;
  holdings: HoldingResponse[];
  isLoading: boolean;
  error: string | null;
  fetchPortfolio: () => Promise<void>;
  refreshPortfolio: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

  /**
   * Fetch portfolio data from API.
   * Retrieves complete portfolio with calculated metrics and holdings.
   * Migrated from localStorage to backend API for persistent storage.
   */
  const fetchPortfolio = async () => {
    if (!isAuthenticated) {
      setPortfolio(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await portfolioAPI.getPortfolio();
      setPortfolio(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch portfolio';
      setError(errorMessage);
      console.error('Error fetching portfolio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh portfolio data from API.
   * Used after transactions to update portfolio state with latest data.
   */
  const refreshPortfolio = async () => {
    await fetchPortfolio();
  };

  // Fetch portfolio when user authentication state changes
  useEffect(() => {
    fetchPortfolio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  const holdings = portfolio?.holdings || [];

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        holdings,
        isLoading,
        error,
        fetchPortfolio,
        refreshPortfolio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

/**
 * Hook to access portfolio context.
 * Must be used within PortfolioProvider.
 */
export const usePortfolio = createContextHook(PortfolioContext, 'Portfolio');
