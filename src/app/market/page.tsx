'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Stock } from '@/types';
import { mockStocks } from '@/data/mockData';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/portfolio';
import TradeModal from '@/components/TradeModal';

export default function MarketPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const symbol = searchParams.get('symbol');
  
  const [stock, setStock] = useState<Stock | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1D');

  useEffect(() => {
    if (symbol) {
      const foundStock = mockStocks.find(s => s.symbol === symbol);
      setStock(foundStock || null);
      setIsLoading(false);
    } else {
      router.push('/dashboard');
    }
  }, [symbol, router]);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading stock information...
          </p>
        </div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Stock Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The requested stock symbol "{symbol}" could not be found.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const generateChartData = () => {
    const points = 50;
    const data = [];
    let price = stock.currentPrice;
    
    for (let i = 0; i < points; i++) {
      const change = (Math.random() - 0.5) * (stock.currentPrice * 0.02);
      price += change;
      data.push({
        time: i,
        price: Math.max(price, stock.currentPrice * 0.8)
      });
    }
    return data;
  };

  const chartData = generateChartData();
  const minPrice = Math.min(...chartData.map(d => d.price));
  const maxPrice = Math.max(...chartData.map(d => d.price));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center"
        >
          ← Back to Dashboard
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {stock.symbol}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {stock.name}
            </p>
          </div>
          
          <button
            onClick={() => setIsTradeModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Trade {stock.symbol}
          </button>
        </div>
      </div>

      {/* Price and Change */}
      <div className="mb-8">
        <div className="flex items-baseline gap-4">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(stock.currentPrice)}
          </span>
          <span className={`text-xl font-semibold ${
            stock.change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)} ({formatPercentage(stock.changePercent)})
          </span>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Last updated: {stock.lastUpdate.toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Price Chart
              </h2>
              
              <div className="flex bg-gray-100 dark:bg-neutral-700 rounded-lg p-1">
              {(['1D', '1W', '1M', '3M', '1Y'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    timeframe === tf
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
            </div>

            <div className="h-64 w-full">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                <defs>
                  <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={stock.change >= 0 ? "#10b981" : "#ef4444"} stopOpacity="0.3"/>
                    <stop offset="100%" stopColor={stock.change >= 0 ? "#10b981" : "#ef4444"} stopOpacity="0.1"/>
                  </linearGradient>
                </defs>
                
                <polyline
                  fill="none"
                  stroke={stock.change >= 0 ? "#10b981" : "#ef4444"}
                  strokeWidth="2"
                  points={chartData.map((point, index) => {
                    const x = (index / (chartData.length - 1)) * 380 + 10;
                    const y = 190 - ((point.price - minPrice) / (maxPrice - minPrice)) * 170;
                    return `${x},${y}`;
                  }).join(' ')}
                />
                
                <polygon
                  fill="url(#priceGradient)"
                  points={[
                    ...chartData.map((point, index) => {
                      const x = (index / (chartData.length - 1)) * 380 + 10;
                      const y = 190 - ((point.price - minPrice) / (maxPrice - minPrice)) * 170;
                      return `${x},${y}`;
                    }),
                    '390,190',
                    '10,190'
                  ].join(' ')}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Stock Details */}
        <div className="space-y-6">
          {/* Key Stats */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Key Statistics
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Previous Close</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(stock.previousClose)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Day Range</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(stock.dayLow)} - {formatCurrency(stock.dayHigh)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Volume</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatNumber(stock.volume)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Market Cap</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {formatCurrency(stock.marketCap / 1000000000)}B
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">P/E Ratio</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {stock.peRatio.toFixed(2)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Dividend Yield</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {stock.dividendYield.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Market Status */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Market Status
            </h3>
            
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-3 ${
                stock.marketStatus === 'OPEN' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className={`font-medium ${
                stock.marketStatus === 'OPEN' ? 'text-green-600' : 'text-red-600'
              }`}>
                Market {stock.marketStatus === 'OPEN' ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={() => setIsTradeModalOpen(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                Buy {stock.symbol}
              </button>
              
              <button
                onClick={() => setIsTradeModalOpen(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                Sell {stock.symbol}
              </button>
            </div>
          </div>
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