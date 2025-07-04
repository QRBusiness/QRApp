import type { OrderItem } from './card-order-item';
import CardOrderItem from './card-order-item';

export const CardOrders = () => {
  const orders: OrderItem[] = [
    {
      id: 'ORD25061502',
      status: 'completed',
      table: 'Table 5',
      area: 'Indoor',
      customer: { name: 'Sophia Lee' },
      createdAt: '2023-10-01T13:15:00Z',
      totalAmount: '$32.50',
      items: [
        {
          name: 'Cappuccino',
          quantity: 2,
          price: '$4.50',
          size: 'M',
          notes: 'Extra foam',
          options: [{ option: 'Milk: Whole', price: 1.5 }],
        },
        {
          name: 'Blueberry Pancakes',
          quantity: 1,
          price: '$10.00',
          size: 'L',
          notes: '',
          options: [{ option: 'Syrup: Maple', price: 2 }],
        },
        {
          name: 'Fruit Salad',
          quantity: 1,
          price: '$7.50',
          size: 'S',
          notes: 'No bananas',
          options: [{ option: 'Dressing: Honey', price: 1.5 }],
        },
      ],
    },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-14">
      {orders.map((order) => (
        <CardOrderItem key={order.id} order={order} />
      ))}
    </div>
  );
};
export default CardOrders;
