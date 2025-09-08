'use client'

import { Search } from "lucide-react";

type HeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export default function Header({ search, onSearchChange }: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between px-8 py-4 border-b border-gray-200 dark:border-neutral-800">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">StockTrainer</span>
      </div>
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-neutral-800 px-3 py-2 rounded-md shadow-sm max-w-xs">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search stocks"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-transparent outline-none w-full text-sm placeholder-gray-400 dark:placeholder-gray-500"
        />
      </div>
    </header>
  );
}


