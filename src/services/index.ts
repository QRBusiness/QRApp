// Config axios instance
import axios from 'axios';
import { loadFromLocalStorage } from '@/libs/utils';

export type SuccessResponse<T> = {
  data: T;
};

export type ErrorResponse = {
  status: number;
  error: string;
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

  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const { response } = error;
    // if (response.status === 401 || response.status === 403) {
    //   if (window.location.pathname !== '/auth') {
    //     // Redirect to the login page if the user is not authenticated
    //     window.location.href = '/login';
    //   }
    // }

    console.error('API Error:', response);
    const error_response: ErrorResponse = {
      status: response.status,
      error: response.data.error || 'An error occurred',
      errorMessage: response.data.message,
    };
    return error_response;
  }
);

// Export the axios instance for use in other parts of the application
export default apiClient;
