// Authentication types
export interface SignupRequest {
  email: string;
  password: string;
  username: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  balance: number;
  created_at: string;
}

// User types
export interface BalanceResponse {
  balance: number;
}

// Portfolio types
export interface HoldingResponse {
  symbol: string;
  company_name: string;
  shares: number;
  average_cost: number;
  current_price: number;
  current_value: number;
  unrealized_pl: number;
  unrealized_pl_percent: number;
  purchased_at: string;
}

export interface PortfolioResponse {
  total_value: number;
  total_invested: number;
  profit_loss: number;
  profit_loss_percent: number;
  holdings: HoldingResponse[];
}

// Transaction types
export interface TransactionCreateRequest {
  type: 'BUY' | 'SELL';
  symbol: string;
  shares: number;
  price: number;
  company_name: string;
}

export interface TransactionResponse {
  id: string;
  type: string;
  symbol: string;
  shares: number;
  price: number;
  total_cost: number;
  timestamp: string;
}

export interface TransactionCreateResponse {
  transaction: TransactionResponse;
  updated_balance: number;
  updated_holding?: HoldingResponse;
}

// Stock types
export interface StockQuoteResponse {
  symbol: string;
  current_price: number;
  change: number;
  change_percent: number;
  last_update: string;
}

export interface StockDetailsResponse {
  symbol: string;
  name: string;
  current_price: number;
  previous_close: number;
  change: number;
  change_percent: number;
  last_update: string;
  market_status: string;
  volume: number;
  day_high: number;
  day_low: number;
  market_cap: number;
  pe_ratio: number;
  dividend_yield: number;
}

export interface StockSearchResult {
  symbol: string;
  name: string;
  current_price: number;
  change: number;
  change_percent: number;
}

export interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
