"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import HoldingsTable from "./components/HoldingsTable";
import TransactionsTable from "./components/TransactionsTable";
import StatCard from "@/app/dashboard/components/StatCard";
import { formatCurrency, formatPercentage } from "@/utils/portfolio";
import { useBalance } from "@/contexts/BalanceContext";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { getTransactions } from "@/lib/api/transactions";
import type { TransactionResponse } from "@/lib/types";

export default function Dashboard() {
  const { isLoading: isAuthLoading, requireAuth } = useAuth();
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);
  
  const { balance, isLoading: isBalanceLoading } = useBalance();
  const { portfolio, isLoading: isPortfolioLoading, refreshPortfolio } = usePortfolio();

  /**
   * Fetch transaction history from API.
   */
  useEffect(() => {
    const fetchTransactions = async () => {
      setIsTransactionsLoading(true);
      setTransactionsError(null);

      try {
        const data = await getTransactions(50, 0);
        setTransactions(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch transactions';
        setTransactionsError(errorMessage);
        console.error('Error fetching transactions:', err);
      } finally {
        setIsTransactionsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  /**
   * Refresh portfolio and transaction data after trade completion.
   * Ensures UI reflects latest backend state after transaction execution.
   */
  const handleTradeComplete = async () => {
    await refreshPortfolio();
    
    // Refresh transactions
    try {
      const data = await getTransactions(50, 0);
      setTransactions(data);
    } catch (err) {
      console.error('Error refreshing transactions:', err);
    }
  };

  // Auth context handles redirect, just return null if not authenticated
  if (!requireAuth()) {
    return null;
  }

  return (
    <div className="p-4 md:p-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4 md:mb-6">
            Dashboard
          </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <StatCard
            title="Portfolio Value"
            value={formatCurrency(portfolio?.total_value || 0)}
            isLoading={isPortfolioLoading || !portfolio}
          />

          <StatCard
            title="Cash Balance"
            value={formatCurrency(balance || 0)}
            isLoading={isBalanceLoading}
            loadingWidth="w-20 md:w-28"
          />

          <StatCard
            title="Total P&L"
            value={
              <span className={portfolio && portfolio.profit_loss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                {formatCurrency(portfolio?.profit_loss || 0)}
              </span>
            }
            isLoading={isPortfolioLoading || !portfolio}
            loadingWidth="w-20 md:w-24"
          />

          <StatCard
            title="P&L Percentage"
            value={
              <span className={portfolio && portfolio.profit_loss_percent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                {formatPercentage(portfolio?.profit_loss_percent || 0)}
              </span>
            }
            isLoading={isPortfolioLoading || !portfolio}
            loadingWidth="w-16 md:w-20"
          />
        </div>
      </div>

      <h2 className="text-lg md:text-xl font-bold tracking-tight mb-4 md:mb-6 text-neutral-900 dark:text-white">Portfolio Holdings</h2>
      <HoldingsTable
        portfolio={portfolio}
        isLoading={isPortfolioLoading}
        onTradeComplete={handleTradeComplete}
      />

      <h2 className="text-lg md:text-xl font-bold tracking-tight mb-4 md:mb-6 mt-8 md:mt-12 text-neutral-900 dark:text-white">Recent Transactions</h2>
      <TransactionsTable
        transactions={transactions}
        isLoading={isTransactionsLoading}
      />
      
    </div>
  );
}