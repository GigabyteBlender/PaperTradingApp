import { apiClient } from './client';
import type { UserResponse, BalanceResponse } from './types';

/**
 * Fetch current user profile data.
 */
export async function getUserProfile(): Promise<UserResponse> {
  return apiClient.get<UserResponse>('/api/users/me');
}

/**
 * Fetch current user balance.
 */
export async function getUserBalance(): Promise<BalanceResponse> {
  return apiClient.get<BalanceResponse>('/api/users/me/balance');
}
