import { GUEST_STORAGE } from '@/constants';
import { proxy, useSnapshot } from 'valtio';
import { loadFromSessionStorage, saveToSessionStorage } from '@/libs/utils';

interface Guest {
  name: string;
  area: string;
  table: string;
}

const initialGuest: Guest = {
  name: '',
  area: '',
  table: '',
};

const initialGuestFromStorage: Guest = loadFromSessionStorage(GUEST_STORAGE, initialGuest);

const guestState = proxy(initialGuestFromStorage);

export const useGuestState = () => {
  const currentGuest = useSnapshot(guestState);
  return {
    name: currentGuest.name,
    area: currentGuest.area,
    table: currentGuest.table,
  };
};

export const useSetGuestState = (guest: Partial<Guest>) => {
  guestState.name = guest.name || initialGuest.name;
  guestState.area = guest.area || initialGuest.area;
  guestState.table = guest.table || initialGuest.table;
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
