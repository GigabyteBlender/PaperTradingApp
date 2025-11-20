'use client';

import { Stock } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/utils/portfolio';

interface PriceCardProps {
  stock: Stock;
}

export default function PriceCard({ stock }: PriceCardProps) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mb-2">
        <span className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white">
          {formatCurrency(stock.current_price)}
        </span>
        <span className={`text-lg md:text-xl font-semibold ${
          stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
        }`}>
          {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)} ({formatPercentage(stock.change_percent)})
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
        }).format(new Date(stock.last_update))}
      </p>
    </div>
  );
}
