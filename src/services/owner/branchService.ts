import apiClient, { type ApiResponse } from '@/services';
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
  const response: ApiResponse<BranchResponseData> = await apiClient.get(`/branches`, {
    params: { page, limit },
  });
  if (response.status !== 200) {
    toast.error(response.error, {
      description: response.errorMessage || 'Failed to fetch branches',
    });
    return [];
  }
  return response.data ? response.data.data : [];
};

export const useBranches = ({ page = 1, limit = 50 }: BranchInputProps) => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<BranchResponse[]>({
    queryKey: ['branchesQuery', { page, limit }],
    queryFn: () => getBranches({ page, limit }),
  });

  if (error) {
    toast.error('Failed to load branches', {
      description: error.message || 'An error occurred while fetching branches.',
    });
  }

  return {
    branches: data || [],
    isLoading,
    isFetching,
    isSuccess,
    refetch,
  };
};

const createBranch = async (branchData: z.infer<typeof createBranchSchema>) => {
  const response: ApiResponse<BranchResponse> = await apiClient.post('/branches', branchData);
  if (response.status !== 201 && response.status !== 200) {
    toast.error(response.error, {
      description: response.errorMessage || 'Failed to create branch',
    });
    throw new Error(response.errorMessage || 'Failed to create branch');
  }
  return response.data;
};

export const useCreateBranch = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, data, isPending, isError, isSuccess } = useMutation({
    mutationFn: createBranch,
    onSuccess: (data) => {
      toast.success('Branch created successfully', {
        description: `Branch ${data.name} has been created.`,
      });
      queryClient.invalidateQueries({ queryKey: ['branchesQuery'] });
    },
    onError: (error) => {
      toast.error('Failed to create branch', {
        description: error.message || 'An error occurred while creating the branch.',
      });
    },
  });

  return { createBranch: mutateAsync, data, isPending, isError, isSuccess };
};

const updateBranch = async (id: string, branchData: z.infer<typeof createBranchSchema>) => {
  const response: ApiResponse<BranchResponse> = await apiClient.put(`/branches/${id}`, branchData);
  if (response.status !== 200) {
    toast.error(response.error, {
      description: response.errorMessage || 'Failed to update branch',
    });
    throw new Error(response.errorMessage || 'Failed to update branch');
  }
  return response.data;
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
      queryClient.invalidateQueries({ queryKey: ['branchesQuery'] });
    },
    onError: (error) => {
      toast.error('Failed to update branch', {
        description: error.message || 'An error occurred while updating the branch.',
      });
    },
  });

  return { updateBranch: mutateAsync, data, isPending, isError, isSuccess };
};

const deleteBranch = async (id: string): Promise<void> => {
  const response: ApiResponse<null> = await apiClient.delete(`/branches/${id}`);
  if (response.status !== 204 && response.status !== 200) {
    toast.error(response.error, {
      description: response.errorMessage || 'Failed to delete branch',
    });
    throw new Error(response.errorMessage || 'Failed to delete branch');
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
      queryClient.invalidateQueries({ queryKey: ['branchesQuery'] });
    },
    onError: (error) => {
      toast.error('Failed to delete branch', {
        description: error.message || 'An error occurred while deleting the branch.',
      });
    },
  });

  return { deleteBranch: mutateAsync, data, isPending, isError, isSuccess };
};
