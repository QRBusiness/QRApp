import apiClient, { type ApiResponse, type ErrorResponse } from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { createTableSchema } from '@/utils/schemas';
import type { AreaResponse } from './area-service';

interface TableResponse {
  _id: string;
  name: string;
  description: string;
  qr_code: string;
  area: AreaResponse;
  created_at: string;
  updated_at: string;
}

interface TableResponseData {
  data: TableResponse[];
}

interface TableInputProps {
  page: number;
  limit: number;
  area?: string;
  enable?: boolean;
}

export const getTables = async ({ page = 1, limit = 50, area }: TableInputProps): Promise<TableResponse[]> => {
  try {
    const response: ApiResponse<TableResponseData> = await apiClient.get('/services', {
      params: { page, limit, area },
    });
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to fetch tables',
      });
      return [];
    }
    return response.data ? response.data.data : [];
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while fetching tables.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useTables = ({ page = 1, limit = 50, area }: TableInputProps) => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<TableResponse[]>({
    queryKey: ['tablesQuery', { page, limit, area }],
    queryFn: () => getTables({ page, limit, area }),
  });

  if (error) {
    toast.error('Failed to load tables', {
      description: error.message || 'An error occurred while fetching tables.',
    });
  }

  return {
    tables: data || [],
    isLoading,
    isFetching,
    isSuccess,
    refetch,
  };
};

const createTable = async (tableData: z.infer<typeof createTableSchema>) => {
  try {
    const response: ApiResponse<TableResponse> = await apiClient.post('/services', tableData);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to create table',
      });
      return null;
    }
    toast.success('Table created successfully');
    return response.data;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while creating the table.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useCreateTable = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isError, isPending, isSuccess, data } = useMutation({
    mutationFn: createTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tablesQuery'] });
    },
  });
  return {
    createTable: mutateAsync,
    isError,
    isPending,
    isSuccess,
    data,
  };
};
