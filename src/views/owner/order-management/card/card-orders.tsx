import type { OrderItem } from './card-order-item';
import CardOrderItem from './card-order-item';

export const CardOrders = () => {
  const orders: OrderItem[] = [
    {
      id: 'ORD25061502',
      status: 'Pending',
      table: 'Table 5',
      area: 'Indoor',
      customer: { name: 'Sophia Lee' },
      createdAt: '2023-10-01T13:15:00Z',
      totalAmount: 100000,
      items: [
        {
          _id: 'item1',
          name: 'Cappuccino',
          quantity: 2,
          price: 45000,
          variant: 'M',
          note: 'Extra foam',
          options: ['Milk: Whole'],
        },
        {
          _id: 'item2',
          name: 'Blueberry Pancakes',
          quantity: 1,
          price: 75000,
          variant: 'L',
          note: '',
          options: ['Syrup: Maple'],
        },
        {
          _id: 'item3',
          name: 'Fruit Salad',
          quantity: 1,
          price: 30000,
          variant: 'S',
          note: 'No bananas',
          options: ['Dressing: Honey'],
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
