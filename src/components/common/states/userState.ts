import { USER_PERMISSIONS, USER_SESSION } from '@/constants';
import type { Permission } from '@/services/owner/group-service';
import { proxy, useSnapshot } from 'valtio';
import { loadFromLocalStorage, saveToLocalStorage } from '@/libs/utils';

interface userPros {
  _id: string;
  name: string;
  phone: string;
  address: string;
  image_url: string;
  available: boolean;
  username: string;
  created_at: string;
  updated_at: string;
  role: string;
  business: {
    _id: string;
  };
  branch: {
    _id: string;
  };
  expired_at: string; // Optional field for business expiration date
}
interface permissionProps {
  permissions: Permission[];
}

export const defaultUserState: userPros = {
  _id: '',
  name: '',
  phone: '',
  address: '',
  image_url: '',
  available: false,
  username: '',
  created_at: '',
  updated_at: '',
  role: '',
  business: {
    _id: '',
  },
  branch: {
    _id: '',
  },
  expired_at: '',
};

export const defaultPermissionState: permissionProps = {
  permissions: [],
};

const oldUserState = loadFromLocalStorage(USER_SESSION, defaultUserState);
const userState: userPros = proxy(oldUserState);
const oldPermissionState = loadFromLocalStorage(USER_PERMISSIONS, defaultPermissionState);
const permissionState: permissionProps = proxy(oldPermissionState);

export default userState;

export const useUserState = () => {
  return useSnapshot(userState);
};

export const setUserState = (newState: Partial<userPros>) => {
  // Ensure newState is an object and not null or undefined
  if (typeof newState !== 'object' || newState === null) {
    throw new Error('Invalid state object provided');
  }
  saveToLocalStorage(USER_SESSION, newState);
  Object.assign(userState, newState);
};

export const useUserPermissions = () => {
  const permissions = useSnapshot(permissionState);
  return { permissions: permissions.permissions };
};

export const setUserPermissions = (permissions: Permission[]) => {
  if (!Array.isArray(permissions)) {
    throw new Error('Permissions must be an array');
  }
  permissionState.permissions = permissions;
  saveToLocalStorage(USER_PERMISSIONS, { permissions });
};

export const useSetUserProfile = (name: string, phone: string, address: string, image_url: string) => {
  userState.name = name;
  userState.phone = phone;
  userState.address = address;
  userState.image_url = image_url || '';
  setTimeout(() => saveToLocalStorage(USER_SESSION, { ...userState, name, phone, address, image_url }), 3000);
};
