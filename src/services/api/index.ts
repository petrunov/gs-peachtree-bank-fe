import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { setupInterceptors } from './interceptors';

/**
 * Creates a configured Axios instance for API requests
 * @param config Additional Axios configuration options
 * @returns Configured Axios instance
 */
export const createApiClient = (config?: AxiosRequestConfig): AxiosInstance => {
  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...config,
  });

  // Set up request and response interceptors
  setupInterceptors(apiClient);

  return apiClient;
};

// Create and export a default API client instance
export const apiClient = createApiClient();

export default apiClient;
