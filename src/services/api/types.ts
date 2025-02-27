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
