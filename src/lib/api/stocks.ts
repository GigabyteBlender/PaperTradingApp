import { apiClient } from './client';
import type {
  StockQuoteResponse,
  StockDetailsResponse,
  StockSearchResult,
  HistoricalPrice,
} from './types';

/**
 * Fetch current stock quote (lightweight version with price and change).
 */
export async function getStockQuote(
  symbol: string
): Promise<StockQuoteResponse> {
  return apiClient.get<StockQuoteResponse>(`/api/stocks/quote/${symbol}`);
}

/**
 * Fetch detailed stock information including fundamentals and market data.
 */
export async function getStockDetails(
  symbol: string
): Promise<StockDetailsResponse> {
  return apiClient.get<StockDetailsResponse>(`/api/stocks/${symbol}`);
}

/**
 * Search for stocks by symbol or company name.
 */
export async function searchStocks(
  query: string,
  limit: number = 10
): Promise<StockSearchResult[]> {
  return apiClient.get<StockSearchResult[]>(
    `/api/stocks/search?q=${encodeURIComponent(query)}&limit=${limit}`
  );
}

/**
 * Fetch historical price data for charting.
 */
export async function getStockHistory(
  symbol: string,
  period: '1d' | '5d' | '1mo' | '3mo' | '1y' | '5y' = '1mo'
): Promise<HistoricalPrice[]> {
  return apiClient.get<HistoricalPrice[]>(
    `/api/stocks/${symbol}/history?period=${period}`
  );
}
