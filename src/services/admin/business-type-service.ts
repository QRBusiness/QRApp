import apiClient, { type ApiResponse } from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { createBusinessTypeSchema } from '@/utils/schemas';

interface BusinessTypeInputProps {
  page: number;
  limit: number;
}

interface BusinessTypeResponse {
  data: BusinessType[];
}

interface BusinessType {
  _id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

const getBusinessTypes = async ({ page = 1, limit = 50 }: BusinessTypeInputProps): Promise<BusinessType[]> => {
  try {
    const response: ApiResponse<BusinessTypeResponse> = await apiClient.get('/business-type', {
      params: { page, limit },
    });
    if (response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to fetch business types',
      });
      return [];
    }
    return response.data ? response.data.data : [];
  } catch (error) {
    toast.error('Internal server error', {
      description: 'An unexpected error occurred while fetching business types.',
    });
    throw new Error('Internal server error');
  }
};

export const useBusinessTypes = ({ page = 1, limit = 50 }: BusinessTypeInputProps) => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<BusinessType[]>({
    queryKey: ['businessTypesQuery', { page, limit }],
    queryFn: () => getBusinessTypes({ page, limit }),
  });

  if (error) {
    toast.error('Failed to load business types', {
      description: error.message || 'An error occurred while fetching business types.',
    });
  }

  return {
    businessTypes: data || [],
    isLoading,
    isError: !!error,
    isFetching,
    isSuccess,
    refetch,
  };
};

interface createBusinessTypeResponse {
  data: BusinessType;
}

const createBusinessType = async ({
  name,
  description,
}: z.infer<typeof createBusinessTypeSchema>): Promise<BusinessType> => {
  try {
    const response: ApiResponse<createBusinessTypeResponse> = await apiClient.post('/business-type', {
      name,
      description,
    });
    if (response.status !== 201 && response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to create business type',
      });
      throw new Error('Failed to create business type');
    }
    return response.data.data;
  } catch (error) {
    toast.error('Internal server error', {
      description: 'An unexpected error occurred while creating the business type.',
    });
    throw new Error('Internal server error');
  }
};

export const useCreateBusinessType = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, data, isPending, isError, isSuccess } = useMutation({
    mutationFn: createBusinessType,
    onSuccess: () => {
      toast.success('Business type created successfully');
      queryClient.invalidateQueries({
        queryKey: ['businessTypesQuery'],
        refetchType: 'active',
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to create business type', {
        description: error.message || 'An error occurred while creating the business type.',
      });
    },
  });

  return {
    createBusinessType: mutateAsync,
    data,
    isPending,
    isError,
    isSuccess,
  };
};

const updateBusinessType = async ({
  id,
  data,
}: {
  id: string;
  data: z.infer<typeof createBusinessTypeSchema>;
}): Promise<BusinessType> => {
  try {
    const response: ApiResponse<createBusinessTypeResponse> = await apiClient.put(`/business-type/${id}`, data);
    if (response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to update business type',
      });
      throw new Error('Failed to update business type');
    }
    return response.data.data;
  } catch (error) {
    toast.error('Internal server error', {
      description: 'An unexpected error occurred while updating the business type.',
    });
    throw new Error('Internal server error');
  }
};

export const useUpdateBusinessType = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, data, isPending, isError, isSuccess } = useMutation({
    mutationFn: updateBusinessType,
    onSuccess: () => {
      toast.success('Business type updated successfully');
      queryClient.invalidateQueries({
        queryKey: ['businessTypesQuery'],
        refetchType: 'active',
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to update business type', {
        description: error.message || 'An error occurred while updating the business type.',
      });
    },
  });

  return {
    updateBusinessType: mutateAsync,
    data,
    isPending,
    isError,
    isSuccess,
  };
};

const deleteBusinessType = async (id: string): Promise<void> => {
  try {
    const response: ApiResponse<void> = await apiClient.delete(`/business-type/${id}`);
    if (response.status !== 200 && response.status !== 204) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to delete business type',
      });
      throw new Error('Failed to delete business type');
    }
  } catch (error) {
    toast.error('Internal server error', {
      description: 'An unexpected error occurred while deleting the business type.',
    });
    throw new Error('Internal server error');
  }
};

export const useDeleteBusinessType = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, data, isPending, isError, isSuccess } = useMutation({
    mutationFn: deleteBusinessType,
    onSuccess: () => {
      toast.success('Business type deleted successfully');
      queryClient.invalidateQueries({
        queryKey: ['businessTypesQuery'],
        refetchType: 'active',
      });
    },
    onError: (error: Error) => {
      toast.error('Failed to delete business type', {
        description: error.message || 'An error occurred while deleting the business type.',
      });
    },
  });

  return {
    deleteBusinessType: mutateAsync,
    data,
    isPending,
    isError,
    isSuccess,
  };
};
