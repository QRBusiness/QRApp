import { USER_ORDER_STORAGE } from '@/constants';
import { proxy, useSnapshot } from 'valtio';
import { loadFromSessionStorage } from '@/libs/utils';
import { type CartItem } from './cartState';

export interface GuestOrderProps {
  type: string;
  reason: string;
  service_unit: string;
  area: string;
  guest_name: string;
  items: CartItem[];
}

export type GuestOrdersProps = GuestOrderProps[];

const initialGuestOrderFromStorage: GuestOrdersProps = loadFromSessionStorage(USER_ORDER_STORAGE, []);

const guestOrdersState = proxy(initialGuestOrderFromStorage);

export const useGuestOrderState = () => {
  const orders = useSnapshot(guestOrdersState);
  return { orders };
};
export const useSetGuestOrderState = (order: Partial<GuestOrderProps>) => {
  // Update or add the order
  const existingOrderIndex = guestOrdersState.findIndex(
    (o) => o.type === order.type && o.guest_name === order.guest_name
  );
  if (existingOrderIndex > -1) {
    // Update existing order
    guestOrdersState[existingOrderIndex] = { ...guestOrdersState[existingOrderIndex], ...order };
  } else {
    // Add new order
    guestOrdersState.push({ ...order, items: order.items || [] } as GuestOrderProps);
  }
  // Save to session storage
  localStorage.setItem(USER_ORDER_STORAGE, JSON.stringify(guestOrdersState));
};
