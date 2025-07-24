import { useGuestOrderState } from '@/components/common/states/guestOrderState';
import { Button } from '@/components/ui/button';

const UserOrder = () => {
  const { orders } = useGuestOrderState();

  return (
    <div className="w-full px-2 mx-auto space-y flex flex-col items-center justify-between h-full space-y-4">
      <div className="flex flex-1 flex-col items-center justify-start w-full space-y-4">
        <h1 className="text-2xl font-bold">User Order Page</h1>
        {/* Display order details here */}
        {orders.length > 0 && (
          <ul className="list-disc pl-5">
            {orders.map((item, index) => (
              <li key={index} className="mb-2">
                <div className="flex justify-between">
                  <span>{item.guest_name}</span>
                  <span>{item.items.length} items</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button className="w-full">Call Staff for payment</Button>
    </div>
  );
};
export default UserOrder;
