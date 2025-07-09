import CardOrders from './card/card-orders';
import RequestBar from './request';

const OrderManager = () => {
  return (
    <div className="w-full p-4 mx-auto flex flex-col gap-4">
      <div className="flex flex-col gap-2 mb-4">
        <h1 className="text-xl font-semibold">Unassigned Requests</h1>
        <RequestBar />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Orders</h2>
        <CardOrders />
      </div>
    </div>
  );
};

export default OrderManager;
