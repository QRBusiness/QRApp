// Config axios instance
import axios from 'axios';
import { loadFromLocalStorage } from '@/libs/utils';

export type SuccessResponse<T> = {
  buniness: any;
  status: number;
  data: T;
};

export type ErrorResponse = {
  status: number;
  errorMessage: string;
};

export type ApiResponse<T> = SuccessResponse<T> & ErrorResponse;
// Config axios instance
// This file is used to configure the axios instance for API requests.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  },
});
// Type aliases removed because they are only valid in TypeScript files.

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can modify the request config here
    // For example, add an authorization token
    const token = loadFromLocalStorage('access_token', null);
    console.log('Token:', token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Handle successful response status codes
    return response;
  },
  (error) => {
    // Handle response errors
    if (error.response) {
      // You can customize the error handling here
      return Promise.reject(new Error(error.response.data.message || 'An error occurred'));
    }
    // Handle other errors (e.g., network errors)
    return Promise.reject(error);
  }
);

// Export the axios instance for use in other parts of the application
export default apiClient;
