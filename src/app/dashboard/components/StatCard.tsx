import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: ReactNode;
  isLoading?: boolean;
  loadingWidth?: string;
}

/**
 * Reusable stat card component to eliminate duplicate dashboard card patterns.
 */
export default function StatCard({ 
  title, 
  value, 
  isLoading = false,
  loadingWidth = 'w-24 md:w-32'
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-2 md:mb-3 uppercase tracking-wider">
        {title}
      </h3>
      {isLoading ? (
        <div className={`h-6 md:h-8 bg-neutral-200 dark:bg-neutral-600 rounded animate-pulse ${loadingWidth}`}></div>
      ) : (
        <div className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white">
          {value}
        </div>
      )}
    </div>
  );
}
