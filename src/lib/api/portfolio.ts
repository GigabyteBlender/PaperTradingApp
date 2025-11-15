import { apiClient } from './client';
import type { PortfolioResponse, HoldingResponse } from './types';

/**
 * Fetch complete portfolio with calculated metrics (total value, profit/loss, holdings).
 */
export async function getPortfolio(): Promise<PortfolioResponse> {
  return apiClient.get<PortfolioResponse>('/api/portfolio');
}

/**
 * Fetch list of all user holdings.
 */
export async function getHoldings(): Promise<HoldingResponse[]> {
  return apiClient.get<HoldingResponse[]>('/api/portfolio/holdings');
}

/**
 * Fetch specific holding by symbol.
 */
export async function getHoldingBySymbol(
  symbol: string
): Promise<HoldingResponse> {
  return apiClient.get<HoldingResponse>(`/api/portfolio/holdings/${symbol}`);
}
