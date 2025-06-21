import { REFRESH_TOKEN } from '@/constains';
import apiClient, { type ApiResponse } from '@/services';
import { toast } from 'sonner';
import { z } from 'zod';
import { loginSchema } from '@/utils/schemas';
import { loadFromLocalStorage } from '@/libs/utils';

export interface loginResponse {
  data: {
    access_token: string;
    refresh_token: string;
  };
}

export const loginService = async (data: z.infer<typeof loginSchema>): Promise<loginResponse> => {
  try {
    const response: ApiResponse<loginResponse> = await apiClient.post('/sign-in', data);
    if (response.status !== 200) {
      toast.error(response.error, { description: response.errorMessage || 'An error occurred while logging in' });
    }
    return response.data;
  } catch (error) {
    throw new Error('Internal server error');
  }
};

export const logoutService = async (): Promise<void> => {
  try {
    const response: ApiResponse<void> = await apiClient.post('/sign-out');
    if (response.status !== 200) {
      toast.error(response.error, { description: response.errorMessage || 'An error occurred while logging out' });
    }
  } catch (error) {
    throw new Error('Internal server error');
  }
};

export const useRefreshTokenService = async (): Promise<loginResponse> => {
  try {
    const refresh_token = loadFromLocalStorage(REFRESH_TOKEN, 'REFRESH_TOKEN');
    const response: ApiResponse<loginResponse> = await apiClient.post('/refresh-token', {
      refresh_token: refresh_token,
    });
    if (response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'An error occurred while using refresh token',
      });
      throw new Error(response.errorMessage || 'An error occurred while using refresh token');
    }
    return response.data;
  } catch (error) {
    throw new Error('Internal server error');
  }
};
