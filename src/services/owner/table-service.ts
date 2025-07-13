import apiClient, { type ApiResponse, type ErrorResponse } from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { createTableSchema, updateTableSchema } from '@/utils/schemas';
import type { AreaResponse } from './area-service';

interface TableResponse {
  available: boolean;
  status: any;
  branch: any;
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
  branch?: string;
}

export const getTables = async ({ page = 1, limit = 50, area, branch }: TableInputProps): Promise<TableResponse[]> => {
  try {
    const params: Record<string, string | number | undefined> = {
      page,
      limit,
    };
    if (area) params.area = area;
    if (branch) params.branch = branch;
    const response: ApiResponse<TableResponseData> = await apiClient.get('/services', {
      params: params,
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

export const useTables = ({ page = 1, limit = 50, area, branch }: TableInputProps) => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<TableResponse[]>({
    queryKey: ['tablesQuery', { page, limit, area, branch }],
    queryFn: () => getTables({ page, limit, area, branch }),
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

interface createTableResponse {
  data: TableResponse;
}

const createTable = async (tableData: z.infer<typeof createTableSchema>) => {
  try {
    const response: ApiResponse<createTableResponse> = await apiClient.post('/services', tableData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to create table',
      });
      return null;
    }
    toast.success('Table created successfully');
    return response.data.data;
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

const updateTable = async (tableId: string, tableData: z.infer<typeof updateTableSchema>) => {
  try {
    const formData = new FormData();
    formData.append('name', tableData.name);

    const response: ApiResponse<TableResponse> = await apiClient.put(`/services/${tableId}`, formData);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to update table',
      });
      return null;
    }
    toast.success('Table updated successfully');
    return response.data;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while updating the table.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useUpdateTable = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isError, isPending, isSuccess, data } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: z.infer<typeof updateTableSchema> }) => updateTable(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tablesQuery'] });
    },
  });
  return {
    updateTable: mutateAsync,
    isError,
    isPending,
    isSuccess,
    data,
  };
};

const getUpdateQRCode = async ({ id, qr_code }: { id: string; qr_code: File }): Promise<TableResponse> => {
  try {
    const formData = new FormData();
    if (qr_code) formData.append('qr_code', qr_code);

    const response: ApiResponse<{ data: TableResponse }> = await apiClient.post(`/services/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to update QR code',
      });
      return response.data.data;
    }
    toast.success('QR code updated successfully');
    return response.data.data;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while updating the QR code.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useUpdateQRCode = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isError, isPending, isSuccess, data } = useMutation({
    mutationFn: getUpdateQRCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tablesQuery'] });
    },
  });
  return {
    updateQRCode: mutateAsync,
    isError,
    isPending,
    isSuccess,
    data,
  };
};

const deleteTable = async (tableId: string) => {
  try {
    const response: ApiResponse<{ message: string }> = await apiClient.delete(`/services/${tableId}`);
    if (response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to delete table',
      });
      return null;
    }
    toast.success('Table deleted successfully');
    return response.data;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while deleting the table.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useDeleteTable = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isError, isPending, isSuccess, data } = useMutation({
    mutationFn: deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tablesQuery'] });
    },
  });
  return {
    deleteTable: mutateAsync,
    isError,
    isPending,
    isSuccess,
    data,
  };
};
