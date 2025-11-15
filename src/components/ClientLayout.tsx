'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Show header and sidebar for main app pages
  const showNavigation = pathname === '/dashboard' || 
                         pathname === '/market' || 
                         pathname === '/settings';

  if (showNavigation) {
    return (
      <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />
          <main className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-900">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}