import React from 'react';
import { type OrderResponseProps, useOrders } from '@/services/owner/order-service';
import CardOrderItem from './card-order-item';

export const CardOrders = () => {
  const [data, setData] = React.useState<OrderResponseProps[]>([]);
  const { orders } = useOrders();

  React.useEffect(() => {
    if (orders && orders.length > 0) {
      setData(orders);
    }
  }, [orders]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-14">
      {data.map((order) => (
        <CardOrderItem key={order._id} order={order} />
      ))}
    </div>
  );
};
export default CardOrders;
