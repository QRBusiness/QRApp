import { useProcessRequest } from '@/services/owner/request-service';
import { Check, Clock9, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formattedDate } from '@/libs/utils';
import StatusBadge from '../status/status-baged';

export interface CartRequestProps {
  _id: string;
  created_at: string;
  updated_at: string;
  type: string;
  reason: string;
  status: string;
  area: {
    _id: string;
    name: string;
  };
  service_unit: {
    _id: string;
    name: string;
  };
  guest_name: string;
}

const CartRequest = ({ _id, created_at, status, area, service_unit, guest_name }: CartRequestProps) => {
  const { processRequest } = useProcessRequest();

  const onAssignToMe = async () => {
    await processRequest(_id);
  };

  return (
    <Card className="h-full flex flex-row items-center justify-between p-3 w-[400px]">
      <div className="flex flex-col gap-2">
        <div className="font-semibold flex flex-row items-center">
          <p>ID: </p>
          <span className="text-primary ml-1">{_id}</span>
        </div>
        <p className="flex items-center gap-2 text-muted-foreground">
          <Clock9 className="size-4" />
          <span>{formattedDate(created_at)}</span>
        </p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4" />
          <span>
            {area.name || 'Unknown Area'} - {service_unit.name || 'Unknown Unit'}
          </span>
        </p>

        <div className="flex items-center space-x-2">
          <span>Guest Name:</span> <p className="font-semibold">{guest_name || 'N/A'}</p>
        </div>
      </div>
      <div className="flex flex-col items-start justify-between gap-2 h-full flex-1">
        <StatusBadge status={status as 'Waiting' | 'Pending' | 'Cancelled' | 'Completed'} />
        <Button onClick={onAssignToMe} className="w-full" variant="default">
          <Check />
          Confirm
        </Button>
      </div>
    </Card>
  );
};

export default CartRequest;
