'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();

  // Show header for main app pages (exclude auth pages)
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const showNavigation = !isAuthPage && (
    pathname === '/dashboard' || 
    pathname === '/market'
  );

  if (showNavigation) {
    return (
      <div className="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900">
        <Header />
        <main className="flex-1 overflow-y-auto bg-neutral-50 dark:bg-neutral-900">
          {children}
        </main>
      </div>
    );
  }

  return <>{children}</>;
}