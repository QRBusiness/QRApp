import apiClient, { type ApiResponse, type ErrorResponse } from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { createAreaSchema } from '@/utils/schemas';

export interface AreaResponse {
  _id: string;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  branch: {
    _id: string;
    name: string;
    address: string;
    contact: string;
    created_at: string;
    updated_at: string;
  };
}

interface AreaResponseData {
  data: AreaResponse[];
}

interface AreaInputProps {
  page: number;
  limit: number;
}

export const getAreas = async ({ page = 1, limit = 50 }: AreaInputProps): Promise<AreaResponse[]> => {
  try {
    const response: ApiResponse<AreaResponseData> = await apiClient.get(`/areas`, {
      params: { page, limit },
    });
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to fetch areas',
      });
      return [];
    }
    return response.data ? response.data.data : [];
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while fetching areas.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useAreas = ({ page = 1, limit = 50 }: AreaInputProps) => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<AreaResponse[]>({
    queryKey: ['areasQuery', { page, limit }],
    queryFn: () => getAreas({ page, limit }),
  });

  return {
    areas: data || [],
    isLoading,
    isFetching,
    isSuccess,
    refetch,
    error,
  };
};

const createArea = async (areaData: z.infer<typeof createAreaSchema>) => {
  try {
    const response: ApiResponse<AreaResponse> = await apiClient.post('/areas', areaData);
    if (response.status !== 201 && response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to create area',
      });
      return null;
    }
    return response.data;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while creating the area.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useCreateArea = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isError, isPending, isSuccess, data } = useMutation({
    mutationFn: createArea,
    onSuccess: (data) => {
      if (data) {
        toast.success('Area created successfully');
        queryClient.invalidateQueries({ queryKey: ['areasQuery'] });
      }
    },
  });
  return {
    createArea: mutateAsync,
    isError,
    isPending,
    isSuccess,
    data,
  };
};
