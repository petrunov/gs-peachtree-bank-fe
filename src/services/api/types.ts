export interface ApiResponse<T> {
  data: T;
  status: number;
  success: boolean;
}

export interface ErrorResponse {
  message: string;
  code: string;
  details?: Record<string, any>;
}

export interface Transaction {
  id: number;
  date: string;
  amount: string;
  beneficiary: string;
  description: string;
  state: 'sent' | 'received' | 'paid';
  from_account_id: number;
  to_account_id: number;
  type?: 'transaction';
}

export interface Account {
  id: number;
  account_name: string;
  account_number: string;
  type: 'account';
}

export interface SearchResponse {
  accounts: Account[];
  transactions: Transaction[];
}
