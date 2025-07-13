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
  category?: CategoryProps | null;
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
  const { mutateAsync, isError, isSuccess, data } = useMutation({
    mutationFn: updateCategory,
    onSuccess: (data) => {
      if (data) {
        toast.success('Category updated successfully');
        queryClient.invalidateQueries({ queryKey: ['categoriesQuery'] });
      }
    },
  });
  return {
    updateCategory: mutateAsync,
    isError,
    data,
    isSuccess,
  };
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
      queryClient.invalidateQueries({ queryKey: ['subcategoriesQuery'] });
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

export const getSubcategories = async (categoryId?: string): Promise<SubCategoryProps[]> => {
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

export interface CategoryRequest {
  business: string;
  page?: number;
  limit?: number;
}

const getCategoriesByBusiness = async (request: CategoryRequest): Promise<CategoryProps[]> => {
  try {
    const response: ApiResponse<{ data: CategoryProps[] }> = await apiClient.get(`/category/${request.business}`, {
      params: request,
    });
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to fetch categories for business',
      });
      return [];
    }
    return response.data ? response.data.data : [];
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while fetching categories for business.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const usePublicCategories = (request: CategoryRequest) => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<CategoryProps[]>({
    queryKey: ['categoriesByBusinessQuery', request.business],
    queryFn: () => getCategoriesByBusiness(request),
    enabled: !!request.business,
  });

  return {
    categoriesByBusiness: data || [],
    error,
    isLoading,
    isFetching,
    isSuccess,
    refetch,
  };
};

const getPublicSubcategories = async (request: CategoryRequest): Promise<SubCategoryProps[]> => {
  try {
    const response: ApiResponse<{ data: SubCategoryProps[] }> = await apiClient.get(
      `/sub-category/${request.business}`
    );
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to fetch subcategories for category',
      });
      return [];
    }
    return response.data ? response.data.data : [];
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while fetching subcategories for category.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const usePublicSubcategories = (request: CategoryRequest) => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<SubCategoryProps[]>({
    queryKey: ['publicSubcategoriesQuery', request.business],
    queryFn: () => getPublicSubcategories(request),
    enabled: !!request.business,
  });

  return {
    publicSubcategories: data || [],
    error,
    isLoading,
    isFetching,
    isSuccess,
    refetch,
  };
};

const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const response: ApiResponse<{ data: boolean }> = await apiClient.delete(`/categories/${id}`);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to delete category',
      });
      return false;
    }
    return response.data ? response.data.data : false;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while deleting the category.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isError, isPending, isSuccess, data } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success('Category deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['categoriesQuery'] });
    },
  });

  return {
    deleteCategory: mutateAsync,
    isError,
    isPending,
    isSuccess,
    data,
  };
};

const deleteSubCategory = async (id: string): Promise<boolean> => {
  try {
    const response: ApiResponse<{ data: boolean }> = await apiClient.delete(`/categories/${id}/subcategory`);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to delete subcategory',
      });
      return false;
    }
    return response.data ? response.data.data : false;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while deleting the subcategory.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isError, isPending, isSuccess, data } = useMutation({
    mutationFn: deleteSubCategory,
    onSuccess: () => {
      toast.success('Subcategory deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['subcategoriesQuery'] });
    },
  });

  return {
    deleteSubCategory: mutateAsync,
    isError,
    isPending,
    isSuccess,
    data,
  };
};

const updateSubCategory = async ({
  id,
  subCategory,
}: {
  id: string;
  subCategory: z.infer<typeof createSubCategoriesSchema>;
}): Promise<SubCategoryProps | null> => {
  try {
    const response: ApiResponse<{ data: SubCategoryProps }> = await apiClient.put(
      `/categories/subcategory/${id}`,
      subCategory
    );
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to update subcategory',
      });
      return null;
    }
    return response.data ? response.data.data : null;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while updating the subcategory.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};
export const useUpdateSubCategory = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isError, isSuccess, data } = useMutation({
    mutationFn: updateSubCategory,
    onSuccess: (data) => {
      if (data) {
        toast.success('Subcategory updated successfully');
        queryClient.invalidateQueries({ queryKey: ['subcategoriesQuery'] });
      }
    },
  });

  return {
    updateSubCategory: mutateAsync,
    isError,
    data,
    isSuccess,
  };
};
