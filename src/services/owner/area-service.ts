import apiClient, { type ApiResponse, type ErrorResponse } from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { createAreaSchema } from '@/utils/schemas';

export interface AreaResponse {
  data: AreaResponse | null;
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
  branch?: string;
}

export const getAreas = async ({ page = 1, limit = 50, branch }: AreaInputProps): Promise<AreaResponse[]> => {
  try {
    const params: Record<string, string | number> = {
      page,
      limit,
    };
    if (branch) {
      params.branch = branch;
    }
    const response: ApiResponse<AreaResponseData> = await apiClient.get(`/areas`, {
      params,
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

export const useAreas = ({ page = 1, limit = 50, branch }: AreaInputProps) => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<AreaResponse[]>({
    queryKey: ['areasQuery', { page, limit, branch }],
    queryFn: () => getAreas({ page, limit, branch }),
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
    return response.data.data;
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

const updateArea = async ({ id, data }: { id: string; data: z.infer<typeof createAreaSchema> }) => {
  try {
    const response: ApiResponse<AreaResponse> = await apiClient.put(`/areas/${id}`, data);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to update area',
      });
      return null;
    }
    return response.data.data;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while updating the area.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useUpdateArea = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isError, isPending, isSuccess, data } = useMutation({
    mutationFn: updateArea,
    onSuccess: (data) => {
      if (data) {
        toast.success('Area updated successfully');
        queryClient.invalidateQueries({ queryKey: ['areasQuery'] });
      }
    },
  });
  return {
    updateArea: mutateAsync,
    isError,
    isPending,
    isSuccess,
    data,
  };
};

const deleteArea = async (id: string) => {
  try {
    const response: ApiResponse<AreaResponse> = await apiClient.delete(`/areas/${id}`);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to delete area',
      });
      return null;
    }
    return response.data.data;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while deleting the area.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useDeleteArea = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isError, isPending, isSuccess, data } = useMutation({
    mutationFn: deleteArea,
    onSuccess: (data) => {
      if (data) {
        toast.success('Area deleted successfully');
        queryClient.invalidateQueries({ queryKey: ['areasQuery'] });
      }
    },
  });
  return {
    deleteArea: mutateAsync,
    isError,
    isPending,
    isSuccess,
    data,
  };
};
