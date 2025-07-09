import apiClient, { type ApiResponse, type ErrorResponse } from '@/services';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type z from 'zod';
import type { editUserProfileSchema } from '@/utils/schemas';
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
    username: string;
    available: boolean;
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
      expired_at: string;
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

const uploadAvatarApi = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('avatar', file);
  try {
    const response: ApiResponse<{ image_url: string }> = await apiClient.post('/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to upload avatar',
      });
    }
    return response.data.image_url;
  } catch (error: ErrorResponse | any) {
    toast.error(error.error, {
      description: error.errorMessage || 'An error occurred while uploading avatar',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useUploadAvatar = () => {
  const { mutateAsync: uploadAvatar } = useMutation<string, Error, File>({
    mutationKey: ['uploadAvatar'],
    mutationFn: uploadAvatarApi,
  });

  return {
    uploadAvatar,
  };
};

const updateUserProfileApi = async (data: z.infer<typeof editUserProfileSchema>) => {
  try {
    const response: ApiResponse<UserProfile> = await apiClient.put('/me', data);
    if (response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to update user profile',
      });
    }
    return response.data.data;
  } catch (error: ErrorResponse | any) {
    toast.error(error.error, {
      description: error.errorMessage || 'An error occurred while updating user profile',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useUpdateUserProfile = () => {
  const { mutateAsync: updateUserProfile } = useMutation({
    mutationKey: ['updateUserProfile'],
    mutationFn: updateUserProfileApi,
    onSuccess: () => {
      toast.success('User profile updated successfully');
    },
  });

  return {
    updateUserProfile,
  };
};
