import apiClient, { type ApiResponse } from '@/services';
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
  const response: ApiResponse<TableResponse> = await apiClient.post('/services', tableData);
  if (response.status !== 200 && response.status !== 201) {
    toast.error(response.error, {
      description: response.errorMessage || 'Failed to create table',
    });
    return null;
  }
  toast.success('Table created successfully');
  return response.data;
};

export const useCreateTable = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isError, isPending, isSuccess, data } = useMutation({
    mutationFn: createTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tablesQuery'] });
    },
    onError: (error) => {
      toast.error('Failed to create table', {
        description: error.message || 'An error occurred while creating the table.',
      });
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
