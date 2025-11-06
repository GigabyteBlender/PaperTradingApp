import {
  Portfolio,
  Holding,
  Stock,
  User,
  Recommendation,
  Transaction,
  MarketStatus,
  RecommendationAction,
  RiskLevel,
  TransactionType
} from '@/types';

const MARKET_UPDATE_TIME = new Date('2024-10-16T15:30:00.000Z');
export const mockUser: User = {
  userId: 'user-123',
  username: 'john_trader',
  email: 'john@example.com',
  balance: 25000.00
};

// Mock stock data
export const mockStocks: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 180.00,
    previousClose: 178.50,
    change: 1.50,
    changePercent: 0.84,
    lastUpdate: MARKET_UPDATE_TIME,
    marketStatus: MarketStatus.OPEN,
    volume: 45000000,
    dayHigh: 182.00,
    dayLow: 177.50,
    marketCap: 2800000000000,
    peRatio: 28.5,
    dividendYield: 0.52
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    currentPrice: 2800.00,
    previousClose: 2814.00,
    change: -14.00,
    changePercent: -0.50,
    lastUpdate: MARKET_UPDATE_TIME,
    marketStatus: MarketStatus.OPEN,
    volume: 1200000,
    dayHigh: 2820.00,
    dayLow: 2795.00,
    marketCap: 1750000000000,
    peRatio: 25.2,
    dividendYield: 0.00
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    currentPrice: 700.00,
    previousClose: 679.50,
    change: 20.50,
    changePercent: 3.02,
    lastUpdate: MARKET_UPDATE_TIME,
    marketStatus: MarketStatus.OPEN,
    volume: 25000000,
    dayHigh: 705.00,
    dayLow: 685.00,
    marketCap: 700000000000,
    peRatio: 65.8,
    dividendYield: 0.00
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    currentPrice: 380.00,
    previousClose: 375.20,
    change: 4.80,
    changePercent: 1.28,
    lastUpdate: MARKET_UPDATE_TIME,
    marketStatus: MarketStatus.OPEN,
    volume: 18500000,
    dayHigh: 382.50,
    dayLow: 376.00,
    marketCap: 2820000000000,
    peRatio: 32.1,
    dividendYield: 0.68
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    currentPrice: 435.00,
    previousClose: 428.90,
    change: 6.10,
    changePercent: 1.42,
    lastUpdate: MARKET_UPDATE_TIME,
    marketStatus: MarketStatus.OPEN,
    volume: 35000000,
    dayHigh: 440.00,
    dayLow: 430.00,
    marketCap: 1070000000000,
    peRatio: 68.5,
    dividendYield: 0.03
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    currentPrice: 145.50,
    previousClose: 143.80,
    change: 1.70,
    changePercent: 1.18,
    lastUpdate: MARKET_UPDATE_TIME,
    marketStatus: MarketStatus.OPEN,
    volume: 28000000,
    dayHigh: 147.00,
    dayLow: 144.20,
    marketCap: 1510000000000,
    peRatio: 45.2,
    dividendYield: 0.00
  },
  {
    symbol: 'META',
    name: 'Meta Platforms Inc.',
    currentPrice: 325.00,
    previousClose: 320.15,
    change: 4.85,
    changePercent: 1.52,
    lastUpdate: MARKET_UPDATE_TIME,
    marketStatus: MarketStatus.OPEN,
    volume: 22000000,
    dayHigh: 327.50,
    dayLow: 322.00,
    marketCap: 825000000000,
    peRatio: 24.8,
    dividendYield: 0.37
  },
  {
    symbol: 'NFLX',
    name: 'Netflix Inc.',
    currentPrice: 485.00,
    previousClose: 478.20,
    change: 6.80,
    changePercent: 1.42,
    lastUpdate: MARKET_UPDATE_TIME,
    marketStatus: MarketStatus.OPEN,
    volume: 8500000,
    dayHigh: 488.00,
    dayLow: 480.00,
    marketCap: 215000000000,
    peRatio: 42.3,
    dividendYield: 0.00
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase & Co.',
    currentPrice: 155.80,
    previousClose: 154.30,
    change: 1.50,
    changePercent: 0.97,
    lastUpdate: MARKET_UPDATE_TIME,
    marketStatus: MarketStatus.OPEN,
    volume: 12000000,
    dayHigh: 157.00,
    dayLow: 154.50,
    marketCap: 455000000000,
    peRatio: 12.8,
    dividendYield: 2.15
  },
  {
    symbol: 'V',
    name: 'Visa Inc.',
    currentPrice: 275.50,
    previousClose: 273.20,
    change: 2.30,
    changePercent: 0.84,
    lastUpdate: MARKET_UPDATE_TIME,
    marketStatus: MarketStatus.OPEN,
    volume: 6500000,
    dayHigh: 276.80,
    dayLow: 274.00,
    marketCap: 580000000000,
    peRatio: 31.5,
    dividendYield: 0.74
  }
];

