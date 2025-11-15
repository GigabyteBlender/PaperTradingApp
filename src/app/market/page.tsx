'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Stock } from '@/types';
import { mockStocks } from '@/data/mockData';
import TradeModal from '@/components/TradeModal';
import StockHeader from './components/StockHeader';
import StockChart from './components/StockChart';
import StockStats from './components/StockStats';
import MarketStatus from './components/MarketStatus';

function MarketPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const symbol = searchParams.get('symbol');

  // Find stock data from mock data by symbol
  const initializeStock = () => {
    if (symbol) {
      return mockStocks.find(s => s.symbol === symbol) || null;
    }
    return null;
  };

  const [stock] = useState<Stock | null>(initializeStock());
  const [isLoading] = useState(false);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

  // Redirect to dashboard if no symbol provided
  useEffect(() => {
    if (!symbol) {
      router.push('/dashboard');
    }
  }, [symbol, router]);

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
            Loading stock information...
          </p>
        </div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            Stock Not Found
          </h1>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 mb-4">
            The requested stock symbol &quot;{symbol}&quot; could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <StockHeader 
        stock={stock} 
        onTradeClick={() => setIsTradeModalOpen(true)} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <StockChart stock={stock} />
        </div>

        {/* Stock Details */}
        <div className="space-y-4 md:space-y-6">
          <StockStats stock={stock} />
          <MarketStatus 
            stock={stock} 
          />
        </div>
      </div>

      {/* Trade Modal */}
      {isTradeModalOpen && (
        <TradeModal
          stock={stock}
          isOpen={isTradeModalOpen}
          onClose={() => setIsTradeModalOpen(false)}
          onTradeComplete={() => {
            setIsTradeModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default function MarketPage() {
  return (
    <Suspense fallback={
      <div className="p-4 md:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400">
            Loading...
          </p>
        </div>
      </div>
    }>
      <MarketPageContent />
    </Suspense>
  );
}
