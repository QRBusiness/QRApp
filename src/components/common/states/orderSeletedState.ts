import type { OrderResponseProps } from '@/services/owner/order-service';
import { proxy, useSnapshot } from 'valtio';

export interface OrderSelectedStateProps {
  orders: OrderResponseProps[];
}

const initialOrderSelectedState: OrderSelectedStateProps = {
  orders: [],
};

export const orderSelectedState = proxy(initialOrderSelectedState);

export const useOrderSelectedState = () => {
  const state = useSnapshot(orderSelectedState);
  return { selectedOrders: state.orders };
};

export const useSetOrderSelectedState = (order: OrderResponseProps) => {
  // Check if the order already exists
  const existingOrderIndex = orderSelectedState.orders.findIndex((o) => o._id === order._id);

  if (existingOrderIndex > -1) {
    // If it exists, remove it
    orderSelectedState.orders.splice(existingOrderIndex, 1);
  } else {
    // If it doesn't exist, add it
    orderSelectedState.orders.push(order);
  }
};
