import apiClient, { type ApiResponse } from '@/services';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Permission } from './owner/group-service';

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

interface PermissionResponse {
  data: Permission[];
}

export const getUserPermissions = async (): Promise<Permission[]> => {
  try {
    const response: ApiResponse<PermissionResponse> = await apiClient.get(`/my-permissions`);
    if (response.status !== 200) {
      toast(response.error, {
        description: response.errorMessage || 'Failed to fetch user permissions',
      });
    }
    return response.data ? response.data.data : [];
  } catch (error) {
    throw new Error('Internal server error');
  }
};

export const useUserPermissions = () => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<Permission[]>({
    queryKey: ['userPermissionsQuery'],
    queryFn: getUserPermissions,
  });

  if (error) {
    toast.error('Failed to load user permissions', {
      description: error.message || 'An error occurred while fetching user permissions.',
    });
  }

  return {
    userPermissions: data || [],
    isLoading,
    isFetching,
    isSuccess,
    refetch,
  };
};
