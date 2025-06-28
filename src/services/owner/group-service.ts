import apiClient, { type ApiResponse, type ErrorResponse } from '@/services';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { createGroupSchema } from '@/utils/schemas';
import type { User } from '../admin/business-owner-service';

export interface Permission {
  _id: string;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface GroupResponse {
  _id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  permissions: Permission[];
  users: User[];
}

export interface GroupResponseData {
  data: GroupResponse[];
}

const getGroups = async (): Promise<GroupResponse[]> => {
  try {
    const response: ApiResponse<GroupResponseData> = await apiClient.get('/groups');
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to fetch groups',
      });
      return [];
    }
    return response.data ? response.data.data : [];
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while fetching groups.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useGroups = () => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<GroupResponse[]>({
    queryKey: ['groupsQuery'],
    queryFn: getGroups,
  });

  if (error) {
    toast.error('Failed to load groups', {
      description: error.message || 'An error occurred while fetching groups.',
    });
  }

  return {
    groups: data || [],
    isLoading,
    isFetching,
    isSuccess,
    refetch,
  };
};

export interface SingleGroupResponse {
  data: GroupResponse;
}
const getGroupById = async (id: string): Promise<GroupResponse> => {
  try {
    const response: ApiResponse<SingleGroupResponse> = await apiClient.get(`/groups/${id}`);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to fetch group',
      });
      throw new Error(response.errorMessage || 'Failed to fetch group');
    }
    return response.data.data;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while fetching group.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useGroupById = ({ id }: { id: string }) => {
  const { data, error, isLoading, isFetching, isSuccess, refetch } = useQuery<GroupResponse>({
    queryKey: ['groupQuery', id],
    queryFn: () => getGroupById(id),
  });

  if (error) {
    toast.error('Failed to load group', {
      description: error.message || 'An error occurred while fetching group.',
    });
  }

  return {
    group: data || null,
    isLoading,
    isFetching,
    isSuccess,
    refetch,
  };
};

const createGroup = async (data: z.infer<typeof createGroupSchema>): Promise<GroupResponse> => {
  try {
    const response: ApiResponse<SingleGroupResponse> = await apiClient.post('/groups', data);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to create group',
      });
      throw new Error(response.errorMessage || 'Failed to create group');
    }
    return response.data.data;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while creating group.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, error, isPending, isSuccess, data } = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupsQuery'] });
      toast.success('Group created successfully');
    },
  });

  return {
    createGroup: mutateAsync,
    isError: !!error,
    isPending,
    isSuccess,
    data,
  };
};

const updateGroup = async ({
  data,
  id,
}: {
  data: z.infer<typeof createGroupSchema>;
  id: string;
}): Promise<GroupResponse> => {
  try {
    const response: ApiResponse<SingleGroupResponse> = await apiClient.put(`/groups/${id}`, data);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to update group',
      });
      throw new Error(response.errorMessage || 'Failed to update group');
    }
    return response.data.data;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while updating group.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, error, isPending, isSuccess, data } = useMutation({
    mutationFn: updateGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupsQuery'] });
      toast.success('Group updated successfully');
    },
  });

  return {
    updateGroup: mutateAsync,
    isError: !!error,
    isPending,
    isSuccess,
    data,
  };
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, error, isPending, isSuccess, data } = useMutation({
    mutationFn: async (groupId: string) => {
      const response: ApiResponse<{ message: string }> = await apiClient.delete(`/groups/${groupId}`);
      if (response.status !== 200 && response.status !== 201) {
        toast.error(response.error, {
          description: response.errorMessage || 'Failed to delete group',
        });
        throw new Error(response.errorMessage || 'Failed to delete group');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupsQuery'] });
      toast.success('Group deleted successfully');
    },
  });

  return {
    deleteGroup: mutateAsync,
    isError: !!error,
    isPending,
    isSuccess,
    data,
  };
};

const addGroupPermission = async ({
  groupId,
  permissions,
}: {
  groupId: string;
  permissions: string[];
}): Promise<GroupResponse> => {
  try {
    const response: ApiResponse<SingleGroupResponse> = await apiClient.post(
      `/groups/${groupId}/permissions`,
      permissions
    );
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to add permission to group',
      });
      throw new Error(response.errorMessage || 'Failed to add permission to group');
    }
    return response.data.data;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while adding permission to group.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useAddGroupPermission = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, error, isPending, isSuccess, data } = useMutation({
    mutationFn: addGroupPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupsQuery'] });
      toast.success('Permission added to group successfully');
    },
  });

  return {
    addGroupPermission: mutateAsync,
    isError: !!error,
    isPending,
    isSuccess,
    data,
  };
};

const removeGroupPermission = async ({
  groupId,
  permissions,
}: {
  groupId: string;
  permissions: string[];
}): Promise<GroupResponse> => {
  try {
    const response: ApiResponse<SingleGroupResponse> = await apiClient.delete(`/groups/${groupId}/permissions`, {
      data: permissions,
    });
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to remove permission from group',
      });
      throw new Error(response.errorMessage || 'Failed to remove permission from group');
    }
    return response.data.data;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while removing permission from group.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useRemoveGroupPermission = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, error, isPending, isSuccess, data } = useMutation({
    mutationFn: removeGroupPermission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupsQuery'] });
      toast.success('Permission removed from group successfully');
    },
  });

  return {
    removeGroupPermission: mutateAsync,
    isError: !!error,
    isPending,
    isSuccess,
    data,
  };
};

const addGroupUser = async ({ groupId, userId }: { groupId: string; userId: string }): Promise<boolean> => {
  try {
    const response: ApiResponse<SingleGroupResponse> = await apiClient.post(`/groups/${groupId}/user/${userId}`);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to add user to group',
      });
      throw new Error(response.errorMessage || 'Failed to add user to group');
    }
    return response.data.data ? true : false;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while adding user to group.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useAddGroupUser = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, error, isPending, isSuccess, data } = useMutation({
    mutationFn: addGroupUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupsQuery'] });
      toast.success('User added to group successfully');
    },
  });

  return {
    addGroupUser: mutateAsync,
    isError: !!error,
    isPending,
    isSuccess,
    data,
  };
};

const removeGroupUser = async ({ groupId, userId }: { groupId: string; userId: string }): Promise<boolean> => {
  try {
    const response: ApiResponse<SingleGroupResponse> = await apiClient.delete(`/groups/${groupId}/user/${userId}`);
    if (response.status !== 200 && response.status !== 201) {
      toast.error(response.error, {
        description: response.errorMessage || 'Failed to remove user from group',
      });
      throw new Error(response.errorMessage || 'Failed to remove user from group');
    }
    return response.data.data ? true : false;
  } catch (error: ErrorResponse | any) {
    toast.error(error.message || 'Internal server error', {
      description: error.errorMessage || 'An unexpected error occurred while removing user from group.',
    });
    throw new Error(error.errorMessage || 'Internal server error');
  }
};

export const useRemoveGroupUser = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, error, isPending, isSuccess, data } = useMutation({
    mutationFn: removeGroupUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groupsQuery'] });
      toast.success('User removed from group successfully');
    },
  });

  return {
    removeGroupUser: mutateAsync,
    isError: !!error,
    isPending,
    isSuccess,
    data,
  };
};
