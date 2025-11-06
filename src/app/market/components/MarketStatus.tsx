'use client';

import { Stock } from '@/types';

interface MarketStatusProps {
  stock: Stock;
  onTradeClick: () => void;
}

export default function MarketStatus({ stock, onTradeClick }: MarketStatusProps) {
  return (
    <div className="space-y-6">
      {/* Market Status */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Market Status
        </h3>

        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-3 ${
            stock.marketStatus === 'OPEN' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className={`font-medium ${
            stock.marketStatus === 'OPEN' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            Market {stock.marketStatus === 'OPEN' ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
          Quick Actions
        </h3>

        <div className="space-y-3">
          <button
            onClick={onTradeClick}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-sm hover:shadow-md"
          >
            Buy {stock.symbol}
          </button>

          <button
            onClick={onTradeClick}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-medium transition-colors shadow-sm hover:shadow-md"
          >
            Sell {stock.symbol}
          </button>
        </div>
      </div>
    </div>
  );
}