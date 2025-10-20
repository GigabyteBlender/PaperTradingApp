'use client';

import { useState } from 'react';
import { Portfolio, Stock } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/portfolio';
import { mockStocks } from '@/data/mockData';
import TradeModal from '@/components/TradeModal';

interface HoldingsTableProps {
  portfolio: Portfolio;
  onTradeComplete: () => void;
}

export default function HoldingsTable({ portfolio, onTradeComplete }: HoldingsTableProps) {
  const { holdings, totalValue } = portfolio;
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

  const getCompanyName = (symbol: string): string => {
    const stock = mockStocks.find(s => s.symbol === symbol);
    return stock?.name || symbol;
  };

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
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-neutral-900 border-radius border-gray-200 dark:border-neutral-800 rounded-xl shadow-lg">
        <thead>
          <tr className="bg-gray-100 dark:bg-neutral-800">
            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800 rounded-tl-xl">
              Symbol
            </th>
            <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800">
              Company
            </th>
            <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800">
              Shares
            </th>
            <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800">
              Price
            </th>
            <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800">
              Value
            </th>
            <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800">
              Change
            </th>
            <th className="px-6 py-3 text-center text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-neutral-800 rounded-tr-xl">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {holdings.map((holding) => (
            <tr
              key={holding.symbol}
              onClick={() => handleViewStock(holding.symbol)}
              className="transition-colors duration-150 hover:bg-blue-50 dark:hover:bg-neutral-800 cursor-pointer"
            >
              <td className="px-6 py-3 text-sm font-mono text-blue-700 dark:text-blue-300 whitespace-nowrap">
                {holding.symbol}
              </td>
              <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-200 whitespace-nowrap">
                {getCompanyName(holding.symbol)}
              </td>
              <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-200">
                {holding.shares}
              </td>
              <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-200">
                {formatCurrency(holding.currentPrice)}
              </td>
              <td className="px-6 py-3 text-sm text-right text-gray-700 dark:text-gray-200">
                {formatCurrency(holding.currentValue)}
              </td>
              <td className={`px-6 py-3 text-sm text-right font-semibold ${
                holding.unrealizedPL < 0
                  ? "text-red-600 dark:text-red-400"
                  : "text-green-600 dark:text-green-400"
              }`}>
                {formatPercentage(holding.unrealizedPLPercent)}
              </td>
              <td className="px-6 py-3 text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTradeClick(holding.symbol);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Trade
                </button>
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot>
          <tr className="bg-gray-100 dark:bg-neutral-800">
            <td
              colSpan={5}
              className="px-6 py-3 text-right text-base font-bold text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-neutral-800 rounded-bl-xl"
            >
              Total Value
            </td>
            <td className="px-6 py-3 text-right text-base font-bold text-gray-900 dark:text-gray-100 border-t border-gray-200 dark:border-neutral-800">
              {formatCurrency(totalValue)}
            </td>
            <td className="px-6 py-3 border-t border-gray-200 dark:border-neutral-800 rounded-br-xl"></td>
          </tr>
        </tfoot>
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