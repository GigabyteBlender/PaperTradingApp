export enum MarketStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  PRE_MARKET = 'PRE_MARKET',
  AFTER_HOURS = 'AFTER_HOURS'
}

export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL'
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