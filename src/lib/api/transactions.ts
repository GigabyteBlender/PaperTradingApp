import { apiClient } from './client';
import type {
  TransactionCreateRequest,
  TransactionCreateResponse,
  TransactionResponse,
} from './types';

/**
 * Execute buy or sell transaction with atomic balance and holdings updates.
 */
export async function createTransaction(
  data: TransactionCreateRequest
): Promise<TransactionCreateResponse> {
  return apiClient.post<TransactionCreateResponse>('/api/transactions', data);
}

/**
 * Fetch user transaction history with pagination.
 */
export async function getTransactions(
  limit: number = 50,
  offset: number = 0
): Promise<TransactionResponse[]> {
  return apiClient.get<TransactionResponse[]>(
    `/api/transactions?limit=${limit}&offset=${offset}`
  );
}

/**
 * Fetch specific transaction by ID.
 */
export async function getTransactionById(
  transactionId: string
): Promise<TransactionResponse> {
  return apiClient.get<TransactionResponse>(`/api/transactions/${transactionId}`);
}
