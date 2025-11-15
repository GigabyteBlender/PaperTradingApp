/**
 * Format number as USD currency.
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format number as percentage with sign.
 */
export const formatPercentage = (percentage: number | string | null | undefined): string => {
  const num = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
  if (num == null || isNaN(num)) {
    return '0.00%';
  }
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};

/**
 * Format large numbers with K, M, B suffixes.
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};
