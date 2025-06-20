import apiClient, { type ApiResponse } from '@/services';
import { useMutation, useQuery } from '@tanstack/react-query';
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
    toast.success('Business type created successfully');
    return response.data.data;
  } catch (error) {
    toast.error('Internal server error', {
      description: 'An unexpected error occurred while creating the business type.',
    });
    throw new Error('Internal server error');
  }
};

export const useCreateBusinessType = () => {
  const { mutateAsync, data, isPending, isError, isSuccess } = useMutation({
    mutationFn: createBusinessType,
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
