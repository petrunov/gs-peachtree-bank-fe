import { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type { ErrorResponse } from './types';
import { addCsrfToken } from '../../utils/security';

// Enhanced error type that includes API error details
export interface EnhancedAxiosError extends AxiosError {
  apiError?: ErrorResponse;
}

export const setupInterceptors = (apiClient: AxiosInstance): void => {
  // Request interceptor
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Add authentication token if available
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add CSRF token to headers for non-GET requests
      if (
        config.method &&
        ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())
      ) {
        const csrfToken = document
          .querySelector('meta[name="csrf-token"]')
          ?.getAttribute('content');
        if (csrfToken) {
          config.headers.set('X-CSRF-Token', csrfToken);
        }
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    },
  );

  // Response interceptor
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
      // Create enhanced error object
      const enhancedError = error as EnhancedAxiosError;

      if (error.response?.data) {
        // Extract API error details
        enhancedError.apiError = error.response.data as ErrorResponse;

        // Log with more details
        console.error(
          `API Error (${error.response.status}): ${enhancedError.apiError.code} - ${enhancedError.apiError.message}`,
        );
      } else if (error.request) {
        enhancedError.apiError = {
          code: 'NetworkError',
          message: 'No response received from server. Please check your connection.',
        };
        console.error('Network Error: No response received');
      } else {
        enhancedError.apiError = {
          code: 'RequestError',
          message: error.message || 'An unknown error occurred',
        };
        console.error('Request Error:', error.message);
      }

      return Promise.reject(enhancedError);
    },
  );
};
