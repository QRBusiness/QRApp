import apiClient, { type ApiResponse } from '@/services';
import { toast } from 'sonner';

export interface UserProfile {
  data: {
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
  };
}

export const getCurrentUser = async (): Promise<UserProfile> => {
  try {
    const response: ApiResponse<UserProfile> = await apiClient.get('/me');
    if (response.status !== 200) {
      toast(response.error, {
        description: response.errorMessage || 'Failed to fetch user profile',
      });
    }
    return response.data as UserProfile;
  } catch (error) {
    throw new Error('Internal server error');
  }
};
