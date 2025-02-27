import { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export const setupInterceptors = (apiClient: AxiosInstance): void => {
  // Request interceptor
  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
      if (error.response) {
        const status = error.response.status;

        if (status === 401) {
          console.error('Unauthorized access');
        } else if (status === 403) {
          console.error('Forbidden access');
        } else if (status === 404) {
          console.error('Resource not found');
        } else if (status >= 500) {
          console.error('Server error');
        }
      } else if (error.request) {
        console.error('No response received from server');
      } else {
        console.error('Error setting up request:', error.message);
      }

      return Promise.reject(error);
    },
  );
};
