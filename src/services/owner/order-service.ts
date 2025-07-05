import apiClient, { type ApiResponse, type ErrorResponse } from '@/services';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ProductProps } from './product-services';

// OrderResponseProps interface based on provided JSON structure

export interface OrderResponseProps {
  table: any;
  _id: string;
  created_at: string;
  updated_at: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    variant: string;
    options: string[];
    note: string;
    product: ProductProps;
  }>;
  amount: number;
  status: string;
  business: {
    id: string;
    collection: string;
  };
  branch: {
    _id: string;
    name: string;
  };
  area: {
    _id: string;
    name: string;
  };
  service_unit: {
    _id: string;
    name: string;
  };
  staff: {
    id: string;
    collection: string;
  };
  request: {
    id: string;
    collection: string;
  };
}

export interface OrderGetResponse {
  data: OrderResponseProps[];
}

const getOrders = async (): Promise<OrderResponseProps[]> => {
  try {
    const response: ApiResponse<OrderGetResponse> = await apiClient.get('/orders');
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error || 'Error fetching orders', {
        description: response.errorMessage || 'An error occurred while fetching orders.',
      });
      throw new Error(response.errorMessage || 'Error fetching orders');
    }
    return response.data ? response.data.data : [];
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Error fetching orders', {
      description: error.errorMessage || 'An error occurred while fetching orders.',
    });
    throw new Error(error.errorMessage || 'Error fetching orders');
  }
};

export const useOrders = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['orders'],
    queryFn: getOrders,
  });

  return {
    orders: data || [],
    isLoading,
    isError,
    error,
  };
};

const checkoutOrder = async (orderId: string): Promise<string> => {
  try {
    const response: ApiResponse<{ data: string }> = await apiClient.post(`/orders/checkout/${orderId}`);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error || 'Error checking out order', {
        description: response.errorMessage || 'An error occurred while checking out the order.',
      });
      throw new Error(response.errorMessage || 'Error checking out order');
    }
    return response.data.data;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Error checking out order', {
      description: error.errorMessage || 'An error occurred while checking out the order.',
    });
    throw new Error(error.errorMessage || 'Error checking out order');
  }
};

export const useCheckoutOrder = () => {
  const { mutate, isError, error } = useMutation({
    mutationKey: ['checkoutOrder'],
    mutationFn: checkoutOrder,
  });

  return {
    checkoutOrder: mutate,
    isError,
    error,
  };
};
