import { apiClient } from './api';
import type { Transaction } from './api/types';
import { sanitizeObject } from '../utils/security';

/**
 * Interface for transaction creation parameters
 */
export interface CreateTransactionParams {
  amount: string;
  description: string;
  from_account_id: number;
  to_account_id: number;
}

/**
 * Interface for transaction state update parameters
 */
export interface UpdateTransactionStateParams {
  state: 'sent' | 'received' | 'paid';
}

/**
 * Service class for transaction-related operations
 */
export class TransactionService {
  /**
   * Get all transactions
   * @returns Promise with transaction data
   */
  async getTransactions() {
    return apiClient.get<Transaction[]>('/api/transactions');
  }

  /**
   * Get a transaction by ID
   * @param id Transaction ID
   * @returns Promise with transaction data
   */
  async getTransactionById(id: number) {
    return apiClient.get<Transaction>(`/api/transactions/${id}`);
  }

  /**
   * Create a new transaction
   * @param params Transaction parameters
   * @returns Promise with created transaction data
   */
  async createTransaction(params: CreateTransactionParams) {
    // Sanitize input data
    const sanitizedParams = {
      ...params,
      description:
        typeof params.description === 'string'
          ? sanitizeObject({ text: params.description }).text
          : params.description,
    };
    return apiClient.post<Transaction>('/api/transactions', sanitizedParams);
  }

  /**
   * Update a transaction's state
   * @param id Transaction ID
   * @param params State update parameters
   * @returns Promise with updated transaction data
   */
  async updateTransactionState(id: number, state: 'sent' | 'received' | 'paid') {
    const params = { state };
    return apiClient.patch<Transaction>(`/api/transactions/${id}`, params);
  }

  /**
   * Search accounts and transactions
   * @param query Search query
   * @returns Promise with search results
   */
  async searchAccountsAndTransactions(query: string) {
    // Sanitize input data
    const sanitizedQuery = typeof query === 'string' ? sanitizeObject({ text: query }).text : query;
    return apiClient.get(`/api/search?q=${encodeURIComponent(sanitizedQuery as string)}`);
  }
}

// Create and export a singleton instance
export const transactionService = new TransactionService();
