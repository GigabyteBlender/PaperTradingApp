'use client';

import { Stock } from '@/types';
import { formatCurrency, formatNumber } from '@/utils/portfolio';

interface StockStatsProps {
  stock: Stock;
}

export default function StockStats({ stock }: StockStatsProps) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
        Key Statistics
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0">
          <span className="text-neutral-600 dark:text-neutral-400 text-sm">Previous Close</span>
          <span className="font-medium text-neutral-900 dark:text-white">
            {formatCurrency(stock.previousClose)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0">
          <span className="text-neutral-600 dark:text-neutral-400 text-sm">Day Range</span>
          <span className="font-medium text-neutral-900 dark:text-white">
            {formatCurrency(stock.dayLow)} - {formatCurrency(stock.dayHigh)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0">
          <span className="text-neutral-600 dark:text-neutral-400 text-sm">Volume</span>
          <span className="font-medium text-neutral-900 dark:text-white">
            {formatNumber(stock.volume)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0">
          <span className="text-neutral-600 dark:text-neutral-400 text-sm">Market Cap</span>
          <span className="font-medium text-neutral-900 dark:text-white">
            {formatCurrency(stock.marketCap / 1000000000)}B
          </span>
        </div>

        <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0">
          <span className="text-neutral-600 dark:text-neutral-400 text-sm">P/E Ratio</span>
          <span className="font-medium text-neutral-900 dark:text-white">
            {stock.peRatio.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-neutral-600 dark:text-neutral-400 text-sm">Dividend Yield</span>
          <span className="font-medium text-neutral-900 dark:text-white">
            {stock.dividendYield.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}