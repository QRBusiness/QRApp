import apiClient, { type ApiResponse, type ErrorResponse } from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import type { createPlanSchema } from '@/utils/schemas';

export interface PlanProps {
  _id: string;
  name: string;
  price: number;
  period: number; // in days
  created_at: string;
  updated_at: string;
}

const getPlan = async (): Promise<PlanProps[]> => {
  try {
    const response: ApiResponse<{ data: PlanProps[] }> = await apiClient.get(`/plans`);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to fetch plan details',
      });
      return [];
    }
    return response.data ? response.data.data : [];
  } catch (error: ErrorResponse | any) {
    toast.error((error as ErrorResponse).error, {
      description: (error as ErrorResponse).errorMessage || 'An unexpected error occurred while fetching plan details.',
    });
    throw new Error((error as ErrorResponse).errorMessage || 'Internal server error');
  }
};

export const usePlans = () => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<PlanProps[]>({
    queryKey: ['planQuery'],
    queryFn: getPlan,
  });

  return {
    plans: data || [],
    error,
    isLoading,
    isFetching,
    isSuccess,
    refetch,
  };
};

const createPlan = async (data: z.infer<typeof createPlanSchema>): Promise<PlanProps | null> => {
  try {
    const response: ApiResponse<{ data: PlanProps }> = await apiClient.post('/plans', data);
    if (response.status !== 201 && response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to create plan',
      });
      return null;
    }
    return response.data ? response.data.data : null;
  } catch (error: ErrorResponse | any) {
    toast.error((error as ErrorResponse).error, {
      description: (error as ErrorResponse).errorMessage || 'An unexpected error occurred while creating plan.',
    });
    throw new Error((error as ErrorResponse).errorMessage || 'Internal server error');
  }
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: createPlan,
    onSuccess: (data) => {
      if (data) {
        toast.success('Plan created successfully');
        queryClient.invalidateQueries({ queryKey: ['planQuery'] });
      }
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.errorMessage || 'Failed to create plan');
    },
  });
  return {
    createPlan: mutateAsync,
  };
};

const updatePlan = async ({
  id,
  data,
}: {
  id: string;
  data: z.infer<typeof createPlanSchema>;
}): Promise<PlanProps | null> => {
  try {
    const response: ApiResponse<{ data: PlanProps }> = await apiClient.put(`/plans/${id}`, data);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to update plan',
      });
      return null;
    }
    return response.data ? response.data.data : null;
  } catch (error: ErrorResponse | any) {
    toast.error((error as ErrorResponse).error, {
      description: (error as ErrorResponse).errorMessage || 'An unexpected error occurred while updating plan.',
    });
    throw new Error((error as ErrorResponse).errorMessage || 'Internal server error');
  }
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: updatePlan,
    onSuccess: (data) => {
      if (data) {
        toast.success('Plan updated successfully');
        queryClient.invalidateQueries({ queryKey: ['planQuery'] });
      }
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.errorMessage || 'Failed to update plan');
    },
  });
  return {
    updatePlan: mutateAsync,
  };
};

const deletePlan = async (id: string): Promise<void> => {
  try {
    const response: ApiResponse<null> = await apiClient.delete(`/plans/${id}`);
    if (response.status !== 200 && response.status !== 204) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to delete plan',
      });
      return;
    }
    toast.success('Plan deleted successfully');
  } catch (error: ErrorResponse | any) {
    toast.error((error as ErrorResponse).error, {
      description: (error as ErrorResponse).errorMessage || 'An unexpected error occurred while deleting plan.',
    });
    throw new Error((error as ErrorResponse).errorMessage || 'Internal server error');
  }
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      toast.success('Plan deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['planQuery'] });
    },
    onError: (error: ErrorResponse) => {
      toast.error(error.errorMessage || 'Failed to delete plan');
    },
  });
  return {
    deletePlan: mutateAsync,
  };
};
