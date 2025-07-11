import apiClient, { type ApiResponse, type ErrorResponse } from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import type { createProductSchema } from '@/utils/schemas';

export interface VariantProps {
  type: string;
  price: number;
}
export interface OptionsProps {
  type: string;
  price: number;
}

export interface Categories {
  _id: string;
  name: string;
  description: string;
}

export interface Subcategories {
  _id: string;
  name: string;
  description: string;
}

export interface ProductProps {
  _id: string;
  name: string;
  description: string;
  image_url?: string;
  category: Categories;
  subcategory: Subcategories;
  variants: VariantProps[];
  options: OptionsProps[];
  created_at: string;
  updated_at: string;
}
export interface ProductGetResponse {
  data: ProductProps[];
}

export interface ProductCreateRequest {
  category?: string;
  sub_category?: string;
}

const getProducts = async ({ category, sub_category }: ProductCreateRequest): Promise<ProductProps[]> => {
  try {
    const params: Record<string, string> = {};
    if (category) {
      params.category = category;
    }
    if (sub_category) {
      params.sub_category = sub_category;
    }
    const response: ApiResponse<ProductGetResponse> = await apiClient.get('/products', { params });
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error || 'Error fetching products', {
        description: response.errorMessage || 'An error occurred while fetching products.',
      });
      throw new Error(response.errorMessage || 'Error fetching products');
    }
    return response.data ? response.data.data : [];
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Error fetching products', {
      description: error.errorMessage || 'An error occurred while fetching products.',
    });
    throw new Error(error.errorMessage || 'Error fetching products');
  }
};

const getPublicProducts = async ({
  business,
  category,
  sub_category,
}: {
  business: string;
  category?: string;
  sub_category?: string;
}): Promise<ProductProps[]> => {
  try {
    const params: Record<string, string> = {};
    if (category) {
      params.category = category;
    }
    if (sub_category) {
      params.sub_category = sub_category;
    }
    const response: ApiResponse<ProductGetResponse> = await apiClient.get(`/products/${business}`, {
      params,
    });
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error || 'Error fetching public products', {
        description: response.errorMessage || 'An error occurred while fetching public products.',
      });
      throw new Error(response.errorMessage || 'Error fetching public products');
    }
    return response.data ? response.data.data : [];
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Error fetching public products', {
      description: error.errorMessage || 'An error occurred while fetching public products.',
    });
    throw new Error(error.errorMessage || 'Error fetching public products');
  }
};

export const useProducts = ({ category, sub_category }: ProductCreateRequest) => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<ProductProps[]>({
    queryKey: ['productsQuery', { category, sub_category }],
    queryFn: () => getProducts({ category, sub_category }),
  });

  return {
    products: data || [],
    error,
    isLoading,
    isFetching,
    isSuccess,
    refetch,
  };
};

export const usePublicProducts = ({
  business,
  category,
  sub_category,
}: {
  business: string;
  category?: string;
  sub_category?: string;
}) => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<ProductProps[]>({
    queryKey: ['publicProductsQuery', { business, category, sub_category }],
    queryFn: () => getPublicProducts({ business, category, sub_category }),
  });

  return {
    products: data || [],
    error,
    isLoading,
    isFetching,
    isSuccess,
    refetch,
  };
};

const createProduct = async (data: z.infer<typeof createProductSchema>) => {
  try {
    const response: ApiResponse<{ data: ProductProps }> = await apiClient.post('/products', data);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error || 'Error creating product', {
        description: response.errorMessage || 'An error occurred while creating the product.',
      });
      throw new Error(response.errorMessage || 'Error creating product');
    }
    return response.data ? response.data.data : null;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Error creating product', {
      description: error.errorMessage || 'An error occurred while creating the product.',
    });
    throw new Error(error.errorMessage || 'Error creating product');
  }
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isSuccess, data } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productsQuery'] });
      toast.success('Product created successfully');
    },
  });

  return {
    createProduct: mutateAsync,
    isPending,
    error,
    isSuccess,
    data,
  };
};

const updateProduct = async ({
  id,
  data,
}: {
  id: string;
  data: z.infer<typeof createProductSchema>;
}): Promise<ProductProps | null> => {
  try {
    const response: ApiResponse<{ data: ProductProps }> = await apiClient.put(`/products/${id}`, data);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error || 'Error updating product', {
        description: response.errorMessage || 'An error occurred while updating the product.',
      });
      throw new Error(response.errorMessage || 'Error updating product');
    }
    return response.data ? response.data.data : null;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Error updating product', {
      description: error.errorMessage || 'An error occurred while updating the product.',
    });
    throw new Error(error.errorMessage || 'Error updating product');
  }
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isSuccess, data } = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productsQuery'] });
      toast.success('Product updated successfully');
    },
  });

  return {
    updateProduct: mutateAsync,
    isPending,
    error,
    isSuccess,
    data,
  };
};

const deleteProduct = async (id: string): Promise<void> => {
  try {
    const response: ApiResponse<{ data: ProductProps }> = await apiClient.delete(`/products/${id}`);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error || 'Error deleting product', {
        description: response.errorMessage || 'An error occurred while deleting the product.',
      });
      throw new Error(response.errorMessage || 'Error deleting product');
    }
    return;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Error deleting product', {
      description: error.errorMessage || 'An error occurred while deleting the product.',
    });
    throw new Error(error.errorMessage || 'Error deleting product');
  }
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending, error, isSuccess, data } = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productsQuery'] });
      toast.success('Product deleted successfully');
    },
  });

  return {
    deleteProduct: mutateAsync,
    isPending,
    error,
    isSuccess,
    data,
  };
};
