'use client';

import { useState } from 'react';
import { Stock, TransactionType } from '@/types';
import { formatCurrency } from '@/utils/portfolio';
import { useBalance } from '@/contexts/BalanceContext';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { createTransaction } from '@/lib/api/transactions';
import type { TransactionCreateRequest } from '@/lib/api/types';

interface TradeModalProps {
  stock: Stock;
  isOpen: boolean;
  onClose: () => void;
  onTradeComplete: () => void;
}

export default function TradeModal({ stock, isOpen, onClose, onTradeComplete }: TradeModalProps) {
  const [tradeType, setTradeType] = useState<TransactionType>(TransactionType.BUY);
  const [shares, setShares] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { balance, updateBalance, refreshBalance } = useBalance();
  const { holdings, refreshPortfolio } = usePortfolio();
  
  const currentHolding = holdings.find(h => h.symbol === stock.symbol);
  const maxSellShares = currentHolding?.shares || 0;
  const totalCost = shares * stock.currentPrice;
  const canAfford = tradeType === TransactionType.BUY ? totalCost <= (balance || 0) : true;
  const canSell = tradeType === TransactionType.SELL ? shares <= maxSellShares : true;

  /**
   * Execute buy or sell transaction via API.
   * Transaction flow:
   * 1. Send transaction request to backend
   * 2. Backend atomically updates balance, holdings, and creates transaction record
   * 3. Update local state with new balance from response
   * 4. Refresh portfolio and balance to sync with backend
   * 5. Close modal and notify parent component
   */
  const handleTrade = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Create transaction request payload
      const transactionData: TransactionCreateRequest = {
        type: tradeType === TransactionType.BUY ? 'BUY' : 'SELL',
        symbol: stock.symbol,
        shares,
        price: stock.currentPrice,
        company_name: stock.name,
      };

      // Execute transaction via API - backend handles all updates atomically
      const response = await createTransaction(transactionData);

      // Update local balance state immediately for responsive UI
      updateBalance(response.updated_balance);

      // Refresh portfolio and balance from backend to ensure consistency
      await Promise.all([
        refreshPortfolio(),
        refreshBalance(),
      ]);

      // Reset form and close modal
      setShares(1);
      setError(null);
      onTradeComplete();
      onClose();
    } catch (err) {
      // Handle API errors with user-friendly messages
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed. Please try again.';
      setError(errorMessage);
      console.error('Trade failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 w-full max-w-md border border-neutral-200 dark:border-neutral-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3 md:mb-4">
          <h2 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white">
            Trade {stock.symbol}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 text-xl"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">{stock.name}</p>
          <p className="text-base md:text-lg font-semibold text-neutral-900 dark:text-white">
            {formatCurrency(stock.currentPrice)}
          </p>
          <p className={`text-xs md:text-sm ${stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)} ({stock.changePercent.toFixed(2)}%)
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-xs md:text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Trade Type
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => setTradeType(TransactionType.BUY)}
              className={`flex-1 py-2 md:py-2.5 px-3 md:px-4 rounded-lg text-sm md:text-base font-medium transition-colors ${
                tradeType === TransactionType.BUY
                  ? 'bg-green-600 text-white'
                  : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setTradeType(TransactionType.SELL)}
              className={`flex-1 py-2 md:py-2.5 px-3 md:px-4 rounded-lg text-sm md:text-base font-medium transition-colors ${
                tradeType === TransactionType.SELL
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
              }`}
              disabled={maxSellShares === 0}
            >
              Sell
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs md:text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Shares
          </label>
          <input
            type="number"
            min="1"
            max={tradeType === TransactionType.SELL ? maxSellShares : undefined}
            value={shares}
            onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2 md:py-2.5 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white text-sm md:text-base"
          />
          {tradeType === TransactionType.SELL && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              You own {maxSellShares} shares
            </p>
          )}
        </div>

        <div className="mb-5 md:mb-6 bg-neutral-50 dark:bg-neutral-900 rounded-lg p-3 md:p-4">
          <div className="flex justify-between text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            <span>Total Cost:</span>
            <span className="font-medium">{formatCurrency(totalCost)}</span>
          </div>
          <div className="flex justify-between text-xs md:text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            <span>Current Balance:</span>
            <span className="font-medium">{formatCurrency(balance || 0)}</span>
          </div>
          {tradeType === TransactionType.BUY && (
            <div className="flex justify-between text-xs md:text-sm text-neutral-600 dark:text-neutral-400 pt-2 border-t border-neutral-200 dark:border-neutral-700">
              <span>After Trade:</span>
              <span className="font-semibold">{formatCurrency((balance || 0) - totalCost)}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-2 md:space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 md:py-2.5 px-3 md:px-4 border border-neutral-300 dark:border-neutral-600 rounded-lg text-sm md:text-base text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleTrade}
            disabled={!canAfford || !canSell || shares <= 0 || isProcessing}
            className={`flex-1 py-2 md:py-2.5 px-3 md:px-4 rounded-lg text-sm md:text-base text-white font-medium transition-colors ${
              tradeType === TransactionType.BUY
                ? 'bg-green-600 hover:bg-green-700 disabled:bg-neutral-400 disabled:cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 disabled:bg-neutral-400 disabled:cursor-not-allowed'
            }`}
          >
            {isProcessing 
              ? 'Processing...' 
              : `${tradeType === TransactionType.BUY ? 'Buy' : 'Sell'} ${shares} Share${shares > 1 ? 's' : ''}`
            }
          </button>
        </div>

        {!canAfford && tradeType === TransactionType.BUY && (
          <p className="text-red-600 dark:text-red-400 text-xs md:text-sm mt-2 text-center">Insufficient balance</p>
        )}
        {!canSell && tradeType === TransactionType.SELL && (
          <p className="text-red-600 dark:text-red-400 text-xs md:text-sm mt-2 text-center">Not enough shares to sell</p>
        )}
        {error && (
          <p className="text-red-600 dark:text-red-400 text-xs md:text-sm mt-2 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}