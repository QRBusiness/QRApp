import apiClient, { type ApiResponse } from '@/services';
import { toast } from 'sonner';
import { z } from 'zod';
import { loginSchema } from '@/utils/schemas';

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
      toast(response.error, { description: response.errorMessage || 'An error occurred while logging in' });
    }
    return response.data;
  } catch (error) {
    throw new Error('Internal server error');
  }
};
