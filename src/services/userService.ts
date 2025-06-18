import apiClient, { type SuccessResponse } from '@/services';

export interface UserProfile {
  _id: string;
  name: string;
  phone: string;
  address: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  role: string;
  permissions: any[];
  business: {
    _id: string;
    name: string;
    address: string;
    contact: string;
    created_at: string;
    updated_at: string;
    tax_code: string;
    business_type: {
      _id: string;
      name: string;
      description: string;
      created_at: string;
      updated_at: string;
    };
  };
}

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get<SuccessResponse<UserProfile>>('/me');
    return response.data.data;
  } catch (error) {
    throw new Error('Failed to fetch user profile');
  }
};
