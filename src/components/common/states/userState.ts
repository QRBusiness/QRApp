import { USER_SESSION } from '@/constains';
import { proxy, useSnapshot } from 'valtio';
import { loadFromLocalStorage, saveToLocalStorage } from '@/libs/utils';

interface userPros {
  _id: string;
  name: string;
  phone: string;
  address: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  role: string;
  permissions: any[];
  business: {
    _id: string;
  };
  group: any[];
}

export const defaultUserState: userPros = {
  _id: '',
  name: '',
  phone: '',
  address: '',
  image_url: '',
  created_at: '',
  updated_at: '',
  role: '',
  permissions: [],
  business: {
    _id: '',
  },
  group: [],
};
const oldUserState = loadFromLocalStorage(USER_SESSION, defaultUserState);
const userState: userPros = proxy(oldUserState);

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
