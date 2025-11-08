'use client';

import { useState, useEffect } from 'react';
import { Stock } from '@/types';
import { mockStocks } from '@/data/mockData';
import { formatCurrency, formatPercentage } from '@/utils/portfolio';

export default function StockSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    const results = mockStocks.filter(stock => 
      stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
    setIsSearching(false);
  }, [searchTerm]);

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2.5 pl-10 border border-neutral-300 dark:border-neutral-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-800 dark:text-white text-sm placeholder:text-neutral-400 dark:placeholder:text-neutral-500 bg-neutral-50 dark:bg-neutral-800 hover:bg-white dark:hover:bg-neutral-700 transition-all duration-200"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {searchTerm && (
        <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl max-h-96 overflow-y-auto backdrop-blur-sm">
          {isSearching ? (
            <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => {
                    setSearchTerm('');
                    setSearchResults([]);
                    window.location.href = `/market?symbol=${stock.symbol}`;
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 border-b border-neutral-100 dark:border-neutral-700 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {stock.symbol}
                      </div>
                      <div className="text-sm text-neutral-600 dark:text-neutral-400">
                        {stock.name}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {formatCurrency(stock.currentPrice)}
                      </div>
                      <div className={`text-sm ${
                        stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatPercentage(stock.changePercent)}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-neutral-500 dark:text-neutral-400">
              No stocks found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}