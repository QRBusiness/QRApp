import apiClient, { type ApiResponse, type ErrorResponse } from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type z from 'zod';
import type { editUserSchema } from '@/utils/schemas';

interface BusinessOwnerInputProps {
  page: number;
  limit: number;
}

interface BusinessOwnerResponse {
  data: BusinessOwner[];
}

interface BusinessOwner {
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

const getBusinessOwners = async ({ page = 1, limit = 50 }: BusinessOwnerInputProps): Promise<BusinessOwner[]> => {
  try {
    const response: ApiResponse<BusinessOwnerResponse> = await apiClient.get('/users', {
      params: { page, limit },
    });
    if (response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to fetch business owners',
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

export const useBusinessOwners = ({ page = 1, limit = 50 }: BusinessOwnerInputProps) => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<BusinessOwner[]>({
    queryKey: ['businessOwnersQuery', { page, limit }],
    queryFn: () => getBusinessOwners({ page, limit }),
  });

  return {
    businessOwners: data || [],
    isLoading,
    isError: !!error,
    isFetching,
    isSuccess,
    refetch,
  };
};

const toggleAvailabilityBusinessOwner = async (id: string): Promise<BusinessOwner> => {
  try {
    const response: ApiResponse<BusinessOwner> = await apiClient.put(`/users/active/${id}`);
    if (response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to toggle business owner availability',
      });
      throw new Error(response.errorMessage || 'Failed to toggle business owner availability');
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

export const useToggleAvailabilityBusinessOwner = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, data, isPending, isError, isSuccess } = useMutation({
    mutationFn: toggleAvailabilityBusinessOwner,
    onSuccess: (data: BusinessOwner) => {
      toast.success('Business owner availability toggled successfully', {
        description: `Business owner ${data.name} has been updated.`,
      });
      queryClient.invalidateQueries({
        queryKey: ['businessOwnersQuery'],
      });
    },
  });

  return {
    toggleAvailabilityBusinessOwner: mutateAsync,
    data,
    isPending,
    isError,
    isSuccess,
  };
};

const updateBusinessOwner = async (id: string, data: z.infer<typeof editUserSchema>): Promise<BusinessOwner> => {
  try {
    const response: ApiResponse<BusinessOwner> = await apiClient.put(`/users/${id}`, data);
    if (response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to update business owner',
      });
      throw new Error(response.errorMessage || 'Failed to update business owner');
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

export const useUpdateBusinessOwner = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, data, isPending, isError, isSuccess } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: z.infer<typeof editUserSchema> }) => updateBusinessOwner(id, data),
    onSuccess: (data: BusinessOwner) => {
      toast.success('Business owner updated successfully', {
        description: `Business owner ${data.name} has been updated.`,
      });
      queryClient.invalidateQueries({
        queryKey: ['businessOwnersQuery'],
      });
    },
  });

  return {
    updateBusinessOwner: mutateAsync,
    data,
    isPending,
    isError,
    isSuccess,
  };
};
