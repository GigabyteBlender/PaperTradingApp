'use client';

import { Stock } from '@/lib/types';
import Tooltip from '@/components/Tooltip';
import { getTermDefinition } from '@/lib/glossary';

interface MarketStatusProps {
  stock: Stock;
}

export default function MarketStatus({ stock }: MarketStatusProps) {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Market Status */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-white mb-3 md:mb-4">
          <Tooltip term="Market Status" definition={getTermDefinition('Market Status') || ''}>
            Market Status
          </Tooltip>
        </h3>

        <div className="flex items-center">
          <div className={`w-2.5 md:w-3 h-2.5 md:h-3 rounded-full mr-2 md:mr-3 ${
            stock.market_status === 'OPEN' ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className={`font-medium text-sm md:text-base ${
            stock.market_status === 'OPEN' 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            Market {stock.market_status === 'OPEN' ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>
    </div>
  );
}