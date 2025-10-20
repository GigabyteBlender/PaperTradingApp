'use client';

import { formatCurrency } from "@/utils/portfolio";
import StockSearch from "@/components/StockSearch";
import { useBalance } from "@/contexts/BalanceContext";

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function Header({ search, onSearchChange }: HeaderProps) {
  const { balance, isLoading } = useBalance();
  return (
    <header className="w-full flex items-center justify-between px-8 py-4 border-b border-gray-200 dark:border-neutral-800">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          StockTrainer
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900 px-3 py-2 rounded-md">
          <span className="text-sm font-medium text-green-800 dark:text-green-200">
            Balance: {isLoading ? 'Loading...' : formatCurrency(balance || 0)}
          </span>
        </div>

        <div className="w-80">
          <StockSearch onStockSelect={() => {}} />
        </div>
      </div>
    </header>
  );
}


