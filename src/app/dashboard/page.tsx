"use client";

import { useState, useEffect } from "react";
import HoldingsTable from "./components/HoldingsTable";
import TransactionsTable from "./components/TransactionsTable";
import TradeModal from "@/components/TradeModal";
import { mockPortfolio, mockTransactions, mockUser } from "@/data/mockData";
import { Portfolio, Transaction, Stock } from "@/types";
import { formatCurrency, formatPercentage } from "@/utils/portfolio";
import {
  getPortfolio,
  getTransactions,
  savePortfolio,
  saveTransactions,
  saveUser
} from "@/utils/localStorage";
import { useBalance } from "@/contexts/BalanceContext";

export default function Dashboard() {
  // states used for data dislpayed on page and also tracking of componentes
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(true);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
  const { balance, isLoading: isBalanceLoading, updateBalance } = useBalance();

  // Load portfolio and transaction data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      const savedPortfolio = getPortfolio();
      const savedTransactions = getTransactions();

      if (savedPortfolio) {
        // Load existing user data from localStorage
        setPortfolio(savedPortfolio);
        setIsPortfolioLoading(false);

        setTransactions(savedTransactions);
        setIsTransactionsLoading(false);
      } else {
        // First time user - initialize with mock data
        savePortfolio(mockPortfolio);
        saveTransactions(mockTransactions);
        saveUser(mockUser);
        setPortfolio(mockPortfolio);
        setTransactions(mockTransactions);
        updateBalance(25000);

        setIsPortfolioLoading(false);
        setIsTransactionsLoading(false);
      }
    };

    loadData();
  }, [updateBalance]);

  // Refresh data after trade completion
  const handleTradeComplete = () => {
    const updatedPortfolio = getPortfolio();
    const updatedTransactions = getTransactions();

    if (updatedPortfolio) setPortfolio(updatedPortfolio);
    setTransactions(updatedTransactions);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4 md:mb-6">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2 md:mb-3 uppercase tracking-wider">
              Portfolio Value
            </h3>
            {isPortfolioLoading || !portfolio ? (
              <div className="h-6 md:h-8 bg-neutral-200 dark:bg-neutral-600 rounded animate-pulse w-24 md:w-32"></div>
            ) : (
              <p className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white">
                {formatCurrency(portfolio.totalValue)}
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2 md:mb-3 uppercase tracking-wider">
              Cash Balance
            </h3>
            {isBalanceLoading ? (
              <div className="h-6 md:h-8 bg-neutral-200 dark:bg-neutral-600 rounded animate-pulse w-20 md:w-28"></div>
            ) : (
              <p className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white">
                {formatCurrency(balance || 0)}
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2 md:mb-3 uppercase tracking-wider">
              Total P&L
            </h3>
            {isPortfolioLoading || !portfolio ? (
              <div className="h-6 md:h-8 bg-neutral-200 dark:bg-neutral-600 rounded animate-pulse w-20 md:w-24"></div>
            ) : (
              <p className={`text-xl md:text-2xl font-bold ${portfolio.profitLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(portfolio.profitLoss)}
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2 md:mb-3 uppercase tracking-wider">
              P&L Percentage
            </h3>
            {isPortfolioLoading || !portfolio ? (
              <div className="h-6 md:h-8 bg-neutral-200 dark:bg-neutral-600 rounded animate-pulse w-16 md:w-20"></div>
            ) : (
              <p className={`text-xl md:text-2xl font-bold ${portfolio.profitLossPercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatPercentage(portfolio.profitLossPercent)}
              </p>
            )}
          </div>
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