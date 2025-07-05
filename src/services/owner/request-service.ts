import apiClient, { type ApiResponse, type ErrorResponse } from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface RequestResponseProps {
  _id: string;
  created_at: string;
  updated_at: string;
  type: string;
  reason: string;
  status: string;
  area: {
    _id: string;
    name: string;
  };
  service_unit: {
    _id: string;
    name: string;
  };
  guest_name: string;
}

export interface CreateRequestProps {
  data: RequestResponseProps[];
}

const getRequests = async (status?: string): Promise<RequestResponseProps[]> => {
  try {
    const response: ApiResponse<CreateRequestProps> = await apiClient.get('/request', {
      params: { status },
    });
    if (response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to fetch requests',
      });
      throw new Error(response.errorMessage || 'Failed to fetch requests');
    }
    return response.data ? response.data.data : [];
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while fetching requests.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useRequests = ({ status }: { status?: string }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['requests', status],
    queryFn: () => getRequests(status),
  });

  return {
    requests: data || [],
    isLoading,
    isError,
    error,
  };
};

const processRequest = async (requestId: string): Promise<RequestResponseProps> => {
  try {
    const response: ApiResponse<RequestResponseProps> = await apiClient.post(`/request/process/${requestId}`);
    if (response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || `Failed to process request`,
      });
      throw new Error(response.errorMessage || `Failed to process request`);
    }
    return response.data;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while processing the request.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useProcessRequest = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: processRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests', 'orders'] });
      toast.success('Request processed successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to process request');
    },
  });
  return { processRequest: mutateAsync };
};
