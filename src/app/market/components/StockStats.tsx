'use client';

import { Stock } from '@/types';
import { formatCurrency, formatNumber } from '@/utils/portfolio';

interface StockStatsProps {
  stock: Stock;
}

export default function StockStats({ stock }: StockStatsProps) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-white mb-3 md:mb-4">
        Key Statistics
      </h3>

      <div className="space-y-3 md:space-y-4">
        <div className="flex justify-between items-center py-1.5 md:py-2 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0">
          <span className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm">Previous Close</span>
          <span className="font-medium text-neutral-900 dark:text-white text-sm md:text-base">
            {formatCurrency(stock.previousClose)}
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5 md:py-2 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0">
          <span className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm">Day Range</span>
          <span className="font-medium text-neutral-900 dark:text-white text-sm md:text-base">
            {formatCurrency(stock.dayLow)} - {formatCurrency(stock.dayHigh)}
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5 md:py-2 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0">
          <span className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm">Volume</span>
          <span className="font-medium text-neutral-900 dark:text-white text-sm md:text-base">
            {formatNumber(stock.volume)}
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5 md:py-2 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0">
          <span className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm">Market Cap</span>
          <span className="font-medium text-neutral-900 dark:text-white text-sm md:text-base">
            {formatCurrency(stock.marketCap / 1000000000)}B
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5 md:py-2 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0">
          <span className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm">P/E Ratio</span>
          <span className="font-medium text-neutral-900 dark:text-white text-sm md:text-base">
            {stock.peRatio.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center py-1.5 md:py-2">
          <span className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm">Dividend Yield</span>
          <span className="font-medium text-neutral-900 dark:text-white text-sm md:text-base">
            {stock.dividendYield.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}