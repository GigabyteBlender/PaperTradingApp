export enum MarketStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  PRE_MARKET = 'PRE_MARKET',
  AFTER_HOURS = 'AFTER_HOURS'
}

export enum RecommendationAction {
  BUY = 'BUY',
  SELL = 'SELL',
  HOLD = 'HOLD'
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL'
}

export enum SearchType {
  SYMBOL = 'SYMBOL',
  COMPANY_NAME = 'COMPANY_NAME',
  MIXED = 'MIXED'
}

export interface User {
  userId: string;
  username: string;
  email: string;
  balance: number;
}

export interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  lastUpdate: Date;
  marketStatus: MarketStatus;
  volume: number;
  dayHigh: number;
  dayLow: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
}

export interface Recommendation {
  recommendationId: string;
  userId: string;
  symbol: string;
  action: RecommendationAction;
  confidence: number;
  reasoning: string;
  riskLevel: RiskLevel;
  targetPrice: number;
  currentPrice: number;
  potentialGain: number;
  createdAt: Date;
  expiresAt: Date;
}

export interface Transaction {
  transactionId: string;
  userId: string;
  type: TransactionType;
  symbol: string;
  shares: number;
  price: number;
  totalCost: number;
  timestamp: Date;
}

export interface Holding {
  symbol: string;
  companyName: string;
  shares: number;
  averageCost: number;
  currentPrice: number;
  currentValue: number;
  unrealizedPL: number;
  unrealizedPLPercent: number;
  purchasedAt: Date;
}

export interface Portfolio {
  totalValue: number;
  totalInvested: number;
  profitLoss: number;
  profitLossPercent: number;
  holdings: Holding[];
}

export interface Search {
  searchTerm: string;
  results: Stock[];
  count: number;
  searchType: SearchType;
  isLoading: boolean;
}