// Mock holdings data
export const mockHoldings: Holding[] = [
  {
    symbol: 'AAPL',
    shares: 10,
    averageCost: 175.00,
    currentPrice: 180.00,
    currentValue: 1800.00,
    unrealizedPL: 50.00,
    unrealizedPLPercent: 2.86,
    purchasedAt: new Date('2024-01-15T00:00:00.000Z')
  },
  {
    symbol: 'GOOGL',
    shares: 5,
    averageCost: 2850.00,
    currentPrice: 2800.00,
    currentValue: 14000.00,
    unrealizedPL: -250.00,
    unrealizedPLPercent: -1.75,
    purchasedAt: new Date('2024-02-10T00:00:00.000Z')
  },
  {
    symbol: 'TSLA',
    shares: 2,
    averageCost: 680.00,
    currentPrice: 700.00,
    currentValue: 1400.00,
    unrealizedPL: 40.00,
    unrealizedPLPercent: 2.94,
    purchasedAt: new Date('2024-03-05T00:00:00.000Z')
  }
];

// Mock portfolio data
export const mockPortfolio: Portfolio = {
  totalValue: 17200.00,
  totalInvested: 17360.00,
  profitLoss: -160.00,
  profitLossPercent: -0.92,
  holdings: mockHoldings
};

// Mock recommendations
export const mockRecommendations: Recommendation[] = [
  {
    recommendationId: 'rec-001',
    userId: 'user-123',
    symbol: 'MSFT',
    action: RecommendationAction.BUY,
    confidence: 0.85,
    reasoning: 'Strong quarterly earnings and cloud growth potential',
    riskLevel: RiskLevel.MEDIUM,
    targetPrice: 420.00,
    currentPrice: 380.00,
    potentialGain: 10.53,
    createdAt: new Date('2024-10-14T00:00:00.000Z'),
    expiresAt: new Date('2024-11-14T00:00:00.000Z')
  },
  {
    recommendationId: 'rec-002',
    userId: 'user-123',
    symbol: 'NVDA',
    action: RecommendationAction.HOLD,
    confidence: 0.72,
    reasoning: 'AI market growth but high valuation concerns',
    riskLevel: RiskLevel.HIGH,
    targetPrice: 450.00,
    currentPrice: 435.00,
    potentialGain: 3.45,
    createdAt: new Date('2024-10-13T00:00:00.000Z'),
    expiresAt: new Date('2024-11-13T00:00:00.000Z')
  }
];

// Mock transactions
export const mockTransactions: Transaction[] = [
  {
    transactionId: 'txn-001',
    userId: 'user-123',
    type: TransactionType.BUY,
    symbol: 'AAPL',
    shares: 10,
    price: 175.00,
    totalCost: 1750.00,
    timestamp: new Date('2024-01-15T10:30:00.000Z')
  },
  {
    transactionId: 'txn-002',
    userId: 'user-123',
    type: TransactionType.BUY,
    symbol: 'GOOGL',
    shares: 5,
    price: 2850.00,
    totalCost: 14250.00,
    timestamp: new Date('2024-02-10T14:15:00.000Z')
  },
  {
    transactionId: 'txn-003',
    userId: 'user-123',
    type: TransactionType.BUY,
    symbol: 'TSLA',
    shares: 2,
    price: 680.00,
    totalCost: 1360.00,
    timestamp: new Date('2024-03-05T11:45:00.000Z')
  }
];