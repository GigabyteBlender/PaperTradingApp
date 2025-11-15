'use client';

import { useState } from 'react';
import { formatCurrency } from "@/utils/portfolio";
import StockSearch from "@/components/StockSearch";
import { useBalance } from "@/contexts/BalanceContext";
import { Menu, Search, X } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { balance, isLoading } = useBalance();
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <>
      <header className="w-full flex items-center justify-between px-4 md:px-8 py-4 md:py-6 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-lg md:text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              <span className="hidden sm:inline">Trading Simulator</span>
              <span className="sm:hidden">Trading</span>
            </span>
            <span className="hidden sm:inline text-sm text-neutral-500 dark:text-neutral-400">
              v1.0.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <div className="flex items-center gap-1.5 md:gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-2 md:px-4 py-1.5 md:py-2.5 rounded-lg md:rounded-xl border border-emerald-200 dark:border-emerald-800">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs md:text-sm font-semibold text-emerald-800 dark:text-emerald-200">
              <span className="hidden sm:inline">Balance: </span>
              {isLoading ? '...' : formatCurrency(balance || 0)}
            </span>
          </div>

          {/* Mobile search button */}
          <button
            onClick={() => setShowMobileSearch(true)}
            className="md:hidden p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            aria-label="Search stocks"
          >
            <Search className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
          </button>

          {/* Desktop search */}
          <div className="hidden md:block w-60">
            <StockSearch/>
          </div>
        </div>
      </header>

      {/* Mobile search overlay */}
      {showMobileSearch && (
        <div className="md:hidden fixed inset-0 z-50 bg-white dark:bg-neutral-900">
          <div className="flex items-center gap-3 px-4 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setShowMobileSearch(false)}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            </button>
            <div className="flex-1">
              <StockSearch />
            </div>
          </div>
        </div>
      )}
    </>
  );
}


