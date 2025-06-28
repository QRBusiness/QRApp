import apiClient, { type ApiResponse, type ErrorResponse } from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type z from 'zod';
import type { createUserSchema, editUserSchema } from '@/utils/schemas';

interface BusinessOwnerInputProps {
  page: number;
  limit: number;
}

interface UserResponse {
  data: User[];
}

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  available: boolean;
  created_at: string;
  updated_at: string;
}

const getUsers = async ({ page = 1, limit = 50 }: BusinessOwnerInputProps): Promise<User[]> => {
  try {
    const response: ApiResponse<UserResponse> = await apiClient.get('/users', {
      params: { page, limit },
    });
    if (response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to fetch users',
      });
      return [];
    }
    return response.data ? response.data.data : [];
  } catch (error: ErrorResponse | any) {
    toast.error((error as ErrorResponse).error || 'Internal server error', {
      description:
        (error as ErrorResponse).errorMessage || 'An unexpected error occurred while fetching business owners.',
    });
    throw new Error((error as ErrorResponse).errorMessage || 'Internal server error');
  }
};

export const useUsers = ({ page = 1, limit = 50 }: BusinessOwnerInputProps) => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<User[]>({
    queryKey: ['usersQuery', { page, limit }],
    queryFn: () => getUsers({ page, limit }),
  });

  return {
    users: data || [],
    isLoading,
    isError: !!error,
    isFetching,
    isSuccess,
    refetch,
  };
};

const toggleAvailabilityUser = async (id: string): Promise<User> => {
  try {
    const response: ApiResponse<User> = await apiClient.put(`/users/active/${id}`);
    if (response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to toggle user availability',
      });
      throw new Error(response.errorMessage || 'Failed to toggle user availability');
    }
    return response.data;
  } catch (error: ErrorResponse | any) {
    toast.error((error as ErrorResponse).error || 'Internal server error', {
      description:
        (error as ErrorResponse).errorMessage ||
        'An unexpected error occurred while toggling business owner availability.',
    });
    throw new Error((error as ErrorResponse).errorMessage || 'Internal server error');
  }
};

export const useToggleAvailabilityUser = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, data, isPending, isError, isSuccess } = useMutation({
    mutationFn: toggleAvailabilityUser,
    onSuccess: (data: User) => {
      toast.success('User availability toggled successfully', {
        description: `User ${data.name} has been updated.`,
      });
      queryClient.invalidateQueries({
        queryKey: ['usersQuery'],
      });
    },
  });

  return {
    toggleAvailabilityUser: mutateAsync,
    data,
    isPending,
    isError,
    isSuccess,
  };
};

const updateUser = async (id: string, data: z.infer<typeof editUserSchema>): Promise<User> => {
  try {
    const response: ApiResponse<User> = await apiClient.put(`/users/${id}`, data);
    if (response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to update user',
      });
      throw new Error(response.errorMessage || 'Failed to update user');
    }
    return response.data;
  } catch (error: ErrorResponse | any) {
    toast.error((error as ErrorResponse).error || 'Internal server error', {
      description:
        (error as ErrorResponse).errorMessage || 'An unexpected error occurred while updating the business owner.',
    });
    throw new Error((error as ErrorResponse).errorMessage || 'Internal server error');
  }
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, data, isPending, isError, isSuccess } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: z.infer<typeof editUserSchema> }) => updateUser(id, data),
    onSuccess: (data: User) => {
      toast.success('User updated successfully', {
        description: `User ${data.name} has been updated.`,
      });
      queryClient.invalidateQueries({
        queryKey: ['usersQuery'],
      });
    },
  });

  return {
    updateUser: mutateAsync,
    data,
    isPending,
    isError,
    isSuccess,
  };
};

const createUser = async (data: z.infer<typeof createUserSchema>): Promise<User> => {
  try {
    const response: ApiResponse<User> = await apiClient.post('/users', data);
    if (response.status !== 201 && response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to create user',
      });
      throw new Error(response.errorMessage || 'Failed to create user');
    }
    return response.data;
  } catch (error: ErrorResponse | any) {
    toast.error((error as ErrorResponse).error || 'Internal server error', {
      description:
        (error as ErrorResponse).errorMessage || 'An unexpected error occurred while creating the business owner.',
    });
    throw new Error((error as ErrorResponse).errorMessage || 'Internal server error');
  }
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, data, isPending, isError, isSuccess } = useMutation({
    mutationFn: createUser,
    onSuccess: (data: User) => {
      toast.success('User created successfully', {
        description: `User ${data.name} has been created.`,
      });
      queryClient.invalidateQueries({
        queryKey: ['usersQuery'],
      });
    },
  });

  return {
    createUser: mutateAsync,
    data,
    isPending,
    isError,
    isSuccess,
  };
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    const response: ApiResponse<void> = await apiClient.delete(`/users/${id}`);
    if (response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to delete user',
      });
      throw new Error(response.errorMessage || 'Failed to delete user');
    }
  } catch (error: ErrorResponse | any) {
    toast.error((error as ErrorResponse).error || 'Internal server error', {
      description:
        (error as ErrorResponse).errorMessage || 'An unexpected error occurred while deleting the business owner.',
    });
    throw new Error((error as ErrorResponse).errorMessage || 'Internal server error');
  }
};
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, data, isPending, isError, isSuccess } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('User deleted successfully', {
        description: 'The user has been deleted.',
      });
      queryClient.invalidateQueries({
        queryKey: ['usersQuery'],
      });
    },
  });

  return {
    deleteUser: mutateAsync,
    data,
    isPending,
    isError,
    isSuccess,
  };
};
