import { apiClient } from '../api';
import type { Transaction } from '../api/types';

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
