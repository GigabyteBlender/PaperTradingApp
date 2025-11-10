'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();

  // Show header and sidebar for main app pages
  const showNavigation = pathname === '/dashboard' || 
                         pathname?.startsWith('/market') || 
                         pathname === '/settings';

  if (showNavigation) {
    return (
      <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
        <Header/>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-900">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}