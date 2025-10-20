'use client';

import { Geist, Geist_Mono } from "next/font/google";
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import "./globals.css";
import Header from "@/app/dashboard/components/Header";
import Sidebar from "@/app/dashboard/components/Sidebar";
import { BalanceProvider } from "@/contexts/BalanceContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const [search, setSearch] = useState('');
  const pathname = usePathname();

  const showNavigation = pathname === '/dashboard' || 
                         pathname?.startsWith('/market') || 
                         pathname === '/settings';

  return (
    <html lang="en">
      <head>
        <title>StockTrainer - Trading Simulator</title>
        <meta name="description" content="Learn stock trading with our comprehensive simulator" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BalanceProvider>
          {showNavigation ? (
            <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-900">
              <Header search={search} onSearchChange={setSearch} />
              <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1">{children}</main>
              </div>
            </div>
          ) : (
            children
          )}
        </BalanceProvider>
      </body>
    </html>
  );
}