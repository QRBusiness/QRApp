import apiClient, { type ApiResponse, type ErrorResponse } from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import type { createCategoriesSchema, createSubCategoriesSchema } from '@/utils/schemas';

export interface SubCategoryProps {
  _id: string;

  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryProps {
  _id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  sub_category?: SubCategoryProps[];
}

interface CategoryResponseData {
  data: CategoryProps[];
}

const getCategories = async (): Promise<CategoryProps[]> => {
  try {
    const response: ApiResponse<CategoryResponseData> = await apiClient.get('/categories');
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to fetch categories',
      });
      return [];
    }
    return response.data ? response.data.data : [];
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while fetching categories.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useCategories = () => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<CategoryProps[]>({
    queryKey: ['categoriesQuery'],
    queryFn: getCategories,
  });

  return {
    categories: data || [],
    error,
    isLoading,
    isFetching,
    isSuccess,
    refetch,
  };
};

export const getCategoryById = async (id: string): Promise<CategoryProps | null> => {
  try {
    const response: ApiResponse<{ data: CategoryProps }> = await apiClient.get(`/categories/${id}`);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to fetch category',
      });
      return null;
    }
    return response.data ? response.data.data : null;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while fetching the category.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useCategoryById = (id: string) => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<CategoryProps | null>({
    queryKey: ['categoryQuery', id],
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });

  return {
    category: data,
    error,
    isLoading,
    isFetching,
    isSuccess,
    refetch,
  };
};

const createCategories = async (category: z.infer<typeof createCategoriesSchema>): Promise<CategoryProps | null> => {
  try {
    const response: ApiResponse<{ data: CategoryProps }> = await apiClient.post('/categories', category);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to create category',
      });
      return null;
    }
    return response.data ? response.data.data : null;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while creating the category.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isError, isPending, isSuccess, data } = useMutation({
    mutationFn: createCategories,
    onSuccess: (data) => {
      if (data) {
        toast.success('Category created successfully');
        queryClient.invalidateQueries({ queryKey: ['categoriesQuery'] });
      }
    },
  });

  return {
    createCategory: mutateAsync,
    isError,
    isPending,
    isSuccess,
    data,
  };
};

const updateCategory = async ({
  id,
  category,
}: {
  id: string;
  category: z.infer<typeof createCategoriesSchema>;
}): Promise<CategoryProps | null> => {
  try {
    const response: ApiResponse<{ data: CategoryProps }> = await apiClient.put(`/categories/${id}`, category);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to update category',
      });
      return null;
    }
    return response.data ? response.data.data : null;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while updating the category.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (data) => {
      if (data) {
        toast.success('Category updated successfully');
        queryClient.invalidateQueries({ queryKey: ['categoriesQuery'] });
      }
    },
  });
};

const addSubCategory = async (
  subCategory: z.infer<typeof createSubCategoriesSchema>
): Promise<CategoryProps | null> => {
  try {
    const response: ApiResponse<{ data: CategoryProps }> = await apiClient.post(
      `/categories/${subCategory.category}/subcategory`,
      subCategory
    );
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to add subcategory',
      });
      return null;
    }
    return response.data ? response.data.data : null;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while adding the subcategory.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useAddSubCategory = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isError, isPending, isSuccess, data } = useMutation({
    mutationFn: addSubCategory,
    onSuccess: () => {
      toast.success('Subcategory added successfully');
      queryClient.invalidateQueries({ queryKey: ['categoriesQuery'] });
    },
  });
  return {
    addSubCategory: mutateAsync,
    isError,
    isPending,
    isSuccess,
    data,
  };
};

const getSubcategories = async (categoryId?: string): Promise<SubCategoryProps[]> => {
  try {
    const response: ApiResponse<{ data: SubCategoryProps[] }> = await apiClient.get(
      categoryId ? `/categories/subcategory?category=${categoryId}` : `/categories/subcategory`
    );
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to fetch subcategories',
      });
      return [];
    }
    return response.data ? response.data.data : [];
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while fetching subcategories.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useSubcategories = (categoryId?: string) => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<SubCategoryProps[]>({
    queryKey: ['subcategoriesQuery', categoryId],
    queryFn: () => getSubcategories(categoryId),
  });

  return {
    subcategories: data || [],
    error,
    isLoading,
    isFetching,
    isSuccess,
    refetch,
  };
};
