import apiClient, { type ApiResponse, type ErrorResponse } from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type z from 'zod';
import type { ownerExtendExpireDateSchema } from '@/utils/schemas';

export interface ItemRequestProps {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  variant?: string;
  options?: string[];
  note?: string;
}

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
  data: ItemRequestProps[];
}

export interface CreateRequestProps {
  data: RequestResponseProps[];
}

export interface RequestServiceProps {
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}

const getRequests = async ({
  status,
  type,
  page = 0,
  limit = 10,
}: RequestServiceProps): Promise<RequestResponseProps[]> => {
  try {
    const params: Record<string, any> = {};
    if (status) params.status = status;
    if (type) params.type = type;
    if (page) params.page = page;
    if (limit) params.limit = limit;
    const response: ApiResponse<CreateRequestProps> = await apiClient.get('/request', {
      params,
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

export const useRequests = ({ status, type, page, limit }: RequestServiceProps) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['requests', status, type, page, limit],
    queryFn: () => getRequests({ status, type, page, limit }),
    refetchInterval: 5000, // Refetch every 5 seconds
    refetchOnWindowFocus: true, // Refetch when the window is focused
    refetchOnReconnect: true, // Refetch when the network reconnects
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
      // Invalidate tất cả queries liên quan đến requests
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      // Invalidate tất cả queries liên quan đến orders
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      // Hoặc invalidate cả hai cùng lúc
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === 'requests' || query.queryKey[0] === 'orders',
      });
      toast.success('Request processed successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to process request');
    },
  });
  return { processRequest: mutateAsync };
};

const createExtendedRequest = async (
  data: z.infer<typeof ownerExtendExpireDateSchema>
): Promise<RequestResponseProps[]> => {
  try {
    const response: ApiResponse<CreateRequestProps> = await apiClient.post('/request/extend', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status !== 201 && response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to create request',
      });
      throw new Error(response.errorMessage || 'Failed to create request');
    }
    return response.data ? response.data.data : [];
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while creating the request.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useCreateExtendedRequest = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: createExtendedRequest,
    onSuccess: () => {
      // Invalidate all queries related to requests
      queryClient.invalidateQueries({ queryKey: ['requests-extend'] });
      toast.success('Extend expiration request created successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create request');
    },
  });
  return { createExtendedRequest: mutateAsync };
};

export interface ExtendedRequestProps {
  _id: string;
  name: string;
  business: {
    id: string;
  };
  plan: {
    id: string;
  };
  image: string;
  payment_method: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const getExtendedRequests = async (): Promise<ExtendedRequestProps[]> => {
  try {
    const response: ApiResponse<{ data: ExtendedRequestProps[] }> = await apiClient.get('/request/extend');
    if (response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to fetch extended requests',
      });
      throw new Error(response.errorMessage || 'Failed to fetch extended requests');
    }
    return response.data ? response.data.data : [];
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while fetching extended requests.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useExtendedRequests = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['requests-extend'],
    queryFn: getExtendedRequests,
    refetchInterval: 5000, // Refetch every 5 seconds
    refetchOnWindowFocus: true, // Refetch when the window is focused
    refetchOnReconnect: true, // Refetch when the network reconnects
  });

  return {
    extendedRequests: data || [],
    isLoading,
    isError,
    error,
  };
};

const processExtendedRequest = async (requestId: string): Promise<ExtendedRequestProps> => {
  try {
    const response: ApiResponse<ExtendedRequestProps> = await apiClient.put(`/request/extend/${requestId}`);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to process extended request',
      });
      throw new Error(response.errorMessage || 'Failed to process extended request');
    }
    return response.data;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while processing the extended request.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useProcessExtendedRequest = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: processExtendedRequest,
    onSuccess: () => {
      // Invalidate all queries related to extended requests
      queryClient.invalidateQueries({ queryKey: ['requests-extend'] });
      toast.success('Extended request processed successfully');
    },
  });
  return { processExtendedRequest: mutateAsync };
};
