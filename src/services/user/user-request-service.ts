import apiClient, { type ApiResponse, type ErrorResponse } from '@/services';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export interface CartItem {
  _id: string;
  name: string;
  quantity: number;
  img_url: string; // Optional, can be used for product images
  variant: string;
  options: string[];
  note: string;
  price: number;
}

export interface RequestInfo {
  type: string;
  reason: string;
  service_unit: string;
  guest_name: string; // Optional, can be used for user requests
  area: string;
  data: CartItem[];
}

interface CreateOrderRequestResponse {
  data: string;
}

const createOrderRequest = async (requestInfo: RequestInfo) => {
  try {
    const response: ApiResponse<CreateOrderRequestResponse> = await apiClient.post('/request', requestInfo);
    if (response.status !== 201 && response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to create order request',
      });
      throw new Error(response.errorMessage || 'Failed to create order request');
    }
    return response.data;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while creating order request.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useCreateOrderRequest = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: createOrderRequest,
    onSuccess: (data) => {
      toast.success('Order request created successfully');
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      return data;
    },
  });
  return {
    createOrderRequest: mutateAsync,
  };
};
