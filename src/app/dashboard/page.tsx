"use client";

import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import PortfolioTable from "./components/PortfolioTable";

export default function Home() {
  const [search, setSearch] = useState("");

  const rows = [
    { symbol: "AAPL", company: "Apple Inc.", shares: 10, price: "$180.00", value: "$1,800.00", change: "+1.2%" },
    { symbol: "GOOGL", company: "Alphabet Inc.", shares: 5, price: "$2,800.00", value: "$14,000.00", change: "-0.5%" },
    { symbol: "TSLA", company: "Tesla Inc.", shares: 2, price: "$700.00", value: "$1,400.00", change: "+3.0%" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-900">
      <Header search={search} onSearchChange={setSearch} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <h2 className="text-2xl font-semibold mb-6">Portfolio</h2>
          <PortfolioTable rows={rows} totalValue="$17,200.00" />
        </main>
      </div>
    </div>
  );
}
