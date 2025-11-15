'use client';

import { Stock } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/portfolio';

interface StockHeaderProps {
  stock: Stock;
  onTradeClick: () => void;
}

export default function StockHeader({ stock, onTradeClick }: StockHeaderProps) {

  return (
    <div className="mb-6 md:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-1 md:mb-2">
            {stock.symbol}
          </h1>
          <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400">
            {stock.name}
          </p>
        </div>

        <button
          onClick={onTradeClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg md:rounded-xl font-medium transition-colors shadow-sm hover:shadow-md text-sm md:text-base whitespace-nowrap"
        >
          Trade {stock.symbol}
        </button>
      </div>

      {/* Price and Change */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-2">
          <span className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
            {formatCurrency(stock.currentPrice)}
          </span>
          <span className={`text-lg md:text-xl font-semibold ${
            stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)} ({formatPercentage(stock.changePercent)})
          </span>
        </div>
        <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
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