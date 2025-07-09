import { useRequests } from '@/services/owner/request-service';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import CartRequest from '../card/cart-request';

const RequestBar = () => {
  const { requests } = useRequests({ status: 'Waiting' });
  if (!requests || requests.length === 0) {
    return (
      <div className="mx-auto w-full max-w-7xl p-4">
        <p className="text-center text-muted-foreground">No requests available</p>
      </div>
    );
  }
  return (
    <ScrollArea className="w-full h-full p-4">
      <div className="flex flex-row gap-2">
        {requests.map((request) => (
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
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default RequestBar;
