import { apiClient } from './client';
import type { Recommendation } from '../types';

/**
 * Fetch AI-powered stock recommendation with analysis.
 * Returns buy/hold/sell recommendation with score (0-100) and reasoning.
 * 
 * @param symbol - Stock ticker symbol (e.g., 'AAPL', 'TSLA')
 * @returns Recommendation object with score, reasoning, and key factors
 * @throws APIError with appropriate status code and message
 */
export async function getRecommendation(
  symbol: string
): Promise<Recommendation> {
  return apiClient.get<Recommendation>(`/api/recommendations/${symbol}`);
}
