import { apiClient } from '../api';
import type { Account } from '../api/types';

/**
 * Fetches accounts with optional filtering and pagination
 * @param params Optional query parameters for filtering and pagination
 * @returns Promise with accounts data
 */
export const getAccounts = async (params?: {
  limit?: number;
  offset?: number;
  sort_by?: 'account_number' | 'account_name';
  sort_order?: 'asc' | 'desc';
}) => {
  return apiClient.get<Account[]>('/api/accounts', { params });
};
