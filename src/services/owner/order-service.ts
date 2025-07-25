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
    img_url: string;
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
    _id: string;
    guest_name: string;
    type: string;
    reason: string;
    status: string;
  };
}

export interface OrderGetResponse {
  data: OrderResponseProps[];
}

export interface OrderRequestProps {
  branch?: string;
  area?: string;
  table?: string;
  status?: string;
}
const getOrders = async (params: OrderRequestProps): Promise<OrderResponseProps[]> => {
  try {
    const queryParams: Record<string, string> = {};
    if (params.branch) {
      queryParams.branch = params.branch;
    }
    if (params.area) {
      queryParams.area = params.area;
    }
    if (params.table) {
      queryParams.service_unit = params.table;
    }
    if (params.status) {
      queryParams.status = params.status;
    }

    const response: ApiResponse<OrderGetResponse> = await apiClient.get('/orders', {
      params: queryParams,
    });
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

export const useOrders = ({ branch, area, table, status }: OrderRequestProps) => {
  const { data, isLoading, isError, error, isFetching, refetch } = useQuery({
    queryKey: ['orders', { branch, area, table, status }],
    queryFn: () => getOrders({ branch, area, table, status }),
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnWindowFocus: true, // Refetch when the window is focused
    refetchOnReconnect: true, // Refetch when the network reconnects
  });

  return {
    orders: data || [],
    isLoading: isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

const checkoutOrder = async ({
  orderId,
  method = 'Cash',
}: {
  orderId: string;
  method?: string;
}): Promise<OrderResponseProps> => {
  try {
    const response: ApiResponse<{ data: OrderResponseProps }> = await apiClient.post(`/orders/checkout/${orderId}`, {
      method,
    });
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error || 'Error checking out order', {
        description: response.errorMessage || 'An error occurred while checking out the order.',
      });
      throw new Error(response.errorMessage || 'Error checking out order');
    }
    return response.data.data;
  } catch (error: ErrorResponse | any) {
    console.error('Error checking out order:', error);
    toast.error(error.error || 'Error checking out order', {
      description: error.errorMessage || 'An error occurred while checking out the order.',
    });
    throw new Error(error.errorMessage || 'Error checking out order');
  }
};

export const useCheckoutOrder = () => {
  const { mutate, isError, error } = useMutation({
    mutationKey: ['checkoutOrder'],
    mutationFn: checkoutOrder,
    onSuccess: (data) => {
      toast.success('Order checked out successfully', {
        description: `Order ID: ${data._id}`,
      });
    },
  });

  return {
    checkoutOrder: mutate,
    isError,
    error,
  };
};

export interface QRPaymentProps {
  code: string;
  data: {
    qrDataURL: string;
  };
}
const getQRPayment = async (orderId: string): Promise<QRPaymentProps> => {
  try {
    const response: ApiResponse<{ data: QRPaymentProps }> = await apiClient.get(
      `/orders/${orderId}/qrcode?template=compact`
    );
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error || 'Error fetching QR payment', {
        description: response.errorMessage || 'An error occurred while fetching the QR payment.',
      });
      throw new Error(response.errorMessage || 'Error fetching QR payment');
    }
    return response.data.data;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Error fetching QR payment', {
      description: error.errorMessage || 'An error occurred while fetching the QR payment.',
    });
    throw new Error(error.errorMessage || 'Error fetching QR payment');
  }
};

export const useQRPayment = (orderId: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['qrPayment', orderId],
    queryFn: () => getQRPayment(orderId),
  });

  return {
    qrPayment: data,
    isLoading,
    isError,
    error,
  };
};

const getOrderById = async (orderId: string): Promise<OrderResponseProps> => {
  try {
    const response: ApiResponse<{ data: OrderResponseProps }> = await apiClient.get(`/orders/${orderId}`);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error || 'Error fetching order details', {
        description: response.errorMessage || 'An error occurred while fetching the order details.',
      });
      throw new Error(response.errorMessage || 'Error fetching order details');
    }
    return response.data.data;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Error fetching order details', {
      description: error.errorMessage || 'An error occurred while fetching the order details.',
    });
    throw new Error(error.errorMessage || 'Error fetching order details');
  }
};

export const useOrderById = (orderId: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
  });

  return {
    orderDetails: data,
    isLoading,
    isError,
    error,
  };
};
