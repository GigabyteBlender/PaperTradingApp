export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPercentage = (percentage: number): string => {
  const sign = percentage > 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
};

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

export const calculatePortfolioMetrics = (holdings: any[], currentPrices: { [symbol: string]: number }) => {
  let totalValue = 0;
  let totalInvested = 0;

  const updatedHoldings = holdings.map(holding => {
    const currentPrice = currentPrices[holding.symbol] || holding.currentPrice;
    const currentValue = holding.shares * currentPrice;
    const invested = holding.shares * holding.averageCost;
    const unrealizedPL = currentValue - invested;
    const unrealizedPLPercent = invested > 0 ? (unrealizedPL / invested) * 100 : 0;

    totalValue += currentValue;
    totalInvested += invested;

    return {
      ...holding,
      currentPrice,
      currentValue,
      unrealizedPL,
      unrealizedPLPercent
    };
  });

  const profitLoss = totalValue - totalInvested;
  const profitLossPercent = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

  return {
    holdings: updatedHoldings,
    totalValue,
    totalInvested,
    profitLoss,
    profitLossPercent
  };
};