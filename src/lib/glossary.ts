/**
 * Glossary of financial terms used throughout the application
 */

export interface GlossaryTerm {
  term: string;
  definition: string;
}

/**
 * Comprehensive list of financial terms with plain language definitions
 */
export const glossaryTerms: GlossaryTerm[] = [
  {
    term: 'Current Price',
    definition: 'The most recent price at which a stock was traded. This updates in real-time during market hours.',
  },
  {
    term: 'Previous Close',
    definition: 'The final price at which a stock traded when the market closed on the previous trading day.',
  },
  {
    term: 'Day Range',
    definition: 'The highest and lowest prices at which a stock has traded during the current trading day.',
  },
  {
    term: 'Day High',
    definition: 'The highest price at which a stock has traded during the current trading day.',
  },
  {
    term: 'Day Low',
    definition: 'The lowest price at which a stock has traded during the current trading day.',
  },
  {
    term: 'Change',
    definition: 'The dollar amount difference between the current price and the previous closing price.',
  },
  {
    term: 'Change Percent',
    definition: 'The percentage difference between the current price and the previous closing price, showing relative movement.',
  },
  {
    term: 'Volume',
    definition: 'The total number of shares traded during a specific period, typically the current trading day.',
  },
  {
    term: 'Market Cap',
    definition: 'Market capitalization is the total value of all outstanding shares, calculated by multiplying share price by total shares.',
  },
  {
    term: 'P/E Ratio',
    definition: 'Price-to-earnings ratio compares a stock\'s price to its earnings per share, indicating how much investors pay per dollar of earnings.',
  },
  {
    term: 'Dividend Yield',
    definition: 'The annual dividend payment expressed as a percentage of the current stock price, showing income return.',
  },
  {
    term: 'Market Status',
    definition: 'Indicates whether the stock market is currently open for trading, closed, or in pre/post-market hours.',
  },
  {
    term: 'Moving Average',
    definition: 'The average price of a stock over a specific time period, smoothing out price fluctuations to identify trends.',
  },
  {
    term: 'Support Level',
    definition: 'A price level where a stock tends to stop falling and may bounce back up due to increased buying interest.',
  },
  {
    term: 'Resistance Level',
    definition: 'A price level where a stock tends to stop rising and may reverse downward due to increased selling pressure.',
  },
  {
    term: 'Trend',
    definition: 'The general direction in which a stock price is moving over time, either upward, downward, or sideways.',
  },
  {
    term: 'Volatility',
    definition: 'The degree of variation in a stock\'s price over time, with high volatility indicating larger price swings.',
  },
  {
    term: 'Breakout',
    definition: 'When a stock price moves above a resistance level or below a support level, potentially signaling a new trend.',
  },
  {
    term: 'Momentum',
    definition: 'The rate at which a stock\'s price is changing, indicating the strength of a price trend.',
  },
  {
    term: 'Bull Market',
    definition: 'A market condition where prices are rising or expected to rise, characterized by investor optimism and confidence.',
  },
  {
    term: 'Bear Market',
    definition: 'A market condition where prices are falling or expected to fall, typically defined as a 20% decline from recent highs.',
  },
];

/**
 * Helper function to get a term definition by name
 */
export function getTermDefinition(term: string): string | undefined {
  const glossaryTerm = glossaryTerms.find(
    (t) => t.term.toLowerCase() === term.toLowerCase()
  );
  return glossaryTerm?.definition;
}

