import apiClient, { type ApiResponse, type ErrorResponse } from '@/services';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { ProductProps } from './product-services';

// OrderResponseProps interface based on provided JSON structure
export interface ItemOrderProps {
  name: string;
  img_url: string;
  quantity: number;
  price: number;
  variant: string;
  options: string[];
  note: string;
  product: ProductProps;
}

export interface OrderResponseProps {
  table: any;
  _id: string;
  created_at: string;
  updated_at: string;
  items: Array<ItemOrderProps>;
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
  token,
  method = 'Cash',
}: {
  token: string;
  method?: string;
}): Promise<OrderResponseProps> => {
  try {
    const params = new URLSearchParams();
    params.append('method', method);
    if (!token) {
      throw new Error('Token is required to checkout order');
    }
    params.append('token', token);
    const response: ApiResponse<{ data: OrderResponseProps }> = await apiClient.post(
      `/orders/checkout?${params.toString()}`
    );
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
    onSuccess: () => {
      toast.success('Order checked out successfully');
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

export const mergeOrders = async (orderIds: string[]): Promise<string> => {
  try {
    const response: ApiResponse<{ data: string }> = await apiClient.post('/orders/qrcode', [...orderIds]);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error || 'Error merging orders', {
        description: response.errorMessage || 'An error occurred while merging the orders.',
      });
      throw new Error(response.errorMessage || 'Error merging orders');
    }
    return response.data.data;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Error merging orders', {
      description: error.errorMessage || 'An error occurred while merging the orders.',
    });
    throw new Error(error.errorMessage || 'Error merging orders');
  }
};

export const useMergeOrders = () => {
  const { mutate, isError, error, data } = useMutation({
    mutationKey: ['mergeOrders'],
    mutationFn: mergeOrders,
    onSuccess: () => {
      toast.success('Orders merged successfully');
    },
  });

  return {
    token: data,
    mergeOrders: mutate,
    isError,
    error,
  };
};

interface OrderByTokenResponse {
  data: {
    qr_code: string;
    orders: {
      _id: string;
      created_at: string;
      updated_at: string;
      items: Array<ItemOrderProps>;
    }[];
  };
}

const getOrderByToken = async (token: string): Promise<OrderByTokenResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('template', 'compact');
    if (!token) {
      throw new Error('Token is required to fetch order by token');
    }
    params.append('token', token);
    const response: ApiResponse<OrderByTokenResponse> = await apiClient.get(`/orders/checkout?${params.toString()}`);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error || 'Error fetching order by token', {
        description: response.errorMessage || 'An error occurred while fetching the order by token.',
      });
      throw new Error(response.errorMessage || 'Error fetching order by token');
    }
    return response.data;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Error fetching order by token', {
      description: error.errorMessage || 'An error occurred while fetching the order by token.',
    });
    throw new Error(error.errorMessage || 'Error fetching order by token');
  }
};

export const useOrderByToken = (token: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['orderByToken', token],
    queryFn: () => getOrderByToken(token),
    enabled: !!token, // Only run the query if token is provided
  });

  return {
    items: data?.data?.orders,
    qr_code: data?.data?.qr_code,
    isLoading,
    isError,
    error,
  };
};
