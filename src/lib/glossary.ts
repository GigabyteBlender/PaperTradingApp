/**
 * Glossary of financial terms used throughout the application
 */

export interface GlossaryTerm {
  term: string;
  definition: string;
  category: 'price' | 'volume' | 'fundamental' | 'technical' | 'market';
}

/**
 * Comprehensive list of financial terms with plain language definitions
 * Organized by category for easy reference
 */
export const glossaryTerms: GlossaryTerm[] = [
  // Price-related terms (displayed on market page)
  {
    term: 'Current Price',
    definition: 'The most recent price at which a stock was traded. This updates in real-time during market hours.',
    category: 'price',
  },
  {
    term: 'Previous Close',
    definition: 'The final price at which a stock traded when the market closed on the previous trading day.',
    category: 'price',
  },
  {
    term: 'Day Range',
    definition: 'The highest and lowest prices at which a stock has traded during the current trading day.',
    category: 'price',
  },
  {
    term: 'Day High',
    definition: 'The highest price at which a stock has traded during the current trading day.',
    category: 'price',
  },
  {
    term: 'Day Low',
    definition: 'The lowest price at which a stock has traded during the current trading day.',
    category: 'price',
  },
  {
    term: 'Change',
    definition: 'The dollar amount difference between the current price and the previous closing price.',
    category: 'price',
  },
  {
    term: 'Change Percent',
    definition: 'The percentage difference between the current price and the previous closing price, showing relative movement.',
    category: 'price',
  },

  // Volume-related terms (displayed on market page)
  {
    term: 'Volume',
    definition: 'The total number of shares traded during a specific period, typically the current trading day.',
    category: 'volume',
  },

  // Fundamental analysis terms (displayed on market page)
  {
    term: 'Market Cap',
    definition: 'Market capitalization is the total value of all outstanding shares, calculated by multiplying share price by total shares.',
    category: 'fundamental',
  },
  {
    term: 'P/E Ratio',
    definition: 'Price-to-earnings ratio compares a stock\'s price to its earnings per share, indicating how much investors pay per dollar of earnings.',
    category: 'fundamental',
  },
  {
    term: 'Dividend Yield',
    definition: 'The annual dividend payment expressed as a percentage of the current stock price, showing income return.',
    category: 'fundamental',
  },

  // Market status terms (displayed on market page)
  {
    term: 'Market Status',
    definition: 'Indicates whether the stock market is currently open for trading, closed, or in pre/post-market hours.',
    category: 'market',
  },

  // Technical analysis terms (may appear in AI recommendations)
  {
    term: 'Moving Average',
    definition: 'The average price of a stock over a specific time period, smoothing out price fluctuations to identify trends.',
    category: 'technical',
  },
  {
    term: 'Support Level',
    definition: 'A price level where a stock tends to stop falling and may bounce back up due to increased buying interest.',
    category: 'technical',
  },
  {
    term: 'Resistance Level',
    definition: 'A price level where a stock tends to stop rising and may reverse downward due to increased selling pressure.',
    category: 'technical',
  },
  {
    term: 'Trend',
    definition: 'The general direction in which a stock price is moving over time, either upward, downward, or sideways.',
    category: 'technical',
  },
  {
    term: 'Volatility',
    definition: 'The degree of variation in a stock\'s price over time, with high volatility indicating larger price swings.',
    category: 'technical',
  },
  {
    term: 'Breakout',
    definition: 'When a stock price moves above a resistance level or below a support level, potentially signaling a new trend.',
    category: 'technical',
  },
  {
    term: 'Momentum',
    definition: 'The rate at which a stock\'s price is changing, indicating the strength of a price trend.',
    category: 'technical',
  },

  // Market condition terms (may appear in AI recommendations)
  {
    term: 'Bull Market',
    definition: 'A market condition where prices are rising or expected to rise, characterized by investor optimism and confidence.',
    category: 'market',
  },
  {
    term: 'Bear Market',
    definition: 'A market condition where prices are falling or expected to fall, typically defined as a 20% decline from recent highs.',
    category: 'market',
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

/**
 * Helper function to get all terms in a specific category
 */
export function getTermsByCategory(
  category: GlossaryTerm['category']
): GlossaryTerm[] {
  return glossaryTerms.filter((term) => term.category === category);
}

/**
 * Helper function to search terms by keyword
 */
export function searchTerms(query: string): GlossaryTerm[] {
  const lowerQuery = query.toLowerCase();
  return glossaryTerms.filter(
    (term) =>
      term.term.toLowerCase().includes(lowerQuery) ||
      term.definition.toLowerCase().includes(lowerQuery)
  );
}
