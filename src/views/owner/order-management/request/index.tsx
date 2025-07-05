import { ScrollArea } from '@/components/ui/scroll-area';
import type { CartRequestProps } from '../card/cart-request';
import CartRequest from '../card/cart-request';

interface RequestBarProps {
  data: CartRequestProps[];
}

const RequestBar = ({ data }: RequestBarProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl p-4">
        <p className="text-center text-muted-foreground">No requests available</p>
      </div>
    );
  }
  return (
    <ScrollArea className="w-full">
      <div className="flex flex-row gap-2">
        {data.map((request) => (
          <CartRequest
            key={request._id}
            _id={request._id}
            created_at={request.created_at}
            updated_at={request.updated_at}
            type={request.type}
            reason={request.reason}
            status={request.status}
            area={request.area}
            service_unit={request.service_unit}
            guest_name={request.guest_name}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default RequestBar;
