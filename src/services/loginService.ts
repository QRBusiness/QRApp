import apiClient, { type SuccessResponse } from '@/services';

export interface loginSchema {
  username: string;
  password: string;
}
export interface loginResponse {
  access_token: string;
  refresh_token: string;
}

export const loginService = async (data: loginSchema): Promise<loginResponse> => {
  try {
    const response = await apiClient.post<SuccessResponse<loginResponse>>('/sign-in', data);
    return response.data.data;
  } catch (error) {
    throw new Error('Login failed');
  }
};
