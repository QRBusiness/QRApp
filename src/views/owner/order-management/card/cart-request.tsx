import { useProcessRequest } from '@/services/owner/request-service';
import { Check, Clock9, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn, formattedDate } from '@/libs/utils';
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

const CartRequest = ({ _id, created_at, status, area, service_unit, guest_name, reason }: CartRequestProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { processRequest } = useProcessRequest();

  const onConfirm = async () => {
    await processRequest(_id);
  };

  return (
    <Card className="h-full flex flex-row items-center justify-between p-2 w-full relative">
      <div className="flex flex-col gap-2 w-full">
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
          <span>{t('module.card.guestName')}:</span> <p className="font-semibold">{guest_name || 'N/A'}</p>
        </div>
        {reason && (
          <div className="flex items-center space-x-2">
            <span>{t('module.card.reason')}:</span> <p className="font-semibold">{reason || 'N/A'}</p>
          </div>
        )}
        <div className={cn('flex flex-col items-end justify-end h-full w-full', isMobile ? 'block' : 'block')}>
          {status === 'Waiting' && (
            <Button onClick={onConfirm} className="w-full" variant="default">
              <Check />
              {t('module.card.button.confirm')}
            </Button>
          )}
        </div>
      </div>
      <div className="absolute right-2 top-2 z-10">
        <StatusBadge status={status as 'Waiting' | 'Pending' | 'Cancelled' | 'Completed'} />
      </div>
      {/* <div className={cn('flex flex-col items-end justify-end h-full', isMobile ? 'hidden' : '')}>
        {status === 'Waiting' && (
          <Button onClick={onConfirm} className="w-full" variant="default">
            <Check />
            Confirm
          </Button>
        )}
      </div> */}
    </Card>
  );
};

export default CartRequest;
