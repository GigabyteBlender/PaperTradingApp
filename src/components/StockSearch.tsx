'use client';

import { useState, useEffect } from 'react';
import { Stock, MarketStatus } from '@/types';
import { formatCurrency, formatPercentage } from '@/utils/portfolio';
import { searchStocks } from '@/lib/api/stocks';

export default function StockSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Search stocks via API when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setError(null);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setIsSearching(true);
      setError(null);
      
      try {
        const results = await searchStocks(searchTerm, 10);
        
        // Transform API response to Stock type
        const transformedResults: Stock[] = results.map(result => ({
          symbol: result.symbol,
          name: result.name,
          currentPrice: result.current_price,
          previousClose: result.current_price - result.change,
          change: result.change,
          changePercent: result.change_percent,
          lastUpdate: new Date(),
          marketStatus: MarketStatus.OPEN,
          volume: 0,
          dayHigh: 0,
          dayLow: 0,
          marketCap: 0,
          peRatio: 0,
          dividendYield: 0,
        }));
        
        setSearchResults(transformedResults);
      } catch (err) {
        console.error('Stock search error:', err);
        setError('Failed to search stocks. Please try again.');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search stocks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 md:px-4 py-2 md:py-2.5 pl-8 md:pl-10 border border-neutral-300 dark:border-neutral-600 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-xs md:text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-500 bg-neutral-50 dark:bg-neutral-800 hover:bg-white dark:hover:bg-neutral-700 transition-all duration-200"
        />
        <div className="absolute inset-y-0 left-0 pl-2 md:pl-3 flex items-center pointer-events-none">
          <svg className="h-3.5 md:h-4 w-3.5 md:w-4 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {searchTerm && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg md:rounded-xl shadow-xl max-h-[70vh] md:max-h-96 overflow-y-auto backdrop-blur-sm">
          {isSearching ? (
            <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">
              Searching...
            </div>
          ) : error ? (
            <div className="p-4 text-center text-xs md:text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-1 md:py-2">
              {searchResults.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => {
                    setSearchTerm('');
                    setSearchResults([]);
                    window.location.href = `/market?symbol=${stock.symbol}`;
                  }}
                  className="w-full px-3 md:px-4 py-2.5 md:py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0 transition-colors"
                >
                  <div className="flex justify-between items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm md:text-base text-neutral-900 dark:text-white truncate">
                        {stock.symbol}
                      </div>
                      <div className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 truncate">
                        {stock.name}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-semibold text-sm md:text-base text-neutral-900 dark:text-white">
                        {formatCurrency(stock.currentPrice)}
                      </div>
                      <div className={`text-xs md:text-sm ${
                        stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {formatPercentage(stock.changePercent)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-xs md:text-sm text-neutral-500 dark:text-neutral-400">
              No stocks found matching &quot;{searchTerm}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}