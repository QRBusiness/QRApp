// Config axios instance
import { ACCESS_TOKEN } from '@/constants';
import axios from 'axios';
import { loadFromLocalStorage } from '@/libs/utils';
import { useRefreshTokenService } from './auth-service';

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
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true, // ✅ Cho phép gửi cookies với request
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
  },
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can modify the request config here
    // For example, add an authorization token
    const token = loadFromLocalStorage(ACCESS_TOKEN, null);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // ✅ Đảm bảo withCredentials được set cho mỗi request
    config.withCredentials = true;

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
    const { response, config } = error;
    if ((response.status === 401 || response.status === 403) && !config._retry) {
      if (window.location.pathname !== '/login') {
        config._retry = true;
        try {
          await useRefreshTokenService();
          const access_token = loadFromLocalStorage(ACCESS_TOKEN, null);
          return apiClient.request({
            ...config,
            headers: {
              ...config.headers,
              Authorization: `Bearer ${access_token}`,
            },
            withCredentials: true, // ✅ Đảm bảo retry request cũng có withCredentials
          });
        } catch (refreshError) {
          // Nếu refresh token thất bại, chuyển hướng đến /login
          window.location.href = '/login';

          return Promise.reject({
            status: response?.status,
            error: response?.data?.error || 'Refresh token failed',
            errorMessage: response?.data?.message,
          });
        }
      }
    } else if ((response.status === 401 || response.status === 403) && config._retry) {
      // Nếu đã retry mà vẫn thất bại, chuyển hướng đến /login
      // window.location.href = '/login';
      return Promise.reject({
        status: response?.status,
        error: response?.data?.error || 'Unauthorized access',
        errorMessage: response?.data?.message,
      });
    }

    return Promise.reject({
      status: response?.status,
      error: response?.data?.error || 'An error occurred',
      errorMessage: response?.data?.message,
    });
  }
);

// Export the axios instance for use in other parts of the application
export default apiClient;
