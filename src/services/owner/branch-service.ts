import apiClient, { type ApiResponse, type ErrorResponse } from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { createBranchSchema } from '@/utils/schemas';

interface BranchResponse {
  _id: string;
  name: string;
  address: string;
  contact: string;
  created_at: string;
  updated_at: string;
}

interface BranchResponseData {
  data: BranchResponse[];
}

interface BranchInputProps {
  page: number;
  limit: number;
}

const getBranches = async ({ page = 1, limit = 50 }: BranchInputProps): Promise<BranchResponse[]> => {
  try {
    const response: ApiResponse<BranchResponseData> = await apiClient.get(`/branches`, {
      params: { page, limit },
    });
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to fetch branches',
      });
      return [];
    }
    return response.data ? response.data.data : [];
  } catch (error: ErrorResponse | any) {
    toast.error((error as ErrorResponse).error || 'Internal server error', {
      description: (error as ErrorResponse).errorMessage || 'An unexpected error occurred while fetching branches.',
    });
    throw new Error((error as ErrorResponse).errorMessage || 'Internal server error');
  }
};

export const useBranches = ({ page = 1, limit = 50 }: BranchInputProps) => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<BranchResponse[]>({
    queryKey: ['branches', page, limit], // ✅ Include page, limit
    queryFn: () => getBranches({ page, limit }),
  });

  return {
    branches: data || [],
    isLoading,
    isFetching,
    isSuccess,
    error,
    refetch,
  };
};

interface CreateBranchProps {
  data: BranchResponse;
}

const createBranch = async (branchData: z.infer<typeof createBranchSchema>) => {
  try {
    const response: ApiResponse<CreateBranchProps> = await apiClient.post('/branches', branchData);
    if (response.status !== 201 && response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to create branch',
      });
      throw new Error(response.errorMessage || 'Failed to create branch');
    }
    return response.data.data;
  } catch (error: ErrorResponse | any) {
    toast.error((error as ErrorResponse).error || 'Internal server error', {
      description: (error as ErrorResponse).errorMessage || 'An unexpected error occurred while creating the branch.',
    });
    throw new Error((error as ErrorResponse).errorMessage || 'Internal server error');
  }
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, data, isPending, isError, isSuccess } = useMutation({
    mutationFn: createBranch,
    onSuccess: (data) => {
      toast.success('Branch created successfully', {
        description: `Branch ${data.name} has been created.`,
      });
      queryClient.invalidateQueries({ queryKey: ['branches'] }); // ✅ Invalidate tất cả branches queries
    },
  });

  return { createBranch: mutateAsync, data, isPending, isError, isSuccess };
};

const updateBranch = async (id: string, branchData: z.infer<typeof createBranchSchema>) => {
  try {
    const response: ApiResponse<BranchResponse> = await apiClient.put(`/branches/${id}`, branchData);
    if (response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to update branch',
      });
      throw new Error(response.errorMessage || 'Failed to update branch');
    }
    return response.data;
  } catch (error: ErrorResponse | any) {
    toast.error((error as ErrorResponse).error || 'Internal server error', {
      description: (error as ErrorResponse).errorMessage || 'An unexpected error occurred while updating the branch.',
    });
    throw new Error((error as ErrorResponse).errorMessage || 'Internal server error');
  }
};

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, data, isPending, isError, isSuccess } = useMutation({
    mutationFn: ({ id, branchData }: { id: string; branchData: z.infer<typeof createBranchSchema> }) =>
      updateBranch(id, branchData),
    onSuccess: (data) => {
      toast.success('Branch updated successfully', {
        description: `Branch ${data.name} has been updated.`,
      });
      queryClient.invalidateQueries({ queryKey: ['branches'] }); // ✅ Invalidate tất cả branches queries
    },
  });

  return { updateBranch: mutateAsync, data, isPending, isError, isSuccess };
};

const deleteBranch = async (id: string): Promise<void> => {
  try {
    const response: ApiResponse<null> = await apiClient.delete(`/branches/${id}`);
    if (response.status !== 204 && response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to delete branch',
      });
      throw new Error(response.errorMessage || 'Failed to delete branch');
    }
  } catch (error: ErrorResponse | any) {
    toast.error((error as ErrorResponse).error || 'Internal server error', {
      description: (error as ErrorResponse).errorMessage || 'An unexpected error occurred while deleting the branch.',
    });
    throw new Error((error as ErrorResponse).errorMessage || 'Internal server error');
  }
};

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, data, isPending, isError, isSuccess } = useMutation({
    mutationFn: deleteBranch,
    onSuccess: () => {
      toast.success('Branch deleted successfully', {
        description: 'The branch has been deleted.',
      });
      queryClient.invalidateQueries({ queryKey: ['branches'] }); // ✅ Invalidate tất cả branches queries
    },
  });

  return { deleteBranch: mutateAsync, data, isPending, isError, isSuccess };
};
