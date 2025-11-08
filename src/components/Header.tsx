'use client';

import { formatCurrency } from "@/utils/portfolio";
import StockSearch from "@/components/StockSearch";
import { useBalance } from "@/contexts/BalanceContext";

export default function Header() {
  const { balance, isLoading } = useBalance();
  return (
    <header className="w-full flex items-center justify-between px-8 py-6 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Trading Simulator
          </span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            v1.0.0
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
            Balance: {isLoading ? 'Loading...' : formatCurrency(balance || 0)}
          </span>
        </div>

        <div className="w-60">
          <StockSearch/>
        </div>
      </div>
    </header>
  );
}


