import { apiClient } from './api';
import type { Account } from './api/types';
import { sanitizeObject } from '../utils/security';

/**
 * Interface for account query parameters
 */
export interface GetAccountsParams {
  limit: number;
  offset: number;
  sort_by: string;
  sort_order: 'asc' | 'desc';
}

/**
 * Service class for account-related operations
 */
export class AccountService {
  /**
   * Get all accounts with pagination and sorting
   * @param params Query parameters
   * @returns Promise with account data
   */
  async getAccounts(params: GetAccountsParams) {
    const queryParams = new URLSearchParams();

    // Add query parameters
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.offset) queryParams.append('offset', params.offset.toString());
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.sort_order) queryParams.append('sort_order', params.sort_order);

    const queryString = queryParams.toString();
    const url = `/api/accounts${queryString ? `?${queryString}` : ''}`;

    return apiClient.get<Account[]>(url);
  }

  /**
   * Get an account by ID
   * @param id Account ID
   * @returns Promise with account data
   */
  async getAccountById(id: number) {
    return apiClient.get<Account>(`/api/accounts/${id}`);
  }
}

// Create and export a singleton instance
export const accountService = new AccountService();
