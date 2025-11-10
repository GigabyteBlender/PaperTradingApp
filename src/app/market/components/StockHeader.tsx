'use client';

import { useRouter } from 'next/navigation';
import { Stock } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/portfolio';

interface StockHeaderProps {
  stock: Stock;
  onTradeClick: () => void;
}

export default function StockHeader({ stock, onTradeClick }: StockHeaderProps) {

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            {stock.symbol}
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            {stock.name}
          </p>
        </div>

        <button
          onClick={onTradeClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm hover:shadow-md"
        >
          Trade {stock.symbol}
        </button>
      </div>

      {/* Price and Change */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
        <div className="flex items-baseline gap-4 mb-2">
          <span className="text-4xl font-bold text-neutral-900 dark:text-white">
            {formatCurrency(stock.currentPrice)}
          </span>
          <span className={`text-xl font-semibold ${
            stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)} ({formatPercentage(stock.changePercent)})
          </span>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Last updated: {new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }).format(stock.lastUpdate)}
        </p>
      </div>
    </div>
  );
}