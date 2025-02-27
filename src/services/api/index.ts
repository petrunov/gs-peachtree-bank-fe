import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { setupInterceptors } from './interceptors';

/**
 * Creates a configured Axios instance for API requests
 * @param config Additional Axios configuration options
 * @returns Configured Axios instance
 */
export const createApiClient = (config?: AxiosRequestConfig): AxiosInstance => {
  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    ...config,
  });

  setupInterceptors(apiClient);

  return apiClient;
};

export const apiClient = createApiClient();

export default apiClient;
