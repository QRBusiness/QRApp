import apiClient, { type ApiResponse, type ErrorResponse } from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import type { createBusinessSchema } from '@/utils/schemas';

interface BusinessInputProps {
  page: number;
  limit: number;
}
interface BusinessResponse {
  data: BusinessProps[];
}

interface BusinessType {
  _id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string;
}

interface BusinessProps {
  _id: string;
  name: string;
  address: string;
  contact: string;
  tax_code: string;
  available: boolean;
  created_at: string;
  updated_at: string;
  business_type: BusinessType;
}

const getBusiness = async ({ page = 1, limit = 50 }: BusinessInputProps): Promise<BusinessProps[]> => {
  try {
    const response: ApiResponse<BusinessResponse> = await apiClient.get('/business', {
      params: { page, limit },
    });
    if (response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to fetch business services',
      });
      return [];
    }
    return response.data ? response.data.data : [];
  } catch (error: ErrorResponse | any) {
    toast.error((error as ErrorResponse).error, {
      description:
        (error as ErrorResponse).errorMessage || 'An unexpected error occurred while fetching business services.',
    });
    throw new Error((error as ErrorResponse).errorMessage || 'Internal server error');
  }
};

export const useBusiness = ({ page = 1, limit = 50 }: BusinessInputProps) => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<BusinessProps[]>({
    queryKey: ['businessQuery'],
    queryFn: () => getBusiness({ page, limit }),
  });

  return {
    business: data || [],
    isLoading,
    isError: !!error,
    isFetching,
    isSuccess,
    refetch,
  };
};

interface CreateBusinessInput {
  username: string;
  password: string;
  owner_name: string;
  owner_address: string;
  owner_contact: string;
  business_name: string;
  business_address: string;
  business_contact: string;
  business_type: string;
  business_tax_code: string;
}

const createBusiness = async ({
  username,
  password,
  owner_name,
  owner_address,
  owner_contact,
  business_name,
  business_address,
  business_contact,
  business_type,
  business_tax_code,
}: CreateBusinessInput): Promise<BusinessProps> => {
  try {
    const response: ApiResponse<BusinessProps> = await apiClient.post('/business', {
      username,
      password,
      owner_name,
      owner_address,
      owner_contact,
      business_name,
      business_address,
      business_contact,
      business_type,
      business_tax_code,
    });
    if (response.status !== 201 && response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to create business',
      });
      throw new Error(response.errorMessage || 'Failed to create business');
    }
    return response.data;
  } catch (error: ErrorResponse | any) {
    toast.error((error as ErrorResponse).error || 'Internal server error', {
      description: (error as ErrorResponse).errorMessage || 'An unexpected error occurred while creating the business.',
    });
    throw new Error((error as ErrorResponse).errorMessage || 'Internal server error');
  }
};

export const useCreateBusiness = () => {
  const { mutateAsync, data, isPending, isError, isSuccess } = useMutation({
    mutationFn: createBusiness,
    onSuccess: (data: BusinessProps) => {
      toast.success('Business created successfully', {
        description: `Business ${data.name} has been created.`,
      });
    },
  });

  return {
    createBusiness: mutateAsync,
    data,
    isPending,
    isError,
    isSuccess,
  };
};

const toggleAvailableBusiness = async (id: string): Promise<BusinessProps> => {
  try {
    const response: ApiResponse<BusinessProps> = await apiClient.put(`/business/active/${id}`);
    if (response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to toggling enable/disable business',
      });
      throw new Error(response.errorMessage || 'Failed to toggling enable/disable business');
    }
    return response.data;
  } catch (error: ErrorResponse | any) {
    toast.error((error as ErrorResponse).error, {
      description:
        (error as ErrorResponse).errorMessage ||
        'An unexpected error occurred while toggling enable/disable the business.',
    });
    throw new Error('Internal server error');
  }
};

export const useToggleAvailableBusiness = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, data, isPending, isError, isSuccess } = useMutation({
    mutationFn: toggleAvailableBusiness,
    onSuccess: (data: BusinessProps) => {
      toast.success('Business status updated successfully', {
        description: `Business ${data.name} has been updated.`,
      });
      queryClient.invalidateQueries({
        queryKey: ['businessQuery'],
      });
    },
  });

  return {
    toggleAvailableBusiness: mutateAsync,
    data,
    isPending,
    isError,
    isSuccess,
  };
};

const updateBusiness = async (
  { name, address, contact, businessType, businessTaxCode }: z.infer<typeof createBusinessSchema>,
  id: string
): Promise<BusinessProps> => {
  try {
    const response: ApiResponse<BusinessProps> = await apiClient.put(`/business/${id}`, {
      name,
      address,
      contact,
      business_type: businessType,
      tax_code: businessTaxCode,
    });
    debugger;
    if (response.status !== 200) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to update business',
      });
      throw new Error(response.errorMessage || 'Failed to update business');
    }
    return response.data;
  } catch (error: ErrorResponse | any) {
    toast.error((error as ErrorResponse).error, {
      description: (error as ErrorResponse).errorMessage || 'An unexpected error occurred while updating the business.',
    });
    throw new Error(
      (error as ErrorResponse).errorMessage || 'An unexpected error occurred while updating the business.'
    );
  }
};

export const useUpdateBusiness = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, data, isPending, isError, isSuccess } = useMutation({
    mutationFn: ({ data, id }: { data: z.infer<typeof createBusinessSchema>; id: string }) => updateBusiness(data, id),
    onSuccess: (data: BusinessProps) => {
      toast.success('Business updated successfully', {
        description: `Business ${data.name} has been updated.`,
      });
      queryClient.invalidateQueries({
        queryKey: ['businessQuery'],
      });
    },
  });

  return {
    updateBusiness: mutateAsync,
    data,
    isPending,
    isError,
    isSuccess,
  };
};
