import { useRequests } from '@/services/owner/request-service';
import CardOrders from './card/card-orders';
import RequestBar from './request';

const OrderManager = () => {
  const { requests } = useRequests({ status: 'Waiting' });
  return (
    <div className="w-full p-4 mx-auto flex flex-col gap-4">
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-xl font-semibold">Current Unassigned Requests</h1>
        <RequestBar data={requests} />
      </div>
      <div>
        <h2 className="text-xl font-semibold">Orders</h2>
        <CardOrders />
      </div>
    </div>
  );
};

export default OrderManager;
