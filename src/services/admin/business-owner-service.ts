import apiClient, { type ApiResponse } from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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
  } catch (error) {
    toast.error('Internal server error', {
      description: 'An unexpected error occurred while fetching business owners.',
    });
    throw new Error('Internal server error');
  }
};

export const useBusinessOwners = ({ page = 1, limit = 50 }: BusinessOwnerInputProps) => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<BusinessOwner[]>({
    queryKey: ['businessOwnersQuery', { page, limit }],
    queryFn: () => getBusinessOwners({ page, limit }),
  });

  if (error) {
    toast.error('Failed to load business owners', {
      description: error.message || 'An error occurred while fetching business owners.',
    });
  }

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
  } catch (error) {
    toast.error('Internal server error', {
      description: 'An unexpected error occurred while toggling business owner availability.',
    });
    throw new Error('Internal server error');
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
    onError: (error: Error) => {
      toast.error('Failed to update business owner availability', {
        description: error.message || 'An error occurred while updating the business owner availability.',
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
