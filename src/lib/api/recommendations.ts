import { apiClient } from './client';
import type { Recommendation } from '../types';

/**
 * Fetch stock recommendation with analysis.
 * Returns buy/hold/sell recommendation with score (0-100) and reasoning.
 */
export async function getRecommendation(
  symbol: string
): Promise<Recommendation> {
  return apiClient.get<Recommendation>(`/api/recommendations/${symbol}`);
}
