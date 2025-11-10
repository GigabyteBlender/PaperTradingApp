'use client';

import { useState } from 'react';
import { Stock, TransactionType, Transaction, Holding } from '@/types';
import { formatCurrency } from '@/utils/portfolio';
import { addTransaction, getPortfolio, savePortfolio } from '@/utils/localStorage';
import { useBalance } from '@/contexts/BalanceContext';

interface TradeModalProps {
  stock: Stock;
  isOpen: boolean;
  onClose: () => void;
  onTradeComplete: () => void;
}

export default function TradeModal({ stock, isOpen, onClose, onTradeComplete }: TradeModalProps) {
  //states
  const [tradeType, setTradeType] = useState<TransactionType>(TransactionType.BUY);
  const [shares, setShares] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  //variables
  const { balance, updateBalance } = useBalance();
  const portfolio = getPortfolio();
  const currentHolding = portfolio?.holdings.find(h => h.symbol === stock.symbol);
  const maxSellShares = currentHolding?.shares || 0;
  const totalCost = shares * stock.currentPrice;
  const canAfford = tradeType === TransactionType.BUY ? totalCost <= (balance || 0) : true;
  const canSell = tradeType === TransactionType.SELL ? shares <= maxSellShares : true;

  // Execute buy or sell trade and update portfolio
  const handleTrade = async () => {
    setIsProcessing(true);

    try {
      // Create transaction record
      const transaction: Transaction = {
        transactionId: `txn-${Date.now()}`,
        userId: 'user-123',
        type: tradeType,
        symbol: stock.symbol,
        shares,
        price: stock.currentPrice,
        totalCost,
        timestamp: new Date()
      };

      // Update balance
      const newBalance = tradeType === TransactionType.BUY
        ? (balance || 0) - totalCost
        : (balance || 0) + totalCost;
      updateBalance(newBalance);

      // Add transaction to history
      addTransaction(transaction);

      // Update portfolio
      if (portfolio) {
        const updatedHoldings = [...portfolio.holdings];
        const existingHoldingIndex = updatedHoldings.findIndex(h => h.symbol === stock.symbol);

        if (tradeType === TransactionType.BUY) {
          if (existingHoldingIndex >= 0) {
            // Update existing holding
            const existing = updatedHoldings[existingHoldingIndex];
            const newShares = existing.shares + shares;
            const newAverageCost = ((existing.averageCost * existing.shares) + totalCost) / newShares;

            updatedHoldings[existingHoldingIndex] = {
              ...existing,
              shares: newShares,
              averageCost: newAverageCost,
              currentPrice: stock.currentPrice,
              currentValue: newShares * stock.currentPrice,
              unrealizedPL: (stock.currentPrice - newAverageCost) * newShares,
              unrealizedPLPercent: ((stock.currentPrice - newAverageCost) / newAverageCost) * 100
            };
          } else {
            // Create new holding
            const newHolding: Holding = {
              symbol: stock.symbol,
              companyName: stock.name,
              shares,
              averageCost: stock.currentPrice,
              currentPrice: stock.currentPrice,
              currentValue: totalCost,
              unrealizedPL: 0,
              unrealizedPLPercent: 0,
              purchasedAt: new Date()
            };
            updatedHoldings.push(newHolding);
          }
        } else {
          // Sell shares
          if (existingHoldingIndex >= 0) {
            const existing = updatedHoldings[existingHoldingIndex];
            const newShares = existing.shares - shares;

            if (newShares <= 0) {
              // Remove holding if all shares sold
              updatedHoldings.splice(existingHoldingIndex, 1);
            } else {
              // Update holding with remaining shares
              updatedHoldings[existingHoldingIndex] = {
                ...existing,
                shares: newShares,
                currentValue: newShares * stock.currentPrice,
                unrealizedPL: (stock.currentPrice - existing.averageCost) * newShares,
                unrealizedPLPercent: ((stock.currentPrice - existing.averageCost) / existing.averageCost) * 100
              };
            }
          }
        }

        // Calculate new portfolio totals
        const totalValue = updatedHoldings.reduce((sum, holding) => sum + holding.currentValue, 0);
        const totalInvested = updatedHoldings.reduce((sum, holding) => sum + (holding.averageCost * holding.shares), 0);
        const profitLoss = totalValue - totalInvested;
        const profitLossPercent = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

        const updatedPortfolio = {
          ...portfolio,
          totalValue,
          totalInvested,
          profitLoss,
          profitLossPercent,
          holdings: updatedHoldings
        };

        savePortfolio(updatedPortfolio);
      }

      onTradeComplete();
      setShares(1);
      onClose();
    } catch (error) {
      console.error('Trade failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 w-full max-w-md mx-4 border border-neutral-200 dark:border-neutral-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            Trade {stock.symbol}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">{stock.name}</p>
          <p className="text-lg font-semibold text-neutral-900 dark:text-white">
            {formatCurrency(stock.currentPrice)}
          </p>
          <p className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)} ({stock.changePercent.toFixed(2)}%)
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Trade Type
          </label>
          <div className="flex space-x-2">
            <button
              onClick={() => setTradeType(TransactionType.BUY)}
              className={`flex-1 py-2 px-4 rounded ${
                tradeType === TransactionType.BUY
                  ? 'bg-green-600 text-white'
                  : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setTradeType(TransactionType.SELL)}
              className={`flex-1 py-2 px-4 rounded ${
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
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Shares
          </label>
          <input
            type="number"
            min="1"
            max={tradeType === TransactionType.SELL ? maxSellShares : undefined}
            value={shares}
            onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-neutral-700 dark:text-white"
          />
          {tradeType === TransactionType.SELL && (
            <p className="text-xs text-neutral-500 mt-1">
              You own {maxSellShares} shares
            </p>
          )}
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            <span>Total Cost:</span>
            <span>{formatCurrency(totalCost)}</span>
          </div>
          <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            <span>Current Balance:</span>
            <span>{formatCurrency(balance || 0)}</span>
          </div>
          {tradeType === TransactionType.BUY && (
            <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
              <span>After Trade:</span>
              <span>{formatCurrency((balance || 0) - totalCost)}</span>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 border border-neutral-300 dark:border-neutral-600 rounded-md text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
          >
            Cancel
          </button>
          <button
            onClick={handleTrade}
            disabled={!canAfford || !canSell || shares <= 0 || isProcessing}
            className={`flex-1 py-2 px-4 rounded-md text-white ${
              tradeType === TransactionType.BUY
                ? 'bg-green-600 hover:bg-green-700 disabled:bg-neutral-400'
                : 'bg-red-600 hover:bg-red-700 disabled:bg-neutral-400'
            }`}
          >
            {isProcessing 
              ? 'Processing...' 
              : `${tradeType === TransactionType.BUY ? 'Buy' : 'Sell'} ${shares} Share${shares > 1 ? 's' : ''}`
            }
          </button>
        </div>

        {!canAfford && tradeType === TransactionType.BUY && (
          <p className="text-red-600 text-sm mt-2">Insufficient balance</p>
        )}
        {!canSell && tradeType === TransactionType.SELL && (
          <p className="text-red-600 text-sm mt-2">Not enough shares to sell</p>
        )}
      </div>
    </div>
  );
}