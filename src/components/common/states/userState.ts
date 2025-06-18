import { proxy, useSnapshot } from 'valtio';

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
const userState: userPros = proxy({
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
});

export default userState;

export const useUserState = () => {
  return useSnapshot(userState);
};

export const setUserState = (newState: Partial<userPros>) => {
  Object.assign(userState, newState);
};
