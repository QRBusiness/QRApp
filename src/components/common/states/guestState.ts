import { GUEST_STORAGE } from '@/constants';
import { proxy, useSnapshot } from 'valtio';
import { loadFromSessionStorage, saveToSessionStorage } from '@/libs/utils';

interface Guest {
  name: string;
  area: string;
  table: string;
  business: string;
}

const initialGuest: Guest = {
  name: '',
  area: '',
  table: '',
  business: '',
};

const initialGuestFromStorage: Guest = loadFromSessionStorage(GUEST_STORAGE, initialGuest);

const guestState = proxy(initialGuestFromStorage);

export const useGuestState = () => {
  const currentGuest = useSnapshot(guestState);
  return {
    name: currentGuest.name,
    area: currentGuest.area,
    table: currentGuest.table,
    business: currentGuest.business,
  };
};

export const useSetGuestState = (guest: Partial<Guest>) => {
  guestState.name = guest.name || initialGuest.name;
  guestState.area = guest.area || initialGuest.area;
  guestState.table = guest.table || initialGuest.table;
  guestState.business = guest.business || initialGuest.business;
  saveToSessionStorage(GUEST_STORAGE, guestState);
};

export const useSetGuestName = (name: string) => {
  guestState.name = name;
  saveToSessionStorage(GUEST_STORAGE, guestState);
};

export const useSetAreaAndTable = ({ area, table }: { area: string; table: string }) => {
  guestState.area = area;
  guestState.table = table;
  saveToSessionStorage(GUEST_STORAGE, guestState);
};

export const useSetBusiness = (business: string) => {
  guestState.business = business;
  saveToSessionStorage(GUEST_STORAGE, guestState);
};
