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
  const [portfolio, setPortfolio] = useState<Portfolio>(mockPortfolio);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

  const { balance, updateBalance } = useBalance();

  useEffect(() => {
    const savedPortfolio = getPortfolio();
    const savedTransactions = getTransactions();

    if (savedPortfolio) {
      setPortfolio(savedPortfolio);
    } else {
      savePortfolio(mockPortfolio);
      saveTransactions(mockTransactions);
      saveUser(mockUser);
      updateBalance(25000);
    }

    if (savedTransactions.length > 0) {
      setTransactions(savedTransactions);
    }
  }, [updateBalance]);

  const handleTradeComplete = () => {
    const updatedPortfolio = getPortfolio();
    const updatedTransactions = getTransactions();

    if (updatedPortfolio) setPortfolio(updatedPortfolio);
    setTransactions(updatedTransactions);
  };



  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Portfolio Value
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(portfolio.totalValue)}
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Cash Balance
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(balance || 0)}
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Total P&L
            </h3>
            <p className={`text-2xl font-bold ${portfolio.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
              {formatCurrency(portfolio.profitLoss)}
            </p>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              P&L Percentage
            </h3>
            <p className={`text-2xl font-bold ${portfolio.profitLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
              {formatPercentage(portfolio.profitLossPercent)}
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6">Portfolio Holdings</h2>
      <HoldingsTable portfolio={portfolio} onTradeComplete={handleTradeComplete} />

      <h2 className="text-2xl font-semibold mb-6 mt-12">Recent Transactions</h2>
      {transactions.length > 0 ? (
        <TransactionsTable transactions={transactions} />
      ) : (
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 shadow-lg text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No transactions yet. Start trading to see your transaction history here.
          </p>
        </div>
      )}

      {selectedStock && (
        <TradeModal
          stock={selectedStock}
          isOpen={isTradeModalOpen}
          onClose={() => {
            setIsTradeModalOpen(false);
            setSelectedStock(null);
          }}
          onTradeComplete={() => {
            handleTradeComplete();
            setIsTradeModalOpen(false);
            setSelectedStock(null);
          }}
        />
      )}
    </div>
  );
}