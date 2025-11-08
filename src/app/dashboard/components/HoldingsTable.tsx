'use client';

import { useState } from 'react';
import { Portfolio, Stock } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/portfolio';
import { mockStocks } from '@/data/mockData';
import TradeModal from '@/components/TradeModal';

interface HoldingsTableProps {
  portfolio: Portfolio | null;
  isLoading?: boolean;
  onTradeComplete: () => void;
}

export default function HoldingsTable({ portfolio, isLoading = false, onTradeComplete }: HoldingsTableProps) {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

  const getStockData = (symbol: string): Stock | null => {
    return mockStocks.find(s => s.symbol === symbol) || null;
  };

  const handleTradeClick = (symbol: string) => {
    const stock = getStockData(symbol);
    if (stock) {
      setSelectedStock(stock);
      setIsTradeModalOpen(true);
    }
  };

  const handleViewStock = (symbol: string) => {
    window.location.href = `/market?symbol=${symbol}`;
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-sm">
      <table className="min-w-full">
        <thead>
          <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Symbol
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Company
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Shares
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Price
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Value
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Change
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
          {isLoading || !portfolio ? (
            // Loading skeleton rows
            [...Array(4)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-4">
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded w-16"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded w-40"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded w-12"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded w-20"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded w-24"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-600 rounded w-16"></div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="h-7 bg-neutral-200 dark:bg-neutral-600 rounded-lg w-16 mx-auto"></div>
                </td>
              </tr>
            ))
          ) : portfolio.holdings.length === 0 ? (
            // Empty state
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-neutral-500 dark:text-neutral-400">
                No holdings yet. Start trading to build your portfolio.
              </td>
            </tr>
          ) : (
            // Actual holdings data
            portfolio.holdings.map((holding) => (
              <tr
                key={holding.symbol}
                onClick={() => handleViewStock(holding.symbol)}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-all duration-200 hover:shadow-sm group"
              >
                <td className="px-6 py-4 text-sm font-mono text-neutral-900 dark:text-neutral-100 whitespace-nowrap font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {holding.symbol}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                  {holding.companyName}
                </td>
                <td className="px-6 py-4 text-sm text-left text-neutral-700 dark:text-neutral-300">
                  {holding.shares.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-left text-neutral-700 dark:text-neutral-300">
                  {formatCurrency(holding.currentPrice)}
                </td>
                <td className="px-6 py-4 text-sm text-left text-neutral-900 dark:text-neutral-100 font-semibold">
                  {formatCurrency(holding.currentValue)}
                </td>
                <td className={`px-6 py-4 text-sm text-left font-semibold ${holding.unrealizedPL < 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
                  }`}>
                  {formatPercentage(holding.unrealizedPLPercent)}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTradeClick(holding.symbol);
                    }}
                    className="bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 hover:shadow-sm"
                  >
                    Trade
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>


      </table>

      {selectedStock && (
        <TradeModal
          stock={selectedStock}
          isOpen={isTradeModalOpen}
          onClose={() => {
            setIsTradeModalOpen(false);
            setSelectedStock(null);
          }}
          onTradeComplete={() => {
            onTradeComplete();
            setIsTradeModalOpen(false);
            setSelectedStock(null);
          }}
        />
      )}
    </div>
  );
}