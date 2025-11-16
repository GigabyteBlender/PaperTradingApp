'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { StockDetailsResponse } from '@/lib/types';
import { getStockDetails } from '@/lib/api/stocks';
import TradeModal from '@/components/TradeModal';
import StockHeader from './components/StockHeader';
import StockChart from './components/StockChart';
import StockStats from './components/StockStats';
import MarketStatus from './components/MarketStatus';

function MarketPageContent() {
  const { requireAuth } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const symbol = searchParams.get('symbol');

  const [stock, setStock] = useState<StockDetailsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);

  // Fetch stock details from API
  useEffect(() => {
    if (!symbol) {
      router.push('/dashboard');
      return;
    }

    const fetchStockDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const details = await getStockDetails(symbol);
        setStock(details);
      } catch (err) {
        console.error('Failed to fetch stock details:', err);
        setError('Failed to load stock information. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockDetails();
  }, [symbol, router]);

  // Auth context handles redirect, just return null if not authenticated
  if (!requireAuth()) {
    return null;
  }

  if (error || (!isLoading && !stock)) {
    return (
      <div className="p-4 md:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white mb-4">
            {error ? 'Error Loading Stock' : 'Stock Not Found'}
          </h1>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 mb-4">
            {error || `The requested stock symbol "${symbol}" could not be found.`}
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!stock) {
    return null;
  }

  return (
    <div className="p-4 md:p-8">
      {/* Back to Dashboard Button */}
      <button
        onClick={() => router.push('/dashboard')}
        className="mb-4 flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="font-medium">Back to Dashboard</span>
      </button>

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
    <Suspense fallback={<div className="p-4 md:p-8"></div>}>
      <MarketPageContent />
    </Suspense>
  );
}
