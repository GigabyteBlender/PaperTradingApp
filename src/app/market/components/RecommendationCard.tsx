'use client';

import { Recommendation } from '@/lib/types';

/**
 * Props for the RecommendationCard component
 * @property symbol - Stock ticker symbol
 * @property recommendation - Recommendation data from API (null if not loaded)
 * @property isLoading - Whether recommendation is currently being fetched
 * @property error - Error message if recommendation fetch failed
 */
interface RecommendationCardProps {
  symbol: string;
  recommendation: Recommendation | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * RecommendationCard displays AI-powered stock recommendations with visual indicators
 * Matches the styling of existing market page components (StockStats, StockHeader)
 */
export default function RecommendationCard({
  symbol,
  recommendation,
  isLoading,
  error,
}: RecommendationCardProps) {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-4"></div>
          <div className="h-12 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm">
        <h3 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-white mb-3">
          AI Recommendation
        </h3>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // No recommendation data
  if (!recommendation) {
    return null;
  }

  // Determine recommendation styling based on type
  const getRecommendationStyle = () => {
    switch (recommendation.recommendation) {
      case 'buy':
        return {
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          textColor: 'text-green-800 dark:text-green-200',
          badgeColor: 'bg-green-600 dark:bg-green-500',
        };
      case 'hold':
        return {
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          textColor: 'text-yellow-800 dark:text-yellow-200',
          badgeColor: 'bg-yellow-600 dark:bg-yellow-500',
        };
      case 'sell':
        return {
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-800 dark:text-red-200',
          badgeColor: 'bg-red-600 dark:bg-red-500',
        };
    }
  };

  const style = getRecommendationStyle();

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(timestamp));
  };

  // Get icon for factor impact
  const getImpactIcon = (impact: 'positive' | 'neutral' | 'negative') => {
    switch (impact) {
      case 'positive':
        return (
          <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'neutral':
        return (
          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        );
      case 'negative':
        return (
          <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg md:rounded-xl p-4 md:p-6 border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-base md:text-lg font-semibold text-neutral-900 dark:text-white mb-3 md:mb-4">
        AI Recommendation
      </h3>

      {/* Stale data warning */}
      {recommendation.is_stale && (
        <div className="mb-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex items-start gap-2">
          <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-amber-800 dark:text-amber-200">
            This recommendation is based on data from {formatTimestamp(recommendation.calculated_at)}. Market conditions may have changed.
          </p>
        </div>
      )}

      {/* Recommendation badge and score */}
      <div className={`${style.bgColor} ${style.borderColor} border rounded-lg p-4 mb-4`}>
        <div className="flex items-center justify-between ">
          <span className={`${style.badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold uppercase`}>
            {recommendation.recommendation}
          </span>
          <span className={`text-2xl md:text-3xl font-bold ${style.textColor}`}>
            {recommendation.score}/100
          </span>
        </div>
      </div>

      {/* Reasoning */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">Analysis</h4>
        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
          {recommendation.reasoning}
        </p>
      </div>

      {/* Key factors */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-3">Key Factors</h4>
        <div className="space-y-3">
          {recommendation.factors.map((factor, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getImpactIcon(factor.impact)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                  {factor.name}
                </p>
                <p className="text-xs text-neutral-600 dark:text-neutral-400">
                  {factor.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Last updated timestamp */}
      <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Last updated: {formatTimestamp(recommendation.calculated_at)}
        </p>
      </div>
    </div>
  );
}
