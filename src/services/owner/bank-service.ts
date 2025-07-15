import apiClient, { type ApiResponse, type ErrorResponse } from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import type { configureBanksSchema } from '@/utils/schemas';

export interface bankResponse {
  id: string;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  short_name: string;
  support: number;
  isTransfer: number;
}

const getBanksInfo = async (): Promise<bankResponse[]> => {
  try {
    const response: ApiResponse<{ data: bankResponse[] }> = await apiClient.get('/payment/banks');

    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to fetch banks',
      });
      return [];
    }
    return response.data ? response.data.data : [];
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while fetching banks.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useBanksInfo = (options?: { enabled?: boolean }) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['banksInfo'],
    queryFn: getBanksInfo,
    enabled: options?.enabled ?? true,
  });

  return {
    data,
    error,
    isLoading,
    refetch,
  };
};

interface ConfigureBankProps {
  accountNo: string;
  accountName: string;
  _id: string;
  acqId: string;
  created_at: string;
  updated_at: string;
}

const configureBank = async (data: z.infer<typeof configureBanksSchema>): Promise<ConfigureBankProps | null> => {
  try {
    const response: ApiResponse<{ data: ConfigureBankProps }> = await apiClient.post('/payment/banks', data);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to configure bank',
      });
      return null;
    }
    return response.data ? response.data.data : null;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while configuring the bank.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useConfigureBank = () => {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: configureBank,
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['banksQuery'] });
        queryClient.invalidateQueries({ queryKey: ['myBank'] });
        toast.success('Bank configured successfully');
      }
    },
  });

  return {
    configureBank: mutateAsync,
  };
};

const getMyBank = async (): Promise<ConfigureBankProps | null> => {
  try {
    const response: ApiResponse<{ data: ConfigureBankProps }> = await apiClient.get('/payment/my-bank');
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to fetch my bank',
      });
      return null;
    }
    return response.data ? response.data.data : null;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while fetching your bank.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useMyBank = (options?: { enabled?: boolean }) => {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ['myBank'],
    queryFn: getMyBank,
    enabled: options?.enabled ?? true, // Default là true
  });

  return {
    data,
    error,
    isLoading,
    refetch,
  };
};
