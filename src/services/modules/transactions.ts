import { apiClient } from '../api';
import type { Transaction, SearchResponse } from '../api/types';

/**
 * Fetches transactions with optional filtering and pagination
 * @param params Optional query parameters for filtering and pagination
 * @returns Promise with transaction data
 */
export const getTransactions = async (params?: {
  limit?: number;
  offset?: number;
  sort_by?: 'date' | 'amount' | 'beneficiary';
  sort_order?: 'asc' | 'desc';
  search?: string;
}) => {
  return apiClient.get<Transaction[]>('/api/transactions', { params });
};

/**
 * Fetches a single transaction by ID
 * @param id Transaction ID
 * @returns Promise with transaction data
 */
export const getTransactionById = async (id: number) => {
  return apiClient.get<Transaction>(`/api/transactions/${id}`);
};

/**
 * Searches for accounts and transactions
 * @param query Search query
 * @param limit Maximum number of results to return
 * @param offset Number of results to skip
 * @returns Promise with search results
 */
export const searchAccountsAndTransactions = async (
  query: string,
  limit: number = 100,
  offset: number = 0,
) => {
  return apiClient.get<SearchResponse>('/api/search', {
    params: {
      q: query,
      limit,
      offset,
    },
  });
};
