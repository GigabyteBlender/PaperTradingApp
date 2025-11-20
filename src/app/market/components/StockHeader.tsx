'use client';

import { Stock } from '@/lib/types';
import { formatCurrency, formatPercentage } from '@/utils/portfolio';

interface StockHeaderProps {
  stock: Stock;
  onTradeClick: () => void;
}

export default function StockHeader({ stock, onTradeClick }: StockHeaderProps) {

  return (
    <div className="mb-6 md:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
    </div>
  );
